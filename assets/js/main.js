/**
* Template Name: PhotoFolio
* Template URL: https://bootstrapmade.com/photofolio-bootstrap-photography-website-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*
* Mabadiliko ya Sahilion: Umeongezwa utendaji wa i18n (Internationalization) kwa ajili ya lugha mbili (SW/EN).
* Inategemea faili la translations.js.
*/

(function() {
  "use strict";

  // =========================================================================
  // KAZI ZA I18N (INTERNATIONALIZATION)
  // =========================================================================

  // Lugha chaguo-msingi
  let currentLang = localStorage.getItem('sahilionLang') || 'sw';
  const langSwitch = document.getElementById('lang-switch');
  const currentFlag = document.getElementById('current-flag');

  /**
   * Fanya tafsiri ya ukurasa mzima kwa kutumia kamusi (translations)
   */
  function translatePage(lang) {
    if (!translations || !translations[lang]) return;

    const dictionary = translations[lang];

    // Tafsiri maandishi (textContent)
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (dictionary[key]) {
        element.textContent = dictionary[key];
      }
    });

    // Tafsiri sifa (attributes): Placeholder, Title, Meta Description/Keywords
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      if (dictionary[key]) {
        element.placeholder = dictionary[key];
      }
    });

    // Tafsiri sifa za Meta (Title, Description, Keywords)
    // TITLE
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n');
      if (dictionary[key]) {
        document.title = dictionary[key];
      }
    }

    // META DESCRIPTION
    const metaDescElement = document.querySelector('meta[name="description"]');
    const metaDescKey = metaDescElement ? metaDescElement.getAttribute('data-i18n') : null;
    if (metaDescElement && metaDescKey && dictionary[metaDescKey]) {
      metaDescElement.setAttribute('content', dictionary[metaDescKey]);
    }

    // META KEYWORDS
    const metaKeywordsElement = document.querySelector('meta[name="keywords"]');
    const metaKeywordsKey = metaKeywordsElement ? metaKeywordsElement.getAttribute('data-i18n') : null;
    if (metaKeywordsElement && metaKeywordsKey && dictionary[metaKeywordsKey]) {
      metaKeywordsElement.setAttribute('content', dictionary[metaKeywordsKey]);
    }

    // Weka sifa ya lang kwenye <html> tag
    document.documentElement.setAttribute('lang', lang);
  }

  /**
   * Badilisha Lugha na Bendera
   */
  function updateLanguageToggle(lang) {
    const newLang = lang === 'sw' ? 'en' : 'sw';
    const newFlagSrc = newLang === 'sw' ? 'assets/img/tz_flag.png' : 'assets/img/gb_flag.png';
    const newFlagAlt = newLang === 'sw' ? 'Bendera ya Tanzania' : 'Bendera ya Uingereza';
    const newLangText = newLang.toUpperCase();
      
    langSwitch.setAttribute('data-lang', newLang);
    langSwitch.querySelector('span').textContent = newLangText;
    currentFlag.src = newFlagSrc;
    currentFlag.alt = newFlagAlt;
  }

  /**
   * Msikilizaji wa tukio la kubadilisha lugha
   */
  if (langSwitch) {
    langSwitch.addEventListener('click', function(e) {
      e.preventDefault();
      const targetLang = this.getAttribute('data-lang');
      
      // Hifadhi lugha mpya na fanya tafsiri
      currentLang = targetLang;
      localStorage.setItem('sahilionLang', currentLang);
      translatePage(currentLang);
      updateLanguageToggle(currentLang);
    });
  }

  // Pakia tafsiri mara tu baada ya ukurasa kupakia
  window.addEventListener('load', () => {
    translatePage(currentLang);
    updateLanguageToggle(currentLang);
  });


  // =========================================================================
  // KAZI ZA MWANZO ZA TEMPLATE (BootstrapMade)
  // =========================================================================

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if(mobileNavToggleBtn) mobileNavToggleBtn.addEventListener('click', mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 1000);
      setTimeout(() => {
        preloader.remove();
      }, 2000);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if(scrollTop) { // Hakikisha scrollTop inapatikana kabla ya kuongeza msikilizaji
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();