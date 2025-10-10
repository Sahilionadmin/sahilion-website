(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  // Apply translations to elements
  function applyTranslations(lang){
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];

    // All data-key elements (text)
    document.querySelectorAll('[data-key]').forEach(el=>{
      const key = el.getAttribute('data-key');
      if(key && dict[key]) el.textContent = dict[key];
    });

    // Inputs and placeholders
    document.querySelectorAll('input[data-key]').forEach(inp=>{
      const key = inp.getAttribute('data-key');
      if(key && dict[key]) inp.placeholder = dict[key];
    });

    // Language toggle button
    const toggleBtn = document.getElementById('language-toggle');
    if(toggleBtn) toggleBtn.textContent = (lang==='sw') ? 'English' : 'Kiswahili';

    // Update copyright dynamically
    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) copyrightEl.textContent = dict['footer.copyright'] || '';

    // Footer terms & privacy
    const termsEl = document.getElementById('footer-terms');
    if(termsEl) termsEl.textContent = dict['footer.terms'] || '';
    const privacyEl = document.getElementById('footer-privacy');
    if(privacyEl) privacyEl.textContent = dict['footer.privacy'] || '';
  }

  applyTranslations(currentLang);

  // Language toggle behavior
  const toggleBtn = document.getElementById('language-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', ()=>{
      currentLang = (currentLang==='sw') ? 'en' : 'sw';
      applyTranslations(currentLang);
      toggleBtn.setAttribute('aria-pressed', currentLang==='en');
    });
    toggleBtn.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' ') toggleBtn.click();
    });
  }

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor=>{
    anchor.addEventListener('click', function(e){
      const href = this.getAttribute('href');
      if(href && href.startsWith('#')){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          target.scrollIntoView({behavior:'smooth', block:'start'});
          setTimeout(()=>{ target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); },600);
        }
      }
    });
  });

  // IntersectionObserver: fade-in & nav active
  const sections = document.querySelectorAll('main section, footer');
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      const navMatch = document.querySelectorAll(`a[href="#${id}"]`);
      if(entry.isIntersecting) navMatch.forEach(a=>a.classList.add('active'));
      else navMatch.forEach(a=>a.classList.remove('active'));

      if(entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, {threshold:0.45});

  sections.forEach(sec=>{
    sec.classList.add('fade-in');
    observer.observe(sec);
  });
  document.querySelectorAll('.content-section .container').forEach(el=>observer.observe(el));

  // Simple form submit UX (no backend changes)
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit', ()=>{
      const btn = form.querySelector('button[type="submit"], .btn');
      if(btn){
        btn.disabled=true;
        const original = btn.textContent;
        btn.textContent = (currentLang==='sw') ? 'Inatuma...' : 'Sending...';
        setTimeout(()=>{ btn.disabled=false; btn.textContent = original; },4000);
      }
    });
  });

  // Image error fallback
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=>{ img.style.display='none'; });
  });
})();
