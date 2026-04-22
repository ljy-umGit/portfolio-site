document.addEventListener("DOMContentLoaded", () => {
  // Dynamic year display in the footer
  const currentYear = document.getElementById("current-year");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Theme Switcher
  const themeSelect = document.getElementById("styles");
  if(themeSelect) {
    // Set initial theme from select value
    const initialTheme = themeSelect.value || "solaris";
    document.documentElement.setAttribute("data-theme", `minimal-${initialTheme}`);

    // Listen for changes
    themeSelect.addEventListener("change", function() {
      const selectedTheme = this.value;
      document.documentElement.setAttribute("data-theme", `minimal-${selectedTheme}`);
    });
  }

  // Responsive Hamburger Menu
  const menuBtn = document.querySelector(".hamburger-menu");
  const navContainer = document.querySelector(".nav-container");
  const navItems = document.querySelector(".nav-items");
  const siteHeader = document.querySelector(".site-header");
  const mainContent = document.querySelector("main");
  const footer = document.querySelector("footer");
  const pageBody = document.body;
  const pageRoot = document.documentElement;
  let smoothScrollTo;

  if (menuBtn && navContainer && navItems) {
    const menuIcon = menuBtn.querySelector("span");
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    // Lock scroll when nav menu opens
    const setScrollLock = (isLocked) => {
      if (!pageBody) {
        return;
      }

      pageBody.style.overflow = isLocked ? "hidden" : "";
      if (pageRoot) {
        pageRoot.style.overflow = isLocked ? "hidden" : "";
      }

      if (smoothScrollTo && typeof smoothScrollTo.paused === "function") {
        smoothScrollTo.paused(isLocked);
      }
    };

    const syncMobileMenuOffset = () => {
      if (!siteHeader) {
        return;
      }

      siteHeader.style.setProperty("--mobile-menu-top-offset", `${siteHeader.offsetHeight}px`);
    };

    syncMobileMenuOffset();

    const openMenu = () => {
      navContainer.classList.add("menu-open");
      navItems.classList.add("menu-open");
      menuBtn.setAttribute("aria-expanded", "true");
      if (menuIcon) {
        menuIcon.textContent = "close";
      }

      // Element Behind inaccessible when menu opened
      mainContent?.setAttribute("inert", "");
      footer?.setAttribute("inert", "");
      setScrollLock(true); // Lock scroll when nav menu opens
    };

    const closeMenu = () => {
      if (menuIcon) {
        menuIcon.textContent = "menu";
      }
      navContainer.classList.remove("menu-open");
      navItems.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");

      // Element Behind accessible when menu is closed
      mainContent?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      setScrollLock(false); // Unlock scroll when nav menu opens
    };

    menuBtn.addEventListener("click", () => {
      if (navContainer.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (desktopQuery.matches) {
        return;
      }

      if (!navContainer.contains(event.target)) {
        closeMenu();
      }
    });

    navItems.querySelectorAll("a, select").forEach((item) => {
      item.addEventListener("click", () => {
        if (!desktopQuery.matches) {
          closeMenu();
        }
      });
    });

    window.addEventListener("resize", () => {
      syncMobileMenuOffset();

      if (desktopQuery.matches) {
        closeMenu();
      }
    });
  }

  // Custom Cursor
  const cursor = document.querySelector(".cursor");
  if (cursor) {
    let halfW = cursor.offsetWidth / 2;
    let halfH = cursor.offsetHeight / 2;

    const updateSize = () => {
      halfW = cursor.offsetWidth / 2;
      halfH = cursor.offsetHeight / 2;
    };

    window.addEventListener("resize", updateSize);
    window.addEventListener("mousemove", (e) => {
      cursor.style.transform = `translate3d(${e.clientX - halfW}px, ${e.clientY - halfH}px, 0)`;
    })
  }

  // Typed.js H1 on homepage
  const typedTarget = document.getElementById("typed");
  const typedStrings = document.getElementById("typed-strings");

  if (typedTarget && typedStrings && typeof Typed !== "undefined") {
    new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 55,
      backSpeed: 45,
      backDelay: 1800,
      startDelay: 1000,
      loop: true,
      showCursor: false,
    });
  } else if (typedTarget && typedStrings) {
    const firstString = typedStrings.querySelector("h1, p, span");
    if (firstString) {
      typedTarget.textContent = firstString.textContent;
    }
  }

  // Hero page Tab Switching
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabItems = document.querySelectorAll(".tab-item");
  const tabViewport = document.querySelector(".tab-viewport");
  let tabHeightAnimationFrame = null;

  const updateTabViewportHeight = () => {
    if (!tabViewport) {
      return;
    }

    const activeItem = document.querySelector(".tab-item.active");
    if (activeItem) {
      tabViewport.style.height = `${activeItem.offsetHeight}px`;
    }
  };

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const tweenTabViewportHeight = (startHeight, endHeight) => {
    if (!tabViewport) {
      return;
    }

    if (tabHeightAnimationFrame) {
      cancelAnimationFrame(tabHeightAnimationFrame);
      tabHeightAnimationFrame = null;
    }

    const durationMs = 500;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutCubic(progress);
      const currentHeight = startHeight + (endHeight - startHeight) * eased;
      tabViewport.style.height = `${currentHeight}px`;

      if (progress < 1) {
        tabHeightAnimationFrame = requestAnimationFrame(step);
      } else {
        tabViewport.style.height = "auto";
        tabHeightAnimationFrame = null;
      }
    };

    tabHeightAnimationFrame = requestAnimationFrame(step);
  };

  updateTabViewportHeight();
  window.addEventListener("resize", updateTabViewportHeight);

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabIndex = Number(button.getAttribute("data-index"));
      const nextItem = tabItems[tabIndex];
      const currentActiveItem = document.querySelector(".tab-item.active");
      let startHeight = 0;

      if (!nextItem || nextItem.classList.contains("active")) {
        return;
      }

      if (tabViewport) {
        startHeight = currentActiveItem ? currentActiveItem.offsetHeight : tabViewport.offsetHeight;
        tabViewport.style.height = `${startHeight}px`;
        void tabViewport.offsetHeight;
      }

      // Remove active class from all items and buttons
      tabItems.forEach((item) => item.classList.remove("active"));
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the selected index
      if (nextItem) {
        nextItem.classList.add("active");
        button.classList.add("active");

        if (tabViewport) {
          const endHeight = nextItem.offsetHeight;
          tweenTabViewportHeight(startHeight, endHeight);
        }
      }
    });
  });

// GSAP Animations
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  smoothScrollTo = ScrollSmoother.create({
    smooth: 2,
    effects: true,
    smoothTouch: 0.2,
    normalizeScroll: true,
  });

  //Header Color Change
  ScrollTrigger.create({
    trigger: ".case-studies",
    start: "top 96px" ,
    end: "bottom 96px",

    toggleClass: {
      targets: "header",
      className: "nav-alt-color"
    }
  })

  // Sticky Project Section Bg
  ScrollTrigger.create({
    trigger: ".background-home",
    start: "top top",
    endTrigger: ".case-studies",
    end: "bottom bottom",
    pin: true,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
  })

  //Homepage Scroll Buttons
  const scrollDownBtn = document.getElementById("scroll-down");
  const scrollUpBtn = document.getElementById("scroll-up");

  if(scrollDownBtn) {
    scrollDownBtn.addEventListener("click", function(){
      smoothScrollTo.scrollTo(".cards-contain", true, "top 192px")
    })
  }

  if(scrollUpBtn) {
    scrollUpBtn.addEventListener("click", function(){
      smoothScrollTo.scrollTo("#section-hero", true, "top top")
    })
  }
});