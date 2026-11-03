// Throwaway motion study for the Lavish design review, independent of the app.
(() => {
  const root = document.documentElement;
  const hero = document.querySelector('.hero-track');
  const visual = document.querySelector('.hero-visual');
  visual.setAttribute('aria-label', 'The Code Box cube represents a software product. Its solid blocks separate into interfaces, application logic, content, and infrastructure, then reconnect as one system.');
  visual.setAttribute('data-lavish-revision', 'r7');
  const cube = document.querySelector('#cube');
  const blocks = [...cube.children];
  const glyphs = { front: '‹', right: '›', top: '/' };
  blocks.forEach(block => {
    const x = Number(block.style.getPropertyValue('--x'));
    const y = Number(block.style.getPropertyValue('--y'));
    block.dataset.layer = y === -1 ? 'interface' : y === 1 ? 'infrastructure' : x === -1 ? 'content' : 'logic';
    [...block.children].forEach(face => { face.textContent = glyphs[[...face.classList].find(name => name !== 'face')] || ''; });
  });
  const finePointer = matchMedia('(pointer: fine)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = t => t * t * (3 - 2 * t);
  let mouse = { x: 0, y: 0, screenX: -100, screenY: -100 };
  let smoothed = { x: 0, y: 0 };
  let heroVisible = true;
  let raf = 0;
  let start = performance.now();
  let lastDraw = 0;

  const echo = document.createElement('div');
  echo.className = 'hero-echo';
  echo.innerHTML = '<p class="small-label mono"><span class="dot"></span><span class="business-kicker">The parts behind your product</span></p><h2>Every layer.<br><span>A business purpose.</span></h2><p class="business-explanation">An interface people can use. A system your team can run.</p><div class="layer-key" role="list" aria-label="The layers of a software product"><span role="listitem" data-layer="interface">Interface</span><span role="listitem" data-layer="logic">Application logic</span><span role="listitem" data-layer="content">Content</span><span role="listitem" data-layer="infrastructure">Infrastructure</span></div><a class="business-cta" href="#work">See what these layers become <span aria-hidden="true">↓</span></a>';
  echo.inert = true;
  echo.setAttribute('aria-hidden', 'true');
  document.querySelector('.hero > .wrap').append(echo);
  const layers = [
    { id: 'interface', title: 'Interfaces people can use.', body: 'Frontend and UI/UX turn your product into a clear experience for customers and staff.' },
    { id: 'logic', title: 'Workflows that fit your business.', body: 'Application logic connects schedules, roles, approvals, and the way your team works.' },
    { id: 'content', title: 'Content your team controls.', body: 'Headless CMS and commerce let your team manage content and products without rebuilding the interface.' },
    { id: 'infrastructure', title: 'Foundations your team can own.', body: 'APIs, data, integrations, and documentation keep every part connected and maintainable.' },
  ];
  let previousStory = '';
  document.querySelector('.hero-body').textContent = 'Web applications, storefronts, and internal tools — designed and engineered as one connected system.';
  document.querySelector('.label-top').innerHTML = 'FIG. 01 — YOUR SOFTWARE PRODUCT<br>MODULAR BY DESIGN';
  document.querySelector('.label-bottom').innerHTML = 'INTERFACE / LOGIC / CONTENT / INFRASTRUCTURE<br><span class="accent">THE PARTS BEHIND A WORKING BUSINESS.</span>';
  document.querySelector('.scene-note').textContent = 'Designed together. Built to work together.';
  document.querySelector('.visual-caption').textContent = 'Your product. Every layer connected.';
  const orbit = document.createElement('div');
  orbit.className = 'orbital-system';
  orbit.setAttribute('aria-hidden', 'true');
  orbit.innerHTML = '<i class="orbital-ring"><i class="orbit-dot"></i></i><i class="orbital-ring"><i class="orbit-dot"></i></i><i class="orbital-ring"><i class="orbit-dot"></i></i>';
  visual.prepend(orbit);
  const stage = document.createElement('div');
  stage.className = 'scene-stage';
  stage.innerHTML = '<strong>01</strong><span>COMPOSE THE SYSTEM</span>';
  visual.append(stage);
  const dial = document.createElement('div');
  dial.className = 'scene-dial';
  dial.setAttribute('aria-hidden', 'true');
  dial.textContent = '000°';
  visual.append(dial);

  const marquee = document.createElement('section');
  marquee.className = 'kinetic-banner';
  marquee.setAttribute('aria-label', 'Web applications. Headless commerce. Internal tools. Design systems.');
  marquee.innerHTML = '<div class="kinetic-row" aria-hidden="true">' + Array.from({ length: 3 }, () => '<span>Web applications.</span><span class="spark">✳</span><span class="outlined">Headless commerce.</span><span class="spark">✳</span><span>Internal tools.</span><span class="spark">✳</span>').join('') + '</div><p class="kinetic-sub">From your business workflow to the software that supports it.</p>';
  document.querySelector('.trust').after(marquee);

  const aura = document.createElement('div');
  aura.className = 'pointer-aura';
  aura.setAttribute('aria-hidden', 'true');
  document.body.append(aura);
  const canvas = document.createElement('canvas');
  canvas.className = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  document.querySelector('.hero').prepend(canvas);
  const ctx = canvas.getContext('2d');
  const stars = Array.from({ length: innerWidth < 760 ? 38 : 75 }, (_, i) => ({
    x: ((i * 313.71 + 89) % 997) / 997,
    y: ((i * 127.13 + 27) % 991) / 991,
    radius: .4 + (i % 4) * .32,
    speed: .25 + (i % 5) * .18,
  }));
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  addEventListener('resize', resize, { passive: true });
  const ringElements = [...orbit.children];

  function draw(time) {
    raf = 0;
    if (document.hidden || !heroVisible) return;
    const paused = root.classList.contains('motion-paused') || reduced.matches;
    const p = paused ? 0 : clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - innerHeight));
    const t = paused ? 0 : (time - start) * .001;
    smoothed.x = lerp(smoothed.x, paused ? 0 : mouse.x, .045);
    smoothed.y = lerp(smoothed.y, paused ? 0 : mouse.y, .045);
    // Keep the camera in a three-quarter view. A full yaw rotation aligns all
    // three layers at cardinal angles and makes the volume read as a flat grid.
    const yaw = -38 + (paused ? 0 : Math.sin(t * .23) * 8 + p * 10 + smoothed.x * 5);
    const pitch = -27 + (paused ? 0 : Math.sin(t * .19) * 2 - p * 7 + smoothed.y * 3);
    cube.style.transform = `translateY(${paused ? 0 : Math.sin(t * .85) * 9}px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${-6 + p * 8}deg)`;
    const explode = ease(clamp(p / .33));
    const helix = ease(clamp((p - .3) / .35));
    const reassemble = ease(clamp((p - .78) / .22));
    blocks.forEach((block, i) => {
      const x = Number(block.style.getPropertyValue('--x'));
      const y = Number(block.style.getPropertyValue('--y'));
      const z = Number(block.style.getPropertyValue('--z'));
      const distance = 50 + explode * 31;
      const angle = i * .76 + t * .16;
      let bx = lerp(x * distance, Math.cos(angle) * 104, helix);
      let by = lerp(y * distance, (i - 13) * 11, helix);
      let bz = lerp(z * distance, Math.sin(angle) * 104, helix);
      bx = lerp(bx, x * 50, reassemble);
      by = lerp(by, y * 50, reassemble);
      bz = lerp(bz, z * 50, reassemble);
      const turn = helix * (1 - reassemble) * (i % 2 ? 9 : -9);
      block.style.transform = `translate3d(${bx.toFixed(2)}px,${by.toFixed(2)}px,${bz.toFixed(2)}px) rotateX(${turn}deg) rotateY(${turn * .6}deg)`;
    });
    orbit.style.transform = `rotateX(${63 - p * 28 + smoothed.y * 4}deg) rotateZ(${-27 + t * 5}deg)`;
    ringElements.forEach((el, i) => { el.style.transform = `rotateX(${i * 22 + p * i * 22}deg) rotateY(${i * 35}deg) rotateZ(${t * (i % 2 ? -14 : 17)}deg)`; });
    const index = p < .3 ? 0 : p < .78 ? 1 : 2;
    const layerIndex = clamp(Math.floor((p - .34) / .44 * layers.length), 0, layers.length - 1);
    const selected = layers[layerIndex];
    const storyKey = `${index}:${layerIndex}`;
    const hidden = p < .34;
    if (echo.inert !== hidden) { echo.inert = hidden; echo.setAttribute('aria-hidden', String(hidden)); }
    if (storyKey !== previousStory) {
      previousStory = storyKey;
      echo.querySelector('h2').innerHTML = index === 2 ? 'One connected<br><span>product.</span>' : 'Every layer.<br><span>A business purpose.</span>';
      echo.querySelector('.business-kicker').textContent = index === 2 ? 'The Code Box approach' : selected.title;
      echo.querySelector('.business-explanation').textContent = index === 2 ? 'The layers come together as a web app, storefront, or internal tool your team can use and build on.' : selected.body;
      echo.querySelectorAll('.layer-key [data-layer]').forEach(item => item.classList.toggle('active', index === 2 || item.dataset.layer === selected.id));
      blocks.forEach(block => block.classList.toggle('layer-active', index === 2 || index === 1 && block.dataset.layer === selected.id));
    }
    stage.firstElementChild.textContent = ['01', '02', '03'][index];
    stage.lastElementChild.textContent = ['YOUR IDEA / ONE SYSTEM', selected.id.toUpperCase() + ' / BUSINESS PURPOSE', 'CONNECTED / YOUR PRODUCT'][index];
    dial.textContent = String(Math.round(p * 360)).padStart(3, '0') + '°';
    if (time - lastDraw > 32 || paused) {
      lastDraw = time;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const points = stars.map(star => ({ x: (star.x * w + t * star.speed * 3 + smoothed.x * 10) % w, y: (star.y * h + Math.sin(t * .2 + star.x * 10) * 10 + h) % h, star }));
      points.forEach((point, i) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,119,89,${.12 + .24 * (.5 + .5 * Math.sin(t * .5 + i))})`;
        ctx.arc(point.x, point.y, point.star.radius, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i + 1; j < points.length; j++) {
          const other = points[j];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255,119,89,${.045 * (1 - distance / 120)})`;
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });
    }
    if (!paused) raf = requestAnimationFrame(draw);
  }
  function startLoop() { if (!raf && heroVisible && !document.hidden) raf = requestAnimationFrame(draw); }
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; if (heroVisible) startLoop(); }, { rootMargin: '150px' }).observe(hero);
  new MutationObserver(startLoop).observe(root, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', startLoop);

  addEventListener('pointermove', event => {
    if (!finePointer.matches || reduced.matches || root.classList.contains('motion-paused')) return;
    mouse = { x: event.clientX / innerWidth * 2 - 1, y: event.clientY / innerHeight * 2 - 1, screenX: event.clientX, screenY: event.clientY };
    aura.style.opacity = '.7';
    aura.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    aura.classList.toggle('over-control', !!event.target.closest('a,button,summary'));
    const card = event.target.closest('.project-art,.service');
    if (card) { const rect = card.getBoundingClientRect(); card.style.setProperty('--hover-x', ((event.clientX - rect.left) / rect.width * 100) + '%'); card.style.setProperty('--hover-y', ((event.clientY - rect.top) / rect.height * 100) + '%'); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { aura.style.opacity = '0'; });

  const aboutTitle = document.querySelector('.about h2');
  const walker = document.createTreeWalker(aboutTitle, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => { const fragment = document.createDocumentFragment(); node.textContent.split(/(\s+)/).forEach(word => { if (/\S/.test(word)) { const span = document.createElement('span'); span.className = 'word'; span.textContent = word; fragment.append(span); } else fragment.append(document.createTextNode(word)); }); node.replaceWith(fragment); });
  const words = [...aboutTitle.querySelectorAll('.word')];
  const processCards = [...document.querySelectorAll('.process-card')];
  let scrollFrame = 0;
  function scrollEffects() {
    scrollFrame = 0;
    const paused = reduced.matches || root.classList.contains('motion-paused');
    const h = innerHeight;
    const banner = marquee.getBoundingClientRect();
    root.style.setProperty('--marquee-x', paused ? '0px' : (-180 - (h - banner.top) * .22) + 'px');
    root.style.setProperty('--spark-spin', paused ? '0deg' : (scrollY * .065) + 'deg');
    processCards.forEach((card, i) => {
      const progress = clamp((h * .95 - card.getBoundingClientRect().top - i * 65) / (h * .4));
      card.style.setProperty('--phase-tilt', paused ? '0deg' : ((1 - progress) * 24) + 'deg');
      card.style.setProperty('--phase-lift', paused ? '0px' : ((1 - progress) * 50) + 'px');
      card.style.setProperty('--phase-progress', progress * 100 + '%');
      card.classList.toggle('phase-active', progress > .5);
    });
    const aboutProgress = clamp((h * .8 - aboutTitle.getBoundingClientRect().top) / (h * .5));
    words.forEach((word, i) => word.classList.toggle('read', paused || aboutProgress > i / words.length));
    root.style.setProperty('--about-shift', paused ? '0px' : (aboutProgress * -60) + 'px');
    const contact = document.querySelector('.contact').getBoundingClientRect();
    root.style.setProperty('--contact-orbit', paused ? '1' : (.6 + clamp((h - contact.top) / h) * .6));
    if (heroVisible) startLoop();
  }
  addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(scrollEffects); }, { passive: true });
  addEventListener('resize', scrollEffects, { passive: true });
  document.querySelector('.motion-toggle').addEventListener('click', scrollEffects);
  const email = document.querySelector('.contact-bottom .email');
  email.addEventListener('pointermove', event => { if (!finePointer.matches || reduced.matches || root.classList.contains('motion-paused')) return; const rect = email.getBoundingClientRect(); email.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .09}px,${(event.clientY - rect.top - rect.height / 2) * .2}px)`; });
  email.addEventListener('pointerleave', () => { email.style.transform = ''; });
  document.querySelector('.review h2').textContent = 'The animation explains the business.';
  document.querySelector('.review p').textContent = 'The cube is a software product. Its parts represent interface, application logic, content, and infrastructure. Scroll reveals what each layer does for a business, then shows those capabilities as project concepts. Actual project names and imagery can replace the illustrative work.';
  document.querySelector('.review').setAttribute('data-lavish-revision', 'r7');
  scrollEffects();
  startLoop();
})();
