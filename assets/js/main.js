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
      if (!res.ok) { console.warn(`Could not load translation file for ${lang}`); return {}; }
      return await res.json();
    } catch (err) { console.error('fetchTranslations error', err); return {}; }
  }

  function getTranslation(key) {
    if (!key) return '';
    return translations[key] || (window.translations && window.translations[key]) || key;
  }

  function applyTranslations(lang, data) {
    try {
      document.documentElement.setAttribute('lang', lang);
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const attr = el.getAttribute('data-i18n');
        if (!attr) return;
        const match = attr.match(/^\[(.+?)\](.+)$/); // capture [attr]key
        let value = '';
        if (match) {
          const attrName = match[1].trim();
          const key = match[2].trim();
          value = data[key] || (window.translations && window.translations[key]) || '';
          if (value) el.setAttribute(attrName, value);
        } else {
          value = data[attr] || (window.translations && window.translations[attr]) || '';
          if (value) el.innerHTML = value;
        }
      });
    } catch (err) { console.error('applyTranslations error', err); }
  }

  function updateFlagVisual(newLang) {
    document.querySelectorAll('.lang-flag').forEach(parent => {
      const flagEl = parent.querySelector('.flag-icon');
      const flagLang = parent.getAttribute('data-lang');
      if (flagLang === newLang) {
        parent.classList.add('active'); if (flagEl) flagEl.classList.add('active');
      } else { parent.classList.remove('active'); if (flagEl) flagEl.classList.remove('active'); }
    });
  }

  async function setLanguageAndReload(lang) {
    try {
      localStorage.setItem(LANG_KEY, lang);
      if (lang !== DEFAULT_LANG) await fetchTranslations(lang);
    } catch (e) { console.warn(e); }
    window.location.reload();
  }

  // -------------------------
  // Preloader
  // -------------------------
  function initPreloader() {
    window.addEventListener('load', () => {
      try {
        const preloader = document.getElementById('preloader') || document.querySelector('#preloader');
        if (!preloader) return;
        preloader.classList.add('loaded');
        setTimeout(() => { try { preloader.remove(); } catch(e){} }, 800);
      } catch (err) { console.error('preloader removal error', err); }
    });
    setTimeout(() => {
      try {
        const preloader = document.getElementById('preloader') || document.querySelector('#preloader');
        if (preloader && !preloader.classList.contains('loaded')) {
          preloader.classList.add('loaded');
          setTimeout(() => { try { preloader.remove(); } catch(e){} }, 500);
        }
      } catch(e){}
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
      document.querySelectorAll('#navmenu a').forEach(a => {
        a.addEventListener('click', () => {
          if (document.querySelector('.mobile-nav-active') && mobileBtn) mobileBtn.click();
        });
      });
    } catch (err) { console.error('mobileNavToggleInit error', err); }
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
    } catch (err) { console.error('mobileNavDropdowns error', err); }
  }

  function scrollTopInit() {
    try {
      const scrollTop = document.querySelector('.scroll-top');
      if (!scrollTop) return;
      const toggle = () => { window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active'); };
      window.addEventListener('load', toggle);
      document.addEventListener('scroll', toggle);
      scrollTop.addEventListener('click', (e) => { e.preventDefault(); window.scrollTo({ top:0, behavior:'smooth' }); });
    } catch (err) { console.error('scrollTopInit error', err); }
  }

  // -------------------------
  // AOS, GLightbox, Swiper
  // -------------------------
  function aosInit() { try { if(typeof AOS!=='undefined') AOS.init({duration:600,easing:'ease-in-out',once:true,mirror:false}); } catch(err){console.error('AOS init error',err);} }
  function glightboxInit() { try { if(typeof GLightbox!=='undefined') GLightbox({selector:'.glightbox'}); } catch(err){console.error('GLightbox init error',err);} }
  function initSwiper() {
    try {
      if(typeof Swiper==='undefined') return;
      document.querySelectorAll(".init-swiper").forEach(swiperElement=>{
        try{
          const configEl = swiperElement.querySelector(".swiper-config");
          if(!configEl) return;
          const config = JSON.parse(configEl.innerHTML.trim());
          new Swiper(swiperElement, config);
        }catch(err){console.error('initSwiper element error',err);}
      });
    }catch(err){console.error('initSwiper error',err);}
  }

  // -------------------------
  // Formspree AJAX handler (with proper hide/show)
  // -------------------------
  function handleFormspreeSubmission(form){
    if(!form) return;
    if(form.__formspreeBound) return;
    form.__formspreeBound = true;

    // Ensure messages hidden initially
    const errorDiv = form.querySelector('.error-message');
    const sentDiv = form.querySelector('.sent-message');
    if(errorDiv) { errorDiv.style.display='none'; errorDiv.textContent=''; }
    if(sentDiv) { sentDiv.style.display='none'; }

    form.addEventListener('submit', async function(event){
      event.preventDefault();
      try{
        const loadingDiv = form.querySelector('.loading');
        if(loadingDiv) loadingDiv.style.display='block';
        if(errorDiv) { errorDiv.style.display='none'; errorDiv.textContent=''; }
        if(sentDiv) { sentDiv.style.display='none'; }

        const formData = new FormData(form);
        const res = await fetch(form.action,{method:'POST',body:formData,headers:{'Accept':'application/json'}});
        if(loadingDiv) loadingDiv.style.display='none';

        if(res.ok){
          if(sentDiv){sentDiv.style.display='block'; sentDiv.textContent=getTranslation('contact_status_sent')||'Ujumbe wako umetumwa. Asante!';}
          else alert(getTranslation('newsletter_status_sent')||'Umejiunga! Asante.');
          try{form.reset();}catch(e){}
        } else {
          let errText = getTranslation('contact_error_general')||'Tatizo limetokea. Tafadhali jaribu tena.';
          try{const data = await res.json(); if(data && data.error) errText=data.error;}catch(e){}
          if(errorDiv){errorDiv.style.display='block'; errorDiv.textContent=errText;} else alert(errText);
        }
      }catch(err){
        console.error('Form submission error',err);
        if(loadingDiv) loadingDiv.style.display='none';
        if(errorDiv){errorDiv.style.display='block'; errorDiv.textContent=getTranslation('contact_error_network')||'Hitilafu ya mtandao. Jaribu tena.';}
        else alert(getTranslation('contact_error_network')||'Hitilafu ya mtandao. Jaribu tena.');
      }
    });
  }

  // -------------------------
  // Initialization
  // -------------------------
  document.addEventListener('DOMContentLoaded', async ()=>{
    try{
      const savedLang = localStorage.getItem(LANG_KEY)||DEFAULT_LANG;
      if(savedLang!==DEFAULT_LANG){ translations=await fetchTranslations(savedLang); applyTranslations(savedLang, translations); }
      updateFlagVisual(savedLang);
      document.querySelectorAll('.lang-flag').forEach(button=>{
        button.addEventListener('click',(e)=>{ e.preventDefault(); const lang=button.getAttribute('data-lang'); if(!lang) return; setLanguageAndReload(lang); });
      });
    }catch(err){console.error('i18n init error',err);}
    mobileNavToggleInit();
    mobileNavDropdowns();
    scrollTopInit();
    try{aosInit();}catch(e){}
    try{glightboxInit();}catch(e){}
    try{initSwiper();}catch(e){}
    try{
      handleFormspreeSubmission(document.querySelector('#contact-form'));
      handleFormspreeSubmission(document.querySelector('#newsletter-form'));
    }catch(err){console.error('attach form handlers error',err);}
  });

  try{initPreloader();}catch(err){console.error('initPreloader error',err);}
  window.addEventListener('load', ()=>{
    try{aosInit();}catch(e){}
    try{glightboxInit();}catch(e){}
    try{initSwiper();}catch(e){}
  });

})();
