/**
 * Template Name: PhotoFolio
 * Template URL: https://bootstrapmade.com/photofolio-bootstrap-photography-website-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

/**
 * Sahilion Customizations
 * Integrates bilingual toggle and form UX for Swahili/English support
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select('#header');
    let offset = header.offsetHeight;
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled');
      } else {
        selectHeader.classList.remove('header-scrolled');
      }
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navmenu').classList.toggle('navmenu-mobile');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navmenu a', function(e) {
    if (select(this.hash) && !this.classList.contains('lang-switch')) {
      e.preventDefault();
      let navmenu = select('#navmenu');
      if (navmenu.classList.contains('navmenu-mobile')) {
        navmenu.classList.remove('navmenu-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the url
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Navigation active state on scroll
   */
  let navbarlinks = select('#navmenu a', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash || navbarlink.classList.contains('lang-switch')) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active');
      } else {
        navbarlink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Initialize GLightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Sahilion: Bilingual Toggle and Form UX
   */
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  function applyTranslations(lang) {
    const dict = window.TRANSLATIONS[lang] || window.TRANSLATIONS['sw'];
    select('[data-key]', true).forEach(el => {
      const key = el.getAttribute('data-key');
      if (key && dict[key]) {
        el.textContent = dict[key];
      }
    });
    select('input[data-key], textarea[data-key]', true).forEach(input => {
      const key = input.getAttribute('data-key');
      if (key && dict[key]) {
        input.setAttribute('placeholder', dict[key]);
      }
    });
    const langToggle = select('#language-toggle');
    if (langToggle) {
      langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';
      langToggle.setAttribute('aria-pressed', lang === 'en');
    }
  }

  // Apply translations on load
  window.addEventListener('load', () => {
    applyTranslations(currentLang);
  });

  // Language toggle event
  const toggleBtn = select('#language-toggle');
  if (toggleBtn) {
    on('click', '#language-toggle', () => {
      currentLang = (currentLang === 'sw') ? 'en' : 'sw';
      applyTranslations(currentLang);
    });
    on('keydown', '#language-toggle', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });
  }

  // Form submission UX
  select('form', true).forEach(form => {
    on('submit', form, (e) => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = (currentLang === 'sw') ? 'Inatuma...' : 'Sending...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
        }, 4000); // Reset after 4 seconds
      }
    });
  });

  // Handle image load errors
  select('img', true).forEach(img => {
    on('error', img, () => {
      img.style.display = 'none';
    });
  });

})();