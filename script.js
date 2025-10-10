(() => {
  const LANG_DEFAULT = 'sw';
  let currentLang = LANG_DEFAULT;

  // Apply translations
  function applyTranslations(lang){
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['sw'];
    document.querySelectorAll('[data-key]').forEach(el=>{
      const key = el.getAttribute('data-key');
      if(key && dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-key-placeholder]').forEach(el=>{
      const key = el.getAttribute('data-key-placeholder');
      if(key && dict[key]) el.placeholder = dict[key];
    });

    const toggleBtn = document.getElementById('language-toggle');
    if(toggleBtn) toggleBtn.textContent = (lang==='sw')?'English':'Kiswahili';

    const copyrightEl = document.getElementById('copyright');
    if(copyrightEl) copyrightEl.textContent = dict['footer.copyright']||'';
  }

  applyTranslations(currentLang);

  // Language toggle
  const toggleBtn = document.getElementById('language-toggle');
  if(toggleBtn){
    toggleBtn.addEventListener('click', () => {
      currentLang = (currentLang==='sw')?'en':'sw';
      applyTranslations(currentLang);
      toggleBtn.setAttribute('aria-pressed', currentLang==='en');
    });
    toggleBtn.addEventListener('keydown', (e)=>{
      if(e.key==='Enter'||e.key===' ') toggleBtn.click();
    });
  }

  // Smooth scroll for internal links
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

  // IntersectionObserver for active nav & fade-in
  const sections = document.querySelectorAll('main section, footer, .content-section');
  const sectionObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = entry.target.id;
      const navMatch = document.querySelectorAll(`a[href="#${id}"]`);
      if(entry.isIntersecting){
        navMatch.forEach(a=>a.classList.add('active'));
        entry.target.classList.add('visible');
      } else {
        navMatch.forEach(a=>a.classList.remove('active'));
      }
    });
  },{threshold:0.45});
  sections.forEach(sec=>{
    sec.classList.add('fade-in');
    sectionObserver.observe(sec);
  });

  // Form submit feedback
  document.querySelectorAll('form').forEach(form=>{
    form.addEventListener('submit', (e)=>{
      const btn = form.querySelector('button[type="submit"], .btn');
      if(btn){
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = (currentLang==='sw')?'Inatuma...':'Sending...';
        setTimeout(()=>{
          btn.disabled = false;
          btn.textContent = original;
        },4000);
      }
    });
  });

  // Image error fallback
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=>{ img.style.display='none'; });
  });
})();