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

  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener);
  };

  const scrollto = (el) => {
    let header = select('#header');
    let offset = header.offsetHeight;
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: 'smooth'
    });
  };

  let selectHeader = select('#header');
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) selectHeader.classList.add('header-scrolled');
      else selectHeader.classList.remove('header-scrolled');
    };
    window.addEventListener('load', headerScrolled);
    onscroll(document, headerScrolled);
  }

  on('click', '.mobile-nav-toggle', function(e) {
    select('#navmenu').classList.toggle('navmenu-mobile');
    this.classList.toggle('mobile-nav-show');
    this.classList.toggle('mobile-nav-hide');
  });

  on('click', '.navmenu a', function(e) {
    if (select(this.hash) && !this.classList.contains('lang-switch')) {
      e.preventDefault();
      let navmenu = select('#navmenu');
      if (navmenu.classList.contains('navmenu-mobile')) {
        navmenu.classList.remove('navmenu-mobile');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('mobile-nav-show');
        navbarToggle.classList.toggle('mobile-nav-hide');
      }
      scrollto(this.hash);
    }
  }, true);

  on('click', '.toggle-dropdown', function(e) {
    e.preventDefault();
    if (select('#navmenu').classList.contains('navmenu-mobile')) {
      this.parentElement.classList.toggle('active');
      let dropdownContent = this.parentElement.querySelector('ul');
      dropdownContent.classList.toggle('dropdown-active');
    }
  }, true);

  window.addEventListener('load', () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

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

  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });

  // Sahilion: Bilingual Toggle and Form UX
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
      langToggle.textContent = lang === 'sw' ? 'English' : 'Kiswahili';
      langToggle.setAttribute('aria-pressed', lang === 'en');
    }
  }

  window.addEventListener('load', () => {
    applyTranslations(currentLang);
  });

  const toggleBtn = select('#language-toggle');
  if (toggleBtn) {
    on('click', '#language-toggle', () => {
      currentLang = currentLang === 'sw' ? 'en' : 'sw';
      applyTranslations(currentLang);
    });
    on('keydown', '#language-toggle', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBtn.click();
      }
    });
  }

  select('form', true).forEach(form => {
    on('submit', form, e => {
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = currentLang === 'sw' ? 'Inatuma...' : 'Sending...';
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
        }, 4000);
      }
    });
  });

  select('img', true).forEach(img => {
    on('error', img, () => {
      img.style.display = 'none';
    });
  });
})();