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

const LANG_KEY = 'sahilion_lang'; // Key for localStorage
const DEFAULT_LANG = 'sw'; // Swahili ni lugha chaguomsingi (default)

let translations = {}; // Object to hold loaded translations

// 1. Fetch Translations from JSON File (Kumbuka: Faili inapaswa kuwa en.json)
async function fetchTranslations(lang) {
    if (lang === DEFAULT_LANG) {
        return {}; // Hakuna haja ya kupakia faili ya Swahili
    }
    
    try {
        // Tumeacha .translation na kutumia .json
        const response = await fetch(`assets/i18n/${lang}.json`); 
        if (!response.ok) {
            console.error(`Could not load translation file for ${lang}.`);
            return {};
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching translation:", error);
        return {};
    }
}

// 2. Apply Translations to the DOM (Inatumika tu baada ya page reload)
function applyTranslations(lang, data) {
    document.documentElement.setAttribute('lang', lang); 

    // Find all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = data[key];

        // Haina haja ya kuangalia tena kama lang === DEFAULT_LANG hapa,
        // kwa sababu tunatumia 'reload' na kuzuia fetching ya SW.
        if (!value) {
            return; // Acha maudhui ya asili ya HTML kama hakuna tafsiri
        }

        // Handle content replacements
        if (element.hasAttribute('title')) {
            element.setAttribute('title', value);
        } else if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', value);
        } else if (element.tagName === 'META' && element.getAttribute('name') === 'description') {
            element.setAttribute('content', value);
        } else if (element.tagName === 'TITLE') {
             element.textContent = value;
        } else {
            element.innerHTML = value;
        }
    });
}

// 3. Update Flag Visuals (Huu ni msingi wa 'click effect')
function updateFlagVisual(newLang) {
    document.querySelectorAll('.lang-flag').forEach(parent => {
        const flag = parent.querySelector('.flag-icon');
        const flagLang = parent.getAttribute('data-lang');

        if (flagLang === newLang) {
            flag.classList.add('active'); // Inaongeza urembo
            parent.opacity = 1; 
        } else {
            flag.classList.remove('active');
            parent.opacity = 0.6; // Inafanya bendera nyingine ififia
        }
    });
}

// 4. Main function to change the language - INATUMIA RELOAD
async function setLanguageAndReload(lang) {
    // 1. Save preference
    localStorage.setItem(LANG_KEY, lang);
    
    // 2. Reload the page to load content in the new language
    window.location.reload(); 
}

// 5. Initialize the application on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Get language preference from localStorage or use default
    const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

    if (savedLang !== DEFAULT_LANG) {
        // 2. Fetch and cache translations (in English)
        translations = await fetchTranslations(savedLang);

        // 3. Apply changes to the DOM
        applyTranslations(savedLang, translations);
    }
    
    // 4. Update the flags to show the active language (Hii inafanya kazi mara moja)
    updateFlagVisual(savedLang);

    // Set up click listeners for the flag buttons
    document.querySelectorAll('.lang-flag').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            
            // Tunaita kazi mpya ya kubadilisha na kupakia upya
            setLanguageAndReload(lang); 
        });
    });
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