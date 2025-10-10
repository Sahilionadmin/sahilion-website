/* script.js
   Handles:
   - language toggle (Swahili default)
   - replacing text via TRANSLATIONS
   - smooth scroll active nav highlighting (IntersectionObserver)
   - fade-in on scroll
   - simple form submission UX improvements
   - newsletter input placeholder changes
   - button :active color handled via CSS
*/

(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  // Apply translations to all elements with data-key
  function applyTranslations(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];
    
    // Elements with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if(key && dict[key]) el.textContent = dict[key];
    });

    // Nav menu links
    document.querySelectorAll('nav a.nav-link').forEach(a => {
      const key = a.getAttribute('data-key');
      if(key && dict[key]) a.textContent = dict[key];
    });

    // Footer nav
    document.querySelectorAll('.footer-nav a').forEach(a => {
      const key = a.getAttribute('data-key');
      if(key && dict[key]) a.textContent = dict[key];
    });

    // Newsletter placeholder
    const newsletterInput = document.querySelector('.newsletter-footer input');
    if(newsletterInput){
      newsletterInput.placeholder = dict['newsletter.label'] || '';
    }

    // Newsletter button
    const newsletterBtn = document.querySelector('.newsletter-footer button');
    if(newsletterBtn){
      newsletterBtn.textContent = dict['newsletter.btn'] || '';
    }

    // CTA buttons
    document.querySelectorAll('.cta, button[type="submit"], .lang-switch').forEach(btn => {
      btn.textContent = dict[btn.getAttribute('data-key')] || btn.textContent;
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

  // IntersectionObserver for active nav link and fade-in
  const sections = document.querySelectorAll('main section, footer');
  const navLinks = document.querySelectorAll('nav a.nav-link, .footer-nav a');

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

  // Observe content-section children for smoother reveal
  document.querySelectorAll('.content-section .container').forEach(el => {
    sectionObserver.observe(el);
  });

  // Form submission UX improvements
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