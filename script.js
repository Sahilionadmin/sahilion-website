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

    // Update language toggle label
    const langToggle = document.getElementById('language-toggle');
    if(langToggle) langToggle.textContent = (lang === 'sw') ? 'English' : 'Kiswahili';

    // Update copyright
    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) copyrightEl.textContent = dict['footer.copyright'] || '';

    // Update Terms & Privacy page content if present
    const termsTitle = document.getElementById('terms-title');
    const termsList = document.getElementById('terms-list');
    if(termsTitle && termsList) {
      termsTitle.textContent = dict.terms.title;
      termsList.innerHTML = '';
      dict.terms.list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        termsList.appendChild(li);
      });
    }

    const privacyTitle = document.getElementById('privacy-title');
    const privacyList = document.getElementById('privacy-list');
    if(privacyTitle && privacyList) {
      privacyTitle.textContent = dict.privacy.title;
      privacyList.innerHTML = '';
      dict.privacy.list.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        privacyList.appendChild(li);
      });
    }

    // Update placeholders for newsletter/input boxes
    document.querySelectorAll('input[data-placeholder]').forEach(input => {
      const key = input.getAttribute('data-placeholder');
      if(key && dict[key]) input.setAttribute('placeholder', dict[key]);
    });

    // Update newsletter button
    document.querySelectorAll('button[data-key]').forEach(btn => {
      const key = btn.getAttribute('data-key');
      if(key && dict[key]) btn.textContent = dict[key];
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
  document.querySelectorAll('.content-section .container').forEach(el => {
    sectionObserver.observe(el);
  });

  // Newsletter/form submission UX
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

  // Button color :active handled via CSS
  // Example: .btn:active { background-color:#5DADE2; }

})();
