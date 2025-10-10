/* script.js
   Handles:
   - language toggle (Swahili default)
   - replacing text via TRANSLATIONS
   - smooth scroll active nav highlighting (IntersectionObserver)
   - fade-in on scroll
   - simple form submission UX improvements (no backend changes)
*/

(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  // Apply translations to all elements with data-key
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];

    // Replace text for elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if(key && dict[key]) el.textContent = dict[key];
    });

    // Update nav links
    document.querySelectorAll('nav a.nav-link').forEach(a => {
      const key = a.getAttribute('data-key');
      if(key && dict[key]) a.textContent = dict[key];
    });

    // Update placeholders in forms/newsletter
    document.querySelectorAll('input[data-key]').forEach(input => {
      const key = input.getAttribute('data-key');
      if(key && dict[key]) input.setAttribute('placeholder', dict[key]);
    });

    // Update newsletter/submit buttons
    document.querySelectorAll('button[data-key]').forEach(btn => {
      const key = btn.getAttribute('data-key');
      if(key && dict[key]) btn.textContent = dict[key];
    });

    // Language toggle label
    const langToggle = document.getElementById('language-toggle');
    if(langToggle) langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';

    // Footer copyright
    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) {
      copyrightEl.textContent = dict['footer.copyright'] || '';
    }
  }

  // Initialize translations
  applyTranslations(currentLang);

  // Language toggle
  const toggleBtn = document.getElementById('language-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      currentLang = (currentLang === 'sw') ? 'en' : 'sw';
      applyTranslations(currentLang);
      toggleBtn.setAttribute('aria-pressed', currentLang === 'en');
    });
    toggleBtn.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') toggleBtn.click();
    });
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(()=> { target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }, 600);
        }
      }
    });
  });

  // IntersectionObserver for nav active links and fade-in
  const sections = document.querySelectorAll('main section, footer');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navMatch = document.querySelectorAll(`a[href="#${id}"]`);
      if(entry.isIntersecting){
        navMatch.forEach(a => a.classList.add('active'));
        entry.target.classList.add('visible');
      } else {
        navMatch.forEach(a => a.classList.remove('active'));
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(sec => {
    sec.classList.add('fade-in');
    sectionObserver.observe(sec);
  });

  // Observe inner containers for smoother fade
  document.querySelectorAll('.content-section .container').forEach(el => {
    sectionObserver.observe(el);
  });

  // Form submission UX
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      const btn = form.querySelector('button[type="submit"], .btn');
      if(btn){
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = (currentLang === 'sw') ? 'Inatuma...' : 'Sending...';
        setTimeout(()=> {
          btn.disabled = false;
          btn.textContent = original;
        }, 4000);
      }
    });
  });

  // Image error fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display='none'; });
  });
})();
