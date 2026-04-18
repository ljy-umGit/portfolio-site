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

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabIndex = Number(button.getAttribute("data-index"));

      // Remove active class from all items and buttons
      tabItems.forEach((item) => item.classList.remove("active"));
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the selected index
      if (tabItems[tabIndex]) {
        tabItems[tabIndex].classList.add("active");
        button.classList.add("active");
      }
    });
  });

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  ScrollSmoother.create({
    smooth: 1.5,
    effects: true,
    smoothTouch: 0.2,
    normalizeScroll: true,
  });

  //Homepage Scroll Buttons
  const scrollDownBtn = document.getElementById("scroll-down");
  const scrollUpBtn = document.getElementById("scroll-up");

  let smoothScrollTo = ScrollSmoother.create({
    smooth: 2,
    effects: true,
    normalizeScroll: true,
  })

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