#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

TARGET_FILE="data/facebook-posts.json"
CURRENT_BRANCH="$(git rev-parse --abbrev-ref HEAD)"

collect_other_changes() {
  local target="$1"
  mapfile -t changed_files < <(
    {
      git diff --name-only
      git diff --cached --name-only
      git ls-files --others --exclude-standard
    } | sort -u
  )

  local other=()
  for file in "${changed_files[@]}"; do
    [[ -z "$file" ]] && continue
    [[ "$file" == "$target" ]] && continue
    other+=("$file")
  done

  printf "%s\n" "${other[@]}"
}

echo "0/5 - Verification de securite..."
other_changes_before="$(collect_other_changes "$TARGET_FILE" || true)"
if [[ -n "${other_changes_before//$'\n'/}" ]]; then
  echo "Arret: des changements hors $TARGET_FILE sont presents."
  echo "Nettoie/commit ces fichiers avant ce script :"
  echo "$other_changes_before"
  exit 1
fi

if git show-ref --quiet --verify "refs/remotes/origin/$CURRENT_BRANCH"; then
  commits_ahead="$(git rev-list --count "origin/$CURRENT_BRANCH..HEAD")"
  if [[ "$commits_ahead" -ne 0 ]]; then
    echo "Arret: la branche locale a deja $commits_ahead commit(s) non pousses."
    echo "Pousse-les manuellement ou cree une branche dediee avant ce script."
    exit 1
  fi
fi

echo "1/5 - Synchronisation Facebook..."
python3 scripts/sync_facebook.py

if git diff --quiet -- "$TARGET_FILE"; then
  echo "2/5 - Aucun changement detecte dans $TARGET_FILE"
  echo "Rien a commit ni a push."
  exit 0
fi

other_changes_after="$(collect_other_changes "$TARGET_FILE" || true)"
if [[ -n "${other_changes_after//$'\n'/}" ]]; then
  echo "Arret: la synchro a modifie d'autres fichiers que $TARGET_FILE."
  echo "$other_changes_after"
  exit 1
fi

echo "2/5 - Changements detectes, preparation du commit..."
git add "$TARGET_FILE"

echo "3/5 - Commit..."
git commit -m "Met a jour le flux Facebook pour Lys'Info."

echo "4/5 - Push sur origin/$CURRENT_BRANCH..."
git push origin "$CURRENT_BRANCH"

echo "5/5 - Termine: sync + commit + push effectues."
