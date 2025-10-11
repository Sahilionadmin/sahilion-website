// Photofolio: Bootstrap and glightbox
(function() {
  "use strict";
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) selectEl.forEach(e => e.addEventListener(type, listener));
      else selectEl.addEventListener(type, listener);
    }
  };
  const onscroll = (el, listener) => el.addEventListener('scroll', listener);
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({ top: elementPos, behavior: 'smooth' });
  };
  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => selectHeader.classList.toggle('header-scrolled', window.scrollY > 100);
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }
  let navbarlinks = select('#navmenu .nav-link', true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
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
  let glightbox = GLightbox({ selector: '.glightbox' });
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active');
    this.classList.toggle('bi-list');
    this.classList.toggle('bi-x');
  });
  on('click', '.nav-link.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();
      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);
})();

// Sahilion: Language toggle and animations
(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (key && dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('input[data-key]').forEach(input => {
      const key = input.getAttribute('data-key');
      if (key && dict[key]) input.setAttribute('placeholder', dict[key]);
    });
    const langToggle = document.getElementById('language-toggle');
    if (langToggle) langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';
  }
  applyTranslations(currentLang);
  const toggleBtn = document.getElementById('language-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentLang = (currentLang === 'sw') ? 'en' : 'sw';
      applyTranslations(currentLang);
      toggleBtn.setAttribute('aria-pressed', currentLang === 'en');
    });
    toggleBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') toggleBtn.click();
    });
  }
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = (currentLang === 'sw') ? 'Inatuma...' : 'Sending...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
        }, 4000);
      }
    });
  });
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => img.style.display = 'none');
  });
})();