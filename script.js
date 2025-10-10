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
    document.querySelectorAll('[data-key]').forEach(el => {
      const key = el.getAttribute('data-key');
      if(key && dict[key]) el.textContent = dict[key];
    });

    // update language toggle label
    const langToggle = document.getElementById('language-toggle');
    if(langToggle) langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';

    // update copyright
    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) {
      copyrightEl.textContent = dict['footer.copyright'] || '';
    }

    // update placeholders inside inputs
    const newsletterInputs = document.querySelectorAll('#newsletter-email, #newsletter-email-footer');
    newsletterInputs.forEach(input => {
      input.placeholder = (lang === 'sw') ? 'Barua pepe yako' : 'Your email';
    });
    const contactInputs = document.querySelectorAll('.contact-form input[name="name"]');
    contactInputs.forEach(input => {
      input.placeholder = (lang === 'sw') ? 'Jina lako' : 'Your Name';
    });
    const contactEmails = document.querySelectorAll('.contact-form input[name="email"]');
    contactEmails.forEach(input => {
      input.placeholder = (lang === 'sw') ? 'Barua pepe' : 'Email';
    });
    const contactMessages = document.querySelectorAll('.contact-form textarea[name="message"]');
    contactMessages.forEach(input => {
      input.placeholder = (lang === 'sw') ? 'Ujumbe wako' : 'Your Message';
    });
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

  // IntersectionObserver for active nav link (and fade-in)
  const sections = document.querySelectorAll('main section, footer');
  const navLinks = document.querySelectorAll('nav a.nav-link, .footer-nav a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const navMatch = document.querySelectorAll(`a[href="#${id}"]`);
      if(entry.isIntersecting){
        navMatch.forEach(a => a.classList.add('active'));
      } else {
        navMatch.forEach(a => a.classList.remove('active'));
      }

      if(entry.isIntersecting){
        entry.target.classList.add('visible');
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

  // Image fallback
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.display='none'; });
  });

})();