document.addEventListener('DOMContentLoaded', () => {
  // ---------- Slideshow ----------
  const images = [
    'assets/apm1.jpg',
    'assets/apm2.jpg',
    'assets/apm3.jpg',
    'assets/apm4.jpg',
    'assets/apm5.jpg'
  ].filter(Boolean);

  // Preload
  images.forEach(src => { const img = new Image(); img.src = src; });

  let frontEl = document.querySelector('.slide.front');
  let backEl  = document.querySelector('.slide.back');
  const toggleBtn = document.getElementById('toggle');

  if (frontEl && backEl && images.length) {
    let idx = 2;           // next image index
    let running = true;
    let timerId = null;

    function setBg(el, src){ el.style.backgroundImage = `url('${src}')`; }

    // init two slides (fallback to same img if only one exists)
    setBg(frontEl, images[0]);
    setBg(backEl,  images[1] || images[0]);

    function schedule(){
      clearTimeout(timerId);
      if (running) timerId = setTimeout(crossfade, 4000);
    }
    function crossfade(){
      const next = images[idx % images.length];
      setBg(backEl, next);

      backEl.classList.add('front');
      frontEl.classList.remove('front');

      // swap refs
      const tmp = frontEl; frontEl = backEl; backEl = tmp;

      idx++;
      schedule();
    }
    schedule();

    if (toggleBtn){
      toggleBtn.addEventListener('click', () => {
        running = !running;
        toggleBtn.setAttribute('aria-pressed', String(!running));
        toggleBtn.textContent = running ? '❚❚' : '▶';
        if (running) schedule(); else clearTimeout(timerId);
      });
    }
  }

  // ---------- Drawer ----------
  const drawer   = document.getElementById('aple-drawer');
  const panel    = drawer?.querySelector('.drawer-panel');
  const backdrop = drawer?.querySelector('.drawer-backdrop');
  const closeBtn = document.getElementById('drawer-close');
  const burgerBtn= document.querySelector('.topstrip .iconbtn[aria-label="Open menu"]');

  if (drawer && panel && backdrop && closeBtn && burgerBtn) {
    const focusableSel = 'button, a, input, [tabindex]:not([tabindex="-1"])';
    let lastFocused = null;

    function openDrawer(){
      lastFocused = document.activeElement;
      drawer.setAttribute('aria-hidden','false');
      document.body.classList.add('body-lock');
      burgerBtn.setAttribute('aria-expanded','true');
      setTimeout(() => (panel.querySelector(focusableSel) || closeBtn).focus(), 0);
    }
    function closeDrawer(){
      drawer.setAttribute('aria-hidden','true');
      document.body.classList.remove('body-lock');
      burgerBtn.setAttribute('aria-expanded','false');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    burgerBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', e => {
      if (drawer.getAttribute('aria-hidden') === 'false' && e.key === 'Escape') closeDrawer();
    });
    drawer.addEventListener('keydown', e => {
      if (drawer.getAttribute('aria-hidden') !== 'false' || e.key !== 'Tab') return;
      const f = panel.querySelectorAll(focusableSel);
      if (!f.length) return;
      const first = f[0], last = f[f.length-1];
      if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
    const y = drawer.querySelector('#drawerYear'); if (y) y.textContent = new Date().getFullYear();
  }
});
