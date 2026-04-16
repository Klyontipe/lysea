#!/usr/bin/env python3
import json
import os
import re
import sys
import urllib.parse
import urllib.request
from urllib.error import HTTPError
from datetime import datetime, timezone
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[1]
ENV_PATH = BASE_DIR / ".env"
OUTPUT_DIR = BASE_DIR / "data"
OUTPUT_PATH = OUTPUT_DIR / "facebook-posts.json"


def parse_env_file(path: Path) -> dict[str, str]:
    if not path.exists():
        return {}

    env: dict[str, str] = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if ":" in line:
            key, value = line.split(":", 1)
        elif "=" in line:
            key, value = line.split("=", 1)
        else:
            continue

        normalized_key = re.sub(r"\s+", " ", key.strip().lower())
        env[normalized_key] = value.strip().strip("\"'")
    return env


def pick(env: dict[str, str], *keys: str) -> str | None:
    for key in keys:
        value = env.get(key.lower())
        if value:
            return value
    return None


def fetch_json(url: str) -> dict:
    try:
        with urllib.request.urlopen(url, timeout=20) as response:
            return json.loads(response.read().decode("utf-8"))
    except HTTPError as exc:
        payload = exc.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(payload)
            message = (
                parsed.get("error", {}).get("message")
                or payload
            )
        except json.JSONDecodeError:
            message = payload or str(exc)
        raise RuntimeError(f"Graph API HTTP {exc.code}: {message}") from exc


def unique_keep_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        if not value or value in seen:
            continue
        seen.add(value)
        output.append(value)
    return output


def url_dedup_key(url: str) -> str:
    """Clé de dédoublonnage (ignore query / fragment, souvent identiques côté FB)."""
    try:
        parsed = urllib.parse.urlparse(url)
        return urllib.parse.urlunparse(
            (parsed.scheme, parsed.netloc, parsed.path, "", "", "")
        )
    except Exception:
        return url


def unique_keep_order_urls(values: list[str]) -> list[str]:
    seen: set[str] = set()
    output: list[str] = []
    for value in values:
        if not value:
            continue
        key = url_dedup_key(value)
        if key in seen:
            continue
        seen.add(key)
        output.append(value)
    return output


def extract_media(attachments: dict | None, full_picture: str | None) -> tuple[list[str], list[str]]:
    """
    Extrait images et vidéos sans doublons.
    - Les vidéos : on ne garde pas la miniature (image) ni full_picture en plus du player.
    - full_picture n'est ajouté que s'il n'y a pas de médias parsés depuis attachments.
    """
    images: list[str] = []
    videos: list[str] = []

    def walk(node: dict | None):
        if not node:
            return

        media = node.get("media") or {}
        if not isinstance(media, dict):
            media = {}

        media_type = (node.get("media_type") or "").upper()
        node_type = (node.get("type") or "").upper()

        image_obj = media.get("image")
        image_src = image_obj.get("src") if isinstance(image_obj, dict) else None

        video_src = media.get("source") if isinstance(media, dict) else None

        fallback_url = node.get("url")

        is_video = media_type in {"VIDEO", "VIDEO_INLINE"} or node_type in {"VIDEO", "VIDEO_INLINE"}

        if is_video:
            if video_src:
                videos.append(video_src)
            elif fallback_url:
                videos.append(fallback_url)
            # Pas d'image miniature pour les posts vidéo (évite doublon avec le player).
        elif media_type in {"PHOTO", "ALBUM", "SHARE"} or node_type in {"PHOTO", "ALBUM", "SHARE"}:
            if image_src:
                images.append(image_src)
            elif fallback_url and not is_video:
                images.append(fallback_url)

        subattachments = (node.get("subattachments") or {}).get("data") or []
        if isinstance(subattachments, list):
            for child in subattachments:
                if isinstance(child, dict):
                    walk(child)

    for item in (attachments or {}).get("data", []):
        if isinstance(item, dict):
            walk(item)

    images = unique_keep_order_urls(images)
    videos = unique_keep_order_urls(videos)

    if videos:
        # Pas de galerie d'images en parallèle d'une vidéo (affiche uniquement le player).
        images = []
    elif full_picture:
        fp_key = url_dedup_key(full_picture)
        if not any(url_dedup_key(img) == fp_key for img in images):
            images.insert(0, full_picture)
        images = unique_keep_order_urls(images)

    return images, videos


def normalize_post(raw: dict) -> dict | None:
    message = raw.get("message")
    message = message.strip() if isinstance(message, str) else None
    created_time = raw.get("created_time")
    permalink_url = raw.get("permalink_url")
    full_picture = raw.get("full_picture")
    attachments = raw.get("attachments")

    images, videos = extract_media(attachments, full_picture)

    has_content = bool(message) or bool(images) or bool(videos)
    if not has_content:
        return None

    return {
        "id": raw.get("id"),
        "message": message,
        "created_time": created_time,
        "permalink_url": permalink_url,
        "images": images,
        "videos": videos,
        "hasMedia": bool(images or videos),
    }


def build_posts_url(page_id: str, token: str, limit: int) -> str:
    fields = (
        "id,message,created_time,permalink_url,full_picture,"
        "attachments{media,media_type,subattachments,url,type}"
    )
    params = urllib.parse.urlencode(
        {
            "fields": fields,
            "limit": str(limit),
            "access_token": token,
        }
    )
    return f"https://graph.facebook.com/v25.0/{page_id}/posts?{params}"


def discover_page_id(token: str) -> str:
    params = urllib.parse.urlencode(
        {"fields": "id,name", "access_token": token}
    )
    me_url = f"https://graph.facebook.com/v25.0/me?{params}"
    data = fetch_json(me_url)
    page_id = data.get("id")
    if not page_id:
        raise RuntimeError("Impossible de déterminer PAGE_ID via /me.")
    return page_id


def get_managed_pages(user_token: str) -> list[dict]:
    params = urllib.parse.urlencode(
        {
            "fields": "id,name,access_token",
            "limit": "50",
            "access_token": user_token,
        }
    )
    url = f"https://graph.facebook.com/v25.0/me/accounts?{params}"
    data = fetch_json(url)
    pages = data.get("data") or []
    return [page for page in pages if isinstance(page, dict)]


def resolve_page_context(page_id: str | None, token: str) -> tuple[str | None, str]:
    """
    Renvoie (page_id, token_effectif).
    - Si `token` est un token utilisateur et que /me/accounts répond,
      on récupère le token de page correspondant à `page_id`.
    - Si `page_id` est absent, on prend la première page gérée.
    """
    try:
        pages = get_managed_pages(token)
    except Exception:
        return page_id, token

    if not pages:
        return page_id, token

    if page_id:
        for page in pages:
            if str(page.get("id")) == str(page_id):
                return str(page.get("id")), page.get("access_token") or token
        # PAGE_ID fourni mais non trouvé dans les pages gérées :
        # on bascule sur la première page disponible pour éviter un flux vide.
        first = pages[0]
        return str(first.get("id")), first.get("access_token") or token

    first = pages[0]
    return str(first.get("id")), first.get("access_token") or token


def main():
    env = parse_env_file(ENV_PATH)
    payload = None
    status_msg = ""

    try:
        token = pick(
            env,
            "page_access_token",
            "facebook_page_access_token",
            "token acces",
            "token access",
        )
        if not token:
            raise RuntimeError("Token Facebook introuvable dans .env.")

        page_id = pick(
            env,
            "page_id",
            "facebook_page_id",
            "id page facebook",
        )
        if not page_id:
            page_id = discover_page_id(token)

        page_id, effective_token = resolve_page_context(page_id, token)
        if not page_id:
            raise RuntimeError("PAGE_ID introuvable.")

        limit_raw = pick(env, "facebook_posts_limit")
        try:
            limit = int(limit_raw) if limit_raw else 20
        except ValueError:
            limit = 20

        posts_url = build_posts_url(page_id=page_id, token=effective_token, limit=limit)
        response = fetch_json(posts_url)
        raw_posts = response.get("data", [])

        normalized = [normalize_post(post) for post in raw_posts if isinstance(post, dict)]
        posts = [post for post in normalized if post is not None]

        posts.sort(key=lambda p: p.get("created_time") or "", reverse=True)

        payload = {
            "pageId": page_id,
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "count": len(posts),
            "posts": posts,
            "error": None,
        }
        status_msg = f"OK: {len(posts)} posts écrits dans {OUTPUT_PATH}"
    except Exception as exc:
        payload = {
            "pageId": locals().get("page_id"),
            "fetchedAt": datetime.now(timezone.utc).isoformat(),
            "count": 0,
            "posts": [],
            "error": str(exc),
        }
        status_msg = f"ERREUR: {exc}"

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(status_msg)


if __name__ == "__main__":
    main()
