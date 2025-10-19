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

  /**
 * Localization Logic (Added to assets/js/main.js)
 */

const LANG_KEY = 'sahilion_lang'; // Key for localStorage
const DEFAULT_LANG = 'sw'; // Swahili is default

let translations = {}; // Object to hold loaded translations

// 1. Fetch Translations from JSON File
async function fetchTranslations(lang) {
    if (lang === DEFAULT_LANG) {
        return {}; // No need to load a file for Swahili default
    }
    
    try {
        const response = await fetch(`assets/i18n/en.json`);
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

// 2. Apply Translations to the DOM
function applyTranslations(lang, data) {
    // Update HTML lang attribute for SEO/Accessibility
    document.documentElement.setAttribute('lang', lang); 

    // Find all elements with data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        let value = data[key];

        // If translation is missing or language is Swahili, rely on default HTML content
        if (!value || lang === DEFAULT_LANG) {
            // Special handling for elements where the attribute content is the key
            if (element.hasAttribute('placeholder')) {
                // If it's a placeholder, we need to reset/use the Swahili placeholder value
                // Since we don't have the original Swahili placeholders in the JSON, 
                // we leave the HTML value, assuming the browser keeps it.
            }
            return;
        }

        // Handle content replacements
        if (element.hasAttribute('title')) {
            element.setAttribute('title', value);
        } else if (element.hasAttribute('placeholder')) {
            element.setAttribute('placeholder', value);
        } else if (element.tagName === 'META') {
            // Handle meta tags for SEO metadata
            if (element.getAttribute('name') === 'description') {
                element.setAttribute('content', value);
            }
        } else if (element.tagName === 'TITLE') {
             // Handle the page title
             element.textContent = value;
        } else {
            // Default: replace inner HTML content
            element.innerHTML = value;
        }
    });
}

// 3. Update Flag Visuals
function updateFlagVisual(newLang) {
    document.querySelectorAll('.flag-icon').forEach(flag => {
        const parent = flag.closest('.lang-flag');
        const flagLang = parent ? parent.getAttribute('data-lang') : null;

        if (flagLang === newLang) {
            flag.classList.add('active');
        } else {
            flag.classList.remove('active');
        }
    });
}

// 4. Main function to change the language
async function setLanguage(lang) {
    // 1. Save preference
    localStorage.setItem(LANG_KEY, lang);
    
    // 2. Fetch and cache translations if not Swahili
    translations = await fetchTranslations(lang);

    // 3. Apply changes to the DOM
    applyTranslations(lang, translations);

    // 4. Update the flags
    updateFlagVisual(lang);
}

// 5. Initialize the application on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get language preference from localStorage or use default
    const savedLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;

    // Load translations and set up the page based on the preference
    setLanguage(savedLang);

    // Set up click listeners for the flag buttons
    document.querySelectorAll('.lang-flag').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
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