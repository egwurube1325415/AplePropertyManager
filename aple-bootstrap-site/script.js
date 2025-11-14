// Hero slideshow (5 images). Replace URLs with your own licensed files later.
(function(){
    const images = [
        "assets/apm1.jpg",
        "assets/apm2.jpg",
        "assets/apm3.jpg",
        "assets/apm4.jpg",
        "assets/apm5.jpg",
        "assets/apm6.jpg",
        "assets/apm7.jpg"
      ];
      
      
  
    let i = 0;
    let running = true;
    const front = document.querySelector('.slide.front');
    const back  = document.querySelector('.slide.back');
    const btn   = document.getElementById('toggle');
  
    // Preload
    images.forEach(src => { const im = new Image(); im.src = src; });
  
    function setBg(el, src){ el.style.backgroundImage = `url('${src}')`; }
  
    function tick(){
      // next image goes to the "back", then we crossfade
      const next = images[i % images.length];
      setBg(back, next);
      back.classList.add('front');
      front.classList.remove('front');
  
      // swap references
      const tmp = front;
      window.front = back; // keep for dev tools
      window.back  = tmp;
  
      i++;
      schedule();
    }
  
    function schedule(){
      clearTimeout(window.__apleTimer);
      if (running) window.__apleTimer = setTimeout(tick, 4000); // change every 4s
    }
  
    // init
    setBg(front, images[0]);
    if (images[1]) setBg(back, images[1]);
    i = 2;
    schedule();
  
    // pause/play
    btn.addEventListener('click', ()=>{
      running = !running;
      btn.setAttribute('aria-pressed', String(!running));
      btn.textContent = running ? '❚❚' : '▶';
      if (running) schedule(); else clearTimeout(window.__apleTimer);
    });
  })();

  