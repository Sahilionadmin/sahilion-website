/* script.js
   Handles:
   - language toggle (Swahili default)
   - replacing text via TRANSLATIONS
   - smooth scroll active nav highlighting (IntersectionObserver)
   - fade-in on scroll
   - simple form submission UX improvements (no backend changes)
   - button :active color handled via CSS
*/

(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  // Apply translations to all elements with data-key
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];

    // All elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if (key && dict[key]) el.textContent = dict[key];
    });

    // Nav links
    document.querySelectorAll('nav a.nav-link').forEach(a => {
      const key = a.getAttribute('data-key');
      if (key && dict[key]) a.textContent = dict[key];
    });

    // Newsletter placeholder
    document.querySelectorAll('.footer-right input[type="email"]').forEach(input => {
      if(dict['newsletter.placeholder']){
        input.setAttribute('placeholder', dict['newsletter.placeholder']);
      }
    });

    // CTA buttons
    document.querySelectorAll('.cta, .btn').forEach(btn => {
      const key = btn.getAttribute('data-key');
      if(key && dict[key]) btn.textContent = dict[key];
    });

    // Update language toggle label
    const langToggle = document.getElementById('language-toggle');
    if(langToggle) langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';

    // Update copyright
    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) {
      copyrightEl.textContent = dict['footer.copyright'] || '';
    }
  }

  // Initialize translations
  applyTranslations(currentLang);

  // Language toggle behavior
  const toggleBtn = document.getElementById('language-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      currentLang = (currentLang === 'sw') ? 'en' : 'sw';
      applyTranslations(currentLang);
      toggleBtn.setAttribute('aria-pressed', currentLang === 'en');
    });
    // keyboard accessibility
    toggleBtn.addEventListener('keydown', (e) => {
      if(e.key === 'Enter' || e.key === ' ') toggleBtn.click();
    });
  }

  // Smooth scroll behavior for internal links
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

  // IntersectionObserver for active nav link & fade-in
  const sections = document.querySelectorAll('main section, footer');
  const navLinks = document.querySelectorAll('nav a.nav-link, .footer-nav a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navMatch = document.querySelectorAll(`a[href="#${id}"]`);
      if(entry.isIntersecting){
        navMatch.forEach(a => a.classList.add('active'));
        entry.target.classList.add('visible'); // fade-in
      } else {
        navMatch.forEach(a => a.classList.remove('active'));
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(sec => {
    sec.classList.add('fade-in');
    sectionObserver.observe(sec);
  });

  document.querySelectorAll('.content-section .container').forEach(el => {
    sectionObserver.observe(el);
  });

  // UX: show simple submit feedback on forms
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

  // Image fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display='none'; });
  });

})();