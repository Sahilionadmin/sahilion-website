/**
 * Template Name: PhotoFolio
 * Template URL: https://bootstrapmade.com/photofolio-bootstrap-photography-website-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /* ------------------------------
   * Add .scrolled class to body on scroll
   * ------------------------------ */
  const selectBody = document.body;
  const selectHeader = document.querySelector("#header");

  function toggleScrolled() {
    if (!selectHeader) return;
    const stickyHeader = selectHeader.classList.contains("scroll-up-sticky") ||
                         selectHeader.classList.contains("sticky-top") ||
                         selectHeader.classList.contains("fixed-top");

    if (!stickyHeader) return;

    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  window.addEventListener("load", toggleScrolled);
  document.addEventListener("scroll", toggleScrolled);

  /* ------------------------------
   * Mobile nav toggle
   * ------------------------------ */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function toggleMobileNav() {
    selectBody.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  /* ------------------------------
   * Hide mobile nav on same-page/hash links
   * ------------------------------ */
  document.querySelectorAll("#navmenu a").forEach((link) => {
    link.addEventListener("click", () => {
      if (selectBody.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
      }
    });
  });

  /* ------------------------------
   * Toggle mobile nav dropdowns
   * ------------------------------ */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const parent = this.parentNode;
      parent.classList.toggle("active");
      const dropdown = parent.nextElementSibling;
      if (dropdown) dropdown.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /* ------------------------------
   * Preloader
   * ------------------------------ */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => preloader.classList.add("loaded"), 1000);
      setTimeout(() => preloader.remove(), 2000);
    });
  }

  /* ------------------------------
   * Scroll top button
   * ------------------------------ */
  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (!scrollTop) return;
    window.scrollY > 100
      ? scrollTop.classList.add("active")
      : scrollTop.classList.remove("active");
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /* ------------------------------
   * AOS (Animation on Scroll) init
   * ------------------------------ */
  function aosInit() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 600,
        easing: "ease-in-out",
        once: true,
        mirror: false,
      });
    }
  }
  window.addEventListener("load", aosInit);

  /* ------------------------------
   * GLightbox init
   * ------------------------------ */
  if (typeof GLightbox !== "undefined") {
    GLightbox({ selector: ".glightbox" });
  }

  /* ------------------------------
   * Initialize Swiper sliders
   * ------------------------------ */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach((swiperEl) => {
      const configEl = swiperEl.querySelector(".swiper-config");
      if (!configEl) return;
      const config = JSON.parse(configEl.innerHTML.trim());

      if (swiperEl.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperEl, config);
      } else {
        new Swiper(swiperEl, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);
})();
