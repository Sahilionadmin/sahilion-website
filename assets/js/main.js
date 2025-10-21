/**
 * i18n Language Switcher Script - Sahilion
 * Updated: Oct 2025
 * Supports: text + attribute translations (e.g. [placeholder]key)
 */

document.addEventListener("DOMContentLoaded", () => {
  const defaultLang = "sw";
  const supportedLangs = ["sw", "en"];
  const langToggle = document.getElementById("lang-toggle");
  const tanzaniaFlag = "assets/img/flags/tz.svg";
  const ukFlag = "assets/img/flags/uk.svg";

  let currentLang = localStorage.getItem("lang") || defaultLang;
  loadLanguage(currentLang);

  if (langToggle) {
    langToggle.src = currentLang === "sw" ? ukFlag : tanzaniaFlag;

    langToggle.addEventListener("click", () => {
      currentLang = currentLang === "sw" ? "en" : "sw";
      localStorage.setItem("lang", currentLang);
      loadLanguage(currentLang);
      langToggle.src = currentLang === "sw" ? ukFlag : tanzaniaFlag;
    });
  }

  /**
   * Load JSON file and apply translations
   */
  function loadLanguage(lang) {
    if (!supportedLangs.includes(lang)) lang = defaultLang;

    fetch(`assets/i18n/${lang}.json`)
      .then(res => res.json())
      .then(data => applyTranslations(lang, data))
      .catch(err => console.error("i18n load error:", err));
  }

  /**
   * Apply translations to elements
   * Supports normal text and attribute syntax: [placeholder]key
   */
  function applyTranslations(lang, data) {
    try {
      document.documentElement.setAttribute("lang", lang);

      document.querySelectorAll("[data-i18n]").forEach(el => {
        const attr = el.getAttribute("data-i18n");
        if (!attr) return;

        // 1️⃣ Handle attribute translation e.g. [placeholder]newsletter_placeholder
        const match = attr.match(/^\[(.+)\](.+)$/);
        if (match) {
          const attributeName = match[1];   // e.g. "placeholder"
          const keyName = match[2];         // e.g. "newsletter_placeholder"
          const translationValue = data[keyName];
          if (translationValue) {
            el.setAttribute(attributeName, translationValue);
          }
          return; // go to next element
        }

        // 2️⃣ Handle regular element translations
        const value = data[attr];
        if (!value) return;

        if (el.tagName === "TITLE") {
          document.title = value;
        } else {
          el.innerHTML = value;
        }
      });

    } catch (err) {
      console.error("applyTranslations error:", err);
    }
  }
});
