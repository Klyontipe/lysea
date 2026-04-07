(function () {
  const DONATION_URL =
    "https://lys-espoir-unis-contre-le-neuroblastome.s2.yapla.com/fr/faire-un-don/detail/un-espoir-pour-lysea-a-rome/15342#don-details";
  const PHOTO_POOL = ["photo1.jpg", "photo2.jpg", "photo3.jpg", "photo4.jpg", "photo5.jpg"];
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mainNav.classList.toggle("show");
    });

    mainNav.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link || !mainNav.classList.contains("show")) return;
      mainNav.classList.remove("show");
      navToggle.setAttribute("aria-expanded", "false");
    });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  });

  const donateSubmit = document.querySelector(".donate-submit");
  if (donateSubmit) {
    donateSubmit.addEventListener("click", () => {
      window.open(DONATION_URL, "_blank", "noopener,noreferrer");
    });
  }

  const items = document.querySelectorAll("[data-animate]");
  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 0.06, 0.24)}s`;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((item) => observer.observe(item));

    // Fallback de sécurité: si un navigateur bloque l'observer
    window.setTimeout(() => {
      items.forEach((item) => item.classList.add("is-visible"));
    }, 1200);
  } else {
    items.forEach((item) => item.classList.add("is-visible"));
  }

  // Parallax subtil sur les photos du hero
  const parallaxPhotos = document.querySelectorAll(".parallax-photo");
  const heroSection = document.querySelector(".hero");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (parallaxPhotos.length && heroSection && !reduceMotion) {
    const handleParallax = () => {
      const heroRect = heroSection.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      if (heroRect.bottom < 0 || heroRect.top > viewH) return;

      const progress = (viewH - heroRect.top) / (viewH + heroRect.height);
      const centered = (progress - 0.5) * 2; // -1 à 1

      parallaxPhotos.forEach((photo) => {
        const speed = Number(photo.getAttribute("data-parallax-speed") || 0.1);
        const baseTransform = photo.getAttribute("data-base-transform") || "";
        const offsetY = centered * speed * 54;
        photo.style.transform = `${baseTransform} translateY(${offsetY}px)`;
      });
    };

    window.addEventListener("scroll", handleParallax, { passive: true });
    window.addEventListener("resize", handleParallax);
    handleParallax();
  }

  // Animation dashboard photos: met en avant une mini-carte à tour de rôle.
  const momentCards = document.querySelectorAll(".moments-grid .moment-card");
  if (momentCards.length > 1 && !reduceMotion) {
    let activeIndex = 0;
    window.setInterval(() => {
      momentCards[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % momentCards.length;
      momentCards[activeIndex].classList.add("is-active");
    }, 1700);
  }

  // Photos aléatoires à droite en fond
  const bgPhotoSlots = document.querySelectorAll(".site-bg-photo");
  if (bgPhotoSlots.length) {
    const shuffled = [...PHOTO_POOL].sort(() => Math.random() - 0.5);
    bgPhotoSlots.forEach((slot, index) => {
      slot.src = shuffled[index % shuffled.length];
    });
  }
})();
