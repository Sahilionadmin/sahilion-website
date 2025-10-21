/**
 * main.js - Sahilion (PhotoFolio modified)
 * Includes: i18n, preloader, nav, AOS, Glightbox, Swiper, Formspree AJAX handlers
 *
 * Place at: assets/js/main.js
 * Ensure vendor scripts (bootstrap, aos, glightbox, swiper) are loaded before this file
 */

(function() {
  "use strict";

  // -------------------------
  // Config / Globals
  // -------------------------
  const LANG_KEY = 'sahilion_lang';
  const DEFAULT_LANG = 'sw';
  let translations = {}; // loaded translations for current non-default lang

  // -------------------------
  // Helpers - i18n
  // -------------------------
  async function fetchTranslations(lang) {
    if (!lang || lang === DEFAULT_LANG) return {};
    try {
      const res = await fetch(`assets/i18n/${lang}.json`);
      if (!res.ok) {
        console.warn(`Could not load translation file for ${lang}`);
        return {};
      }
      return await res.json();
    } catch (err) {
      console.error('fetchTranslations error', err);
      return {};
    }
  }

  function getTranslation(key) {
    if (!key) return '';
    // key might be like 'contact_status_sent'
    return translations[key] || window.translations && window.translations[key] || key;
  }

  function applyTranslations(lang, data) {
    try {
      document.documentElement.setAttribute('lang', lang);
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const attr = el.getAttribute('data-i18n');
        if (!attr) return;
        const value = data[attr];
        if (!value) return; // keep original
        // If attribute syntax e.g. data-i18n="[placeholder]key"
        if (attr.startsWith('[') || attr.includes(']')) {
          // handled as attr mapping? (some templates use data-i18n attr differently)
          // fallback: if element has placeholder attribute, set it
          if (el.hasAttribute('placeholder')) el.setAttribute('placeholder', value);
          else if (el.tagName === 'TITLE') document.title = value;
          else el.textContent = value;
        } else {
          // replace content
          el.innerHTML = value;
        }
      });
    } catch (err) {
      console.error('applyTranslations error', err);
    }
  }

  function updateFlagVisual(newLang) {
    document.querySelectorAll('.lang-flag').forEach(parent => {
      const flagEl = parent.querySelector('.flag-icon');
      const flagLang = parent.getAttribute('data-lang');
      if (flagLang === newLang) {
        parent.classList.add('active');
        if (flagEl) flagEl.classList.add('active');
      } else {
        parent.classList.remove('active');
        if (flagEl) flagEl.classList.remove('active');
      }
    });
  }

  async function setLanguageAndReload(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
      // Optionally prefetch translations to cache (not required)
      if (lang !== DEFAULT_LANG) {
        await fetchTranslations(lang);
      }
    } catch (e) { console.warn(e); }
    // reload to allow server-side/meta/title to change if needed
    window.location.reload();
  }

  // -------------------------
  // Preloader (robust)
  // -------------------------
  function initPreloader() {
    // Always remove preloader on load (even if other JS errored)
    window.addEventListener('load', () => {
      try {
        const preloader = document.getElementById('preloader') || document.querySelector('#preloader');
        if (!preloader) return;
        // Add loaded class for graceful animation then remove
        preloader.classList.add('loaded');
        // remove after short delay
        setTimeout(() => {
          try { preloader.remove(); } catch (e) { /* ignore */ }
        }, 800);
      } catch (err) {
        console.error('preloader removal error', err);
      }
    });

    // Failsafe: if load never fires (rare), ensure removal after 6s
    setTimeout(() => {
      try {
        const preloader = document.getElementById('preloader') || document.querySelector('#preloader');
        if (preloader && !preloader.classList.contains('loaded')) {
          preloader.classList.add('loaded');
          setTimeout(() => { try { preloader.remove(); } catch (e) {} }, 500);
        }
      } catch (e) {}
    }, 6000);
  }

  // -------------------------
  // UI utilities
  // -------------------------
  function mobileNavToggleInit() {
    try {
      const mobileBtn = document.querySelector('.mobile-nav-toggle');
      if (!mobileBtn) return;
      mobileBtn.addEventListener('click', () => {
        document.body.classList.toggle('mobile-nav-active');
        mobileBtn.classList.toggle('bi-list');
        mobileBtn.classList.toggle('bi-x');
      });

      // hide mobile nav on same-page/hash links
      document.querySelectorAll('#navmenu a').forEach(a => {
        a.addEventListener('click', () => {
          if (document.querySelector('.mobile-nav-active')) {
            if (mobileBtn) mobileBtn.click();
          }
        });
      });
    } catch (err) {
      console.error('mobileNavToggleInit error', err);
    }
  }

  function mobileNavDropdowns() {
    try {
      document.querySelectorAll('.navmenu .toggle-dropdown').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          this.parentNode.classList.toggle('active');
          const next = this.parentNode.nextElementSibling;
          if (next) next.classList.toggle('dropdown-active');
          e.stopImmediatePropagation();
        });
      });
    } catch (err) {
      console.error('mobileNavDropdowns error', err);
    }
  }

  function scrollTopInit() {
    try {
      const scrollTop = document.querySelector('.scroll-top');
      if (!scrollTop) return;
      const toggle = () => {
        window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
      };
      window.addEventListener('load', toggle);
      document.addEventListener('scroll', toggle);
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (err) { console.error('scrollTopInit error', err); }
  }

  // -------------------------
  // AOS, GLightbox, Swiper inits (safety-wrapped)
  // -------------------------
  function aosInit() {
    try {
      if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
      }
    } catch (err) { console.error('AOS init error', err); }
  }

  function glightboxInit() {
    try {
      if (typeof GLightbox !== 'undefined') {
        GLightbox({ selector: '.glightbox' });
      }
    } catch (err) { console.error('GLightbox init error', err); }
  }

  function initSwiper() {
    try {
      if (typeof Swiper === 'undefined') return;
      document.querySelectorAll(".init-swiper").forEach(swiperElement => {
        try {
          const configEl = swiperElement.querySelector(".swiper-config");
          if (!configEl) return;
          const config = JSON.parse(configEl.innerHTML.trim());
          if (swiperElement.classList.contains("swiper-tab")) {
            // custom init if needed
            new Swiper(swiperElement, config);
          } else {
            new Swiper(swiperElement, config);
          }
        } catch (err) { console.error('initSwiper element error', err); }
      });
    } catch (err) { console.error('initSwiper error', err); }
  }

  // -------------------------
  // Formspree AJAX handler (defensive, i18n-aware)
  // -------------------------
  function handleFormspreeSubmission(form) {
    if (!form) return;
    // avoid double-binding
    if (form.__formspreeBound) return;
    form.__formspreeBound = true;

    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      try {
        const loadingDiv = form.querySelector('.loading');
        const errorDiv = form.querySelector('.error-message');
        const sentDiv = form.querySelector('.sent-message');

        if (loadingDiv) loadingDiv.style.display = 'block';
        if (errorDiv) { errorDiv.style.display = 'none'; errorDiv.textContent = ''; }
        if (sentDiv) sentDiv.style.display = 'none';

        const formData = new FormData(form);

        const res = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (loadingDiv) loadingDiv.style.display = 'none';

        if (res.ok) {
          if (sentDiv) {
            sentDiv.style.display = 'block';
            // use i18n key if available
            sentDiv.textContent = getTranslation('contact_status_sent') || 'Ujumbe wako umetumwa. Asante!';
          } else {
            alert(getTranslation('newsletter_status_sent') || 'Umejiunga! Asante.');
          }
          try { form.reset(); } catch (e) {}
        } else {
          // try to parse json error from Formspree for detail
          let errText = getTranslation('contact_error_general') || 'Tatizo limetokea. Tafadhali jaribu tena.';
          try {
            const data = await res.json();
            if (data && data.error) errText = data.error;
          } catch (e) { /* ignore */ }

          if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = errText;
          } else {
            alert(errText);
          }
        }
      } catch (err) {
        // network or unexpected error
        console.error('Form submission error', err);
        const errorDiv = form.querySelector('.error-message');
        const loadingDiv = form.querySelector('.loading');
        if (loadingDiv) loadingDiv.style.display = 'none';
        if (errorDiv) {
          errorDiv.style.display = 'block';
          errorDiv.textContent = getTranslation('contact_error_network') || 'Hitilafu ya mtandao. Jaribu tena.';
        } else {
          alert(getTranslation('contact_error_network') || 'Hitilafu ya mtandao. Jaribu tena.');
        }
      }
    });
  }

  // -------------------------
  // Initialization on DOMContentLoaded
  // -------------------------
  document.addEventListener('DOMContentLoaded', async () => {
    // i18n: load translations if needed and apply
    try {
      const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
      if (savedLang !== DEFAULT_LANG) {
        translations = await fetchTranslations(savedLang);
        applyTranslations(savedLang, translations);
      }
      updateFlagVisual(savedLang);

      // flag click handlers
      document.querySelectorAll('.lang-flag').forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const lang = button.getAttribute('data-lang');
          if (!lang) return;
          setLanguageAndReload(lang);
        });
      });
    } catch (err) {
      console.error('i18n init error', err);
    }

    // UI
    mobileNavToggleInit();
    mobileNavDropdowns();
    scrollTopInit();

    // init AOS, glightbox, swiper when window loads but attempt here too
    try { aosInit(); } catch (e) {}
    try { glightboxInit(); } catch (e) {}
    try { initSwiper(); } catch (e) {}

    // Attach form handlers (defensive)
    try {
      handleFormspreeSubmission(document.querySelector('#contact-form'));
      handleFormspreeSubmission(document.querySelector('#newsletter-form'));
    } catch (err) {
      console.error('attach form handlers error', err);
    }

    // init other template behaviors if any (preloader handled separately)
  });

  // Ensure preloader removal even if DOMContentLoaded fails
  try { initPreloader(); } catch (err) { console.error('initPreloader error', err); }

  // Also init AOS/Swiper/GLightbox on window load for safety
  window.addEventListener('load', () => {
    try { aosInit(); } catch (e) {}
    try { glightboxInit(); } catch (e) {}
    try { initSwiper(); } catch (e) {}
  });

  // End IIFE
})();
