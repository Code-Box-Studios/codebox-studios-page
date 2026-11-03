// A scroll-directed portfolio film for the Lavish concept, not production content.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (n, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, n));
  const smooth = n => n * n * (3 - 2 * n);
  const journey = document.querySelector('#work');
  const projects = [...journey.querySelectorAll('.project')].map(node => node.cloneNode(true));
  const design = document.createElement('article');
  design.className = 'project';
  design.innerHTML = `<div class="project-art design-art"><span class="concept-tag">Interface concept / Design system</span><div class="design-system"><div class="design-wordmark">Assembly<span>Design foundations / v.01</span></div><div class="design-components"><div class="type-specimen">Aa<span>Made to work.<br>Built to belong.</span></div><div class="component-specimen"><div class="swatches"><i></i><i></i><i></i><i></i></div><div class="demo-cta">Start something <span>↗</span></div><div class="demo-input">Your next big idea <span>⌘ K</span></div><div class="demo-tags"><span>Composable</span><span>Accessible</span></div></div></div><div class="design-tokens">SPACE / 08 &nbsp; 16 &nbsp; 24 &nbsp; 32 &nbsp; 64 <span>THOUGHTFULLY CONNECTED.</span></div></div></div><div class="project-caption"><div><span class="mono">04 / Design system</span><h3>Many parts. One language.</h3></div><span class="arrow" aria-hidden="true">↗</span></div>`;
  projects.push(design);
  const stories = [
    { name: 'Scheduling platform', line: 'Your operations, in one place.', body: 'Shared schedules, team roles, and workflow logic in one application.', category: 'Business need / Coordinate daily operations', accent: '#ff9578', mode: 'APPLICATIONS / WORKFLOWS', layer: 'Logic + interface + integrations', service: 'Complex web applications' },
    { name: 'Headless storefront', line: 'Let your team run the storefront.', body: 'Manage products and content through a CMS, with an independently built customer experience.', category: 'Business need / Manage content and commerce', accent: '#ddbf94', mode: 'CONTENT / COMMERCE', layer: 'Content + interface + commerce APIs', service: 'Headless commerce & CMS' },
    { name: 'Internal dashboard', line: 'A clearer view of your business.', body: 'Bring operational data into one interface so your team can see what needs attention.', category: 'Business need / Make information usable', accent: '#9db9df', mode: 'DATA / DECISIONS', layer: 'Data + integrations + interface', service: 'Web applications & integration' },
    { name: 'Design system', line: 'Keep every interface consistent.', body: 'Reusable components, shared patterns, and documentation your team can extend.', category: 'Business need / Grow a consistent product', accent: '#ff7759', mode: 'INTERFACE / CONSISTENCY', layer: 'Components + patterns + documentation', service: 'Frontend development & UI/UX' },
  ];
  journey.className = 'project-journey';
  journey.setAttribute('data-lavish-revision', 'r5');
  journey.setAttribute('aria-label', 'Four project concepts in a three-dimensional scroll showcase');
  journey.innerHTML = `<div class="journey-sticky"><div class="journey-heading wrap"><div><span class="mono">02 / Selected projects</span><h2>Different projects.<br><span>Different dimensions.</span></h2></div><p>Scroll into the work.<br><span>Illustrative concepts. Real case studies to follow.</span></p></div><div class="project-viewport"><div class="journey-floor" aria-hidden="true"></div><div class="journey-ring" aria-hidden="true"></div><span class="journey-ghost" aria-hidden="true">01</span></div><div class="journey-footer wrap"><div class="project-story"><span class="mono project-category"></span><h3 class="project-name"></h3><p class="project-description"></p></div><div class="journey-navigation"><div class="journey-mode mono"></div><div class="journey-controls"><button type="button" class="journey-prev" aria-label="Previous project">←</button><div class="journey-dots" role="group" aria-label="Choose a project"></div><button type="button" class="journey-next" aria-label="Next project">→</button></div><span class="journey-hint mono">Scroll to continue ↓</span></div></div></div>`;
  const viewport = journey.querySelector('.project-viewport');
  journey.querySelector('.journey-heading h2').innerHTML = 'What we build.<br><span>Why it matters.</span>';
  journey.querySelector('.journey-heading p').innerHTML = 'Software built around your business.<br><span>Illustrative concepts. Real case studies to follow.</span>';
  const tourButton = document.createElement('button');
  tourButton.type = 'button';
  tourButton.className = 'journey-tour';
  tourButton.textContent = 'Explore what we build ↗';
  tourButton.setAttribute('aria-pressed', 'false');
  journey.querySelector('.journey-heading p').append(tourButton);
  const scenes = projects.map((project, i) => {
    const scene = document.createElement('article');
    scene.className = 'project-scene';
    scene.dataset.scene = String(i);
    scene.setAttribute('aria-label', stories[i].name + ' — illustrative concept');
    scene.style.setProperty('--project-accent', stories[i].accent);
    const label = document.createElement('div');
    label.className = 'scene-topline mono';
    label.innerHTML = `<span>PROJECT / 0${i + 1}</span><span>${stories[i].mode}</span>`;
    scene.append(label, project);
    const caption = project.querySelector('.project-caption');
    caption.querySelector('h3').textContent = stories[i].line;
    caption.querySelector('.mono').textContent = stories[i].service;
    const connection = document.createElement('p');
    connection.className = 'project-connection';
    connection.textContent = stories[i].layer;
    caption.querySelector('div').append(connection);
    viewport.append(scene);
    return scene;
  });
  const dots = stories.map((story, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'journey-dot';
    button.setAttribute('aria-label', `Show project ${i + 1}: ${story.name}`);
    button.innerHTML = `<span>0${i + 1}</span><i></i>`;
    button.addEventListener('click', () => goTo(i));
    journey.querySelector('.journey-dots').append(button);
    return button;
  });
  let active = -1;
  let scheduled = 0;
  const prev = journey.querySelector('.journey-prev');
  const next = journey.querySelector('.journey-next');
  const services = [...document.querySelectorAll('.service')];
  const about = document.querySelector('.about');
  const contact = document.querySelector('.contact');
  document.querySelector('.services-list').classList.add('spatial-services');
  document.querySelector('#process').classList.add('spatial-process');
  about.classList.add('spatial-about');
  contact.classList.add('spatial-contact');
  function goTo(index) {
    stopTour();
    const target = clamp(index, 0, scenes.length - 1);
    if (root.classList.contains('motion-paused') || reduced.matches) { scenes[target].scrollIntoView({ behavior: 'instant', block: 'center' }); return; }
    const top = scrollY + journey.getBoundingClientRect().top;
    window.scrollTo({ top: top + target / (scenes.length - 1) * (journey.offsetHeight - innerHeight), behavior: 'smooth' });
  }
  prev.addEventListener('click', () => goTo(active - 1));
  next.addEventListener('click', () => goTo(active + 1));
  let tourFrame = 0;
  function stopTour() {
    if (tourFrame) cancelAnimationFrame(tourFrame);
    tourFrame = 0;
    tourButton.textContent = 'Explore what we build ↗';
    tourButton.setAttribute('aria-pressed', 'false');
  }
  tourButton.addEventListener('click', () => {
    if (tourFrame) { stopTour(); return; }
    if (reduced.matches || root.classList.contains('motion-paused')) { goTo((active + 1) % scenes.length); return; }
    const top = scrollY + journey.getBoundingClientRect().top;
    const distance = journey.offsetHeight - innerHeight;
    const began = performance.now();
    tourButton.textContent = 'Pause the scroll tour Ⅱ';
    tourButton.setAttribute('aria-pressed', 'true');
    function advance(time) {
      const progress = clamp((time - began) / 16000);
      window.scrollTo({ top: top + progress * distance, behavior: 'instant' });
      if (progress < 1) tourFrame = requestAnimationFrame(advance);
      else stopTour();
    }
    tourFrame = requestAnimationFrame(advance);
  });
  addEventListener('wheel', stopTour, { passive: true });
  addEventListener('touchstart', event => { if (!event.target.closest('.journey-tour')) stopTour(); }, { passive: true });
  addEventListener('keydown', event => { if (['Escape', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(event.key)) stopTour(); });
  document.querySelector('.motion-toggle').addEventListener('click', stopTour);
  const outcomes = ['An interface your customers and staff can use.', 'Your workflows, connected in one application.', 'Content and products your team can manage.', 'A system your team understands and owns.'];
  services.forEach((service, i) => {
    const outcome = document.createElement('p');
    outcome.className = 'service-outcome';
    outcome.textContent = outcomes[i];
    service.querySelector('summary').after(outcome);
  });
  reduced.addEventListener('change', stopTour);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTour(); });
  const values = (d, index) => {
    const distance = Math.abs(d);
    if (index === 0) return { x: d * -390, y: d * -165, z: distance * -1050, rx: d * 17, ry: d * -48, rz: d * -5 };
    if (index === 1) return { x: d * -650, y: distance * 45, z: distance * -650, rx: d * -6, ry: d * -72, rz: d * 5 };
    if (index === 2) return { x: d * -170, y: d * -490, z: distance * -1050, rx: d * 44, ry: d * -22, rz: d * -3 };
    return { x: d * -520, y: d * 110, z: distance * -1100, rx: d * -13, ry: d * -78, rz: d * 8 };
  };
  function update() {
    scheduled = 0;
    const calm = root.classList.contains('motion-paused') || reduced.matches;
    const h = innerHeight;
    const progress = clamp(-journey.getBoundingClientRect().top / Math.max(1, journey.offsetHeight - h));
    const raw = progress * (scenes.length - 1);
    const focused = Math.round(raw);
    scenes.forEach((scene, i) => {
      const local = raw - i;
      const d = Math.sign(local) * smooth(clamp((Math.abs(local) - .12) / .88));
      const pose = values(d, i);
      const mobile = innerWidth < 760 ? .58 : 1;
      const fit = clamp((viewport.clientHeight - 24) / Math.max(1, scene.offsetHeight), .2, 1);
      scene.style.transform = calm ? 'none' : `translate3d(calc(-50% + ${pose.x * mobile}px),calc(-50% + ${pose.y * mobile}px),${pose.z}px) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg) scale(${fit})`;
      // Keep screens opaque while they cross so text never ghosts through a
      // second project. Fade only when a screen reaches the end of its path.
      scene.style.opacity = calm ? '1' : String(clamp(1 - smooth(clamp((Math.abs(local) - .82) / .18))));
      scene.style.zIndex = String(10 - Math.round(Math.abs(local) * 3));
      scene.inert = !calm && i !== focused;
      scene.setAttribute('aria-hidden', String(!calm && Math.abs(local) >= 1));
      scene.classList.toggle('scene-focused', calm || i === focused);
      scene.style.setProperty('--screen-drift', calm ? '0px' : `${clamp(local, -1, 1) * 22}px`);
      scene.style.setProperty('--component-gap', calm ? '0px' : `${Math.abs(d) * 65}px`);
      scene.style.setProperty('--screen-reveal', calm ? '1' : `${1 - Math.abs(d) * .65}`);
      dots[i].classList.toggle('selected', i === focused);
      dots[i].setAttribute('aria-pressed', String(i === focused));
      dots[i].style.setProperty('--fill', `${clamp(1 - Math.abs(local)) * 100}%`);
    });
    if (focused !== active) {
      active = focused;
      const story = stories[active];
      journey.querySelector('.project-category').textContent = story.category;
      journey.querySelector('.project-name').textContent = story.name;
      journey.querySelector('.project-description').textContent = story.body;
      journey.querySelector('.journey-mode').textContent = `0${active + 1} / 04 — ${story.mode}`;
      journey.querySelector('.journey-ghost').textContent = `0${active + 1}`;
      journey.style.setProperty('--project-accent', story.accent);
      prev.disabled = active === 0;
      next.disabled = active === scenes.length - 1;
    }
    journey.style.setProperty('--journey-turn', calm ? '0deg' : `${progress * 130}deg`);
    services.forEach((service, i) => {
      const rect = service.getBoundingClientRect();
      const enter = smooth(clamp((h * .95 - rect.top) / (h * .6)));
      service.style.transform = calm ? 'none' : `translate3d(${(1 - enter) * 85}px,${(1 - enter) * 35}px,${(1 - enter) * -140}px) rotateY(${(1 - enter) * -32}deg) rotateX(${(1 - enter) * 9}deg)`;
      service.style.setProperty('--service-edge', `${enter * 100}%`);
    });
    for (const section of [about, contact]) {
      const enter = smooth(clamp((h - section.getBoundingClientRect().top) / (h * .8)));
      section.style.setProperty('--section-tilt', calm ? '0deg' : `${(1 - enter) * 14}deg`);
      section.style.setProperty('--section-depth', calm ? '0px' : `${(1 - enter) * -160}px`);
      section.style.setProperty('--section-rise', calm ? '0px' : `${(1 - enter) * 70}px`);
    }
  }
  function schedule() { if (!scheduled) scheduled = requestAnimationFrame(update); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  reduced.addEventListener('change', schedule);
  document.querySelector('.motion-toggle').addEventListener('click', schedule);
  new MutationObserver(schedule).observe(root, { attributes: true, attributeFilter: ['class'] });
  update();
})();
