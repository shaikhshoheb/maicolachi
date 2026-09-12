(() => {
  document.documentElement.classList.add("js");

  const navbar = document.querySelector(".navbar");
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const scrollTopBtn = document.querySelector(".scroll-top");

  const onScroll = () => {
    if (navbar) {
      navbar.classList.toggle("is-solid", window.scrollY > 24);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 480);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && navbar && mobileNav) {
    const setMenu = (open) => {
      navbar.classList.toggle("is-open", open);
      mobileNav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    };

    const closeMenu = () => setMenu(false);

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMenu(!navbar.classList.contains("is-open"));
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 960) closeMenu();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -5% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    window.setTimeout(() => {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }, 2500);
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const track = document.querySelector(".reviews-track");
  const prev = document.querySelector("[data-review-prev]");
  const next = document.querySelector("[data-review-next]");
  if (track && prev && next) {
    let index = 0;
    const cards = () => [...track.children];
    const step = () => {
      const card = cards()[0];
      if (!card) return 0;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.gap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    const maxIndex = () => Math.max(0, cards().length - 1);

    const update = () => {
      track.style.transform = `translateX(-${index * step()}px)`;
    };

    prev.addEventListener("click", () => {
      index = index <= 0 ? maxIndex() : index - 1;
      update();
    });
    next.addEventListener("click", () => {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    });

    window.addEventListener("resize", update);
    setInterval(() => {
      index = index >= maxIndex() ? 0 : index + 1;
      update();
    }, 6500);
  }

  const filterBtns = document.querySelectorAll(".filter-btn");
  const menuItems = document.querySelectorAll(".menu-item");
  if (filterBtns.length && menuItems.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const cat = btn.dataset.filter;
        menuItems.forEach((item) => {
          const match = cat === "all" || item.dataset.category === cat;
          item.classList.toggle("hidden", !match);
        });
      });
    });
  }

  document.querySelectorAll("form[data-demo-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const captchaError = form.querySelector(".recaptcha-error");
      const captchaWidget = form.querySelector(".g-recaptcha");

      if (captchaWidget && typeof grecaptcha !== "undefined") {
        const widgets = [...document.querySelectorAll(".g-recaptcha")];
        const index = widgets.indexOf(captchaWidget);
        const token = grecaptcha.getResponse(index >= 0 ? index : 0);
        if (!token) {
          if (captchaError) captchaError.hidden = false;
          return;
        }
      }

      if (captchaError) captchaError.hidden = true;
      const note = form.querySelector(".form-success");
      if (note) note.classList.add("is-visible");
      form.reset();
      if (typeof grecaptcha !== "undefined") {
        try {
          document.querySelectorAll(".g-recaptcha").forEach((_, i) => {
            grecaptcha.reset(i);
          });
        } catch (_) {
          /* ignore */
        }
      }
    });
  });
})();
