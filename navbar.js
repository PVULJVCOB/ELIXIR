(function(){
  /* Mobile menu interactions */
  const menuPrompt = document.getElementById('menuPrompt');
  const clickCatch = document.getElementById('clickCatch');
  const mobileMenu = document.getElementById('mobileMenu');

  const burgerIcon = `
    <div class="menu-prompt_icon svelte-na9uof">
      <svg width="37" height="37" viewBox="0 0 37 37" xmlns="http://www.w3.org/2000/svg" fill="#080232" class="svelte-na9uof">
        <rect x="9" y="18" width="19" height="1"></rect>
        <rect x="9" y="22" width="19" height="1"></rect>
        <rect x="9" y="14" width="19" height="1"></rect>
      </svg>
    </div>`;
  const closeIcon = `
    <div class="menu-prompt_icon svelte-na9uof">
      <svg width="37" height="37" viewBox="0 0 37 37" xmlns="http://www.w3.org/2000/svg" fill="#080232" class="svelte-na9uof">
        <rect x="11" y="25.4351" width="19" height="1" transform="rotate(-45 11 25.4351)"></rect>
        <rect x="11.707" y="12.0005" width="19" height="1" transform="rotate(45 11.707 12.0005)"></rect>
      </svg>
    </div>`;

  function openMenu(){
    menuPrompt.setAttribute('aria-expanded','true');
    clickCatch.hidden = false;
    mobileMenu.setAttribute('aria-hidden','false');
    // Show elements by overriding display:none from CSS when mobile
    clickCatch.style.display = 'flex';
    mobileMenu.style.display = 'flex';
    menuPrompt.innerHTML = closeIcon;
    document.addEventListener('keydown', onKeyDown);
  }
  function closeMenu(){
    menuPrompt.setAttribute('aria-expanded','false');
    mobileMenu.setAttribute('aria-hidden','true');
    clickCatch.hidden = true;
    clickCatch.style.display = 'none';
    mobileMenu.style.display = 'none';
    menuPrompt.innerHTML = burgerIcon;
    document.removeEventListener('keydown', onKeyDown);
  }
  function toggleMenu(){
    const expanded = menuPrompt.getAttribute('aria-expanded') === 'true';
    expanded ? closeMenu() : openMenu();
  }
  function onKeyDown(e){ if(e.key === 'Escape') closeMenu(); }

  if (menuPrompt && clickCatch && mobileMenu){
    menuPrompt.addEventListener('click', toggleMenu);
    menuPrompt.addEventListener('keypress', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }});
    clickCatch.addEventListener('click', closeMenu);
    // Close on navigation click in mobile menu
    mobileMenu.addEventListener('click', (e)=>{ if(e.target.closest('a')) closeMenu(); });
  }

  /* Flying border effect mirroring the Svelte Border component */
  function initFlyingBorder(hostEl, options = {}) {
    if (!hostEl) return () => {};
    const strokeHost = hostEl.querySelector('.nav_stroke.svelte-na9uof');
    if (!strokeHost) return () => {};

    strokeHost.innerHTML = '';

    const defaults = {
      radius: 8,
      tail: 10,
      gap: 10,
      ease: 0.1,
      hoverAxis: 'x',
      isBottom: false,
      isTop: false
    };
    const cfg = Object.assign({}, defaults, options);
    if (options.hoverHorizontal === false) cfg.hoverAxis = 'y';

    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.classList.add('flying-border');

    const rectPrimary = document.createElementNS(NS, 'rect');
    rectPrimary.setAttribute('class', 'fb-runner');
    const rectSecondary = document.createElementNS(NS, 'rect');
    rectSecondary.setAttribute('class', 'fb-static-outer');
    const rectTailInner = document.createElementNS(NS, 'rect');
    rectTailInner.setAttribute('class', 'fb-static-inner');
    const rectTailOuter = document.createElementNS(NS, 'rect');
    rectTailOuter.setAttribute('class', 'fb-runner-ghost');

    svg.appendChild(rectPrimary);
    svg.appendChild(rectSecondary);
    svg.appendChild(rectTailInner);
    svg.appendChild(rectTailOuter);
    strokeHost.appendChild(svg);

    const metrics = {
      perimeter: 0,
      arcQuarter: 0,
      runnerSegment: 0,
      runnerHead: 0,
      widthSpan: 0,
      bases: {
        primaryStart: 0, // B
        primaryEnd: 0,   // V
        secondaryStart: 0, // _
        secondaryEnd: 0,   // z
        wrap: 0           // $
      }
    };

    const state = {
      hoverX: 0.5,
      hoverY: 0.5,
      isHover: false
    };

    const primary = { target: 0, eased: 0 };
    const secondary = { target: 0, eased: 0 };

    let hostRect = hostEl.getBoundingClientRect();
    let rafId;

    const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
    const mix = (a, b, t) => a * (1 - t) + b * t;

    function setRectGeometry(width, height, radius) {
      const innerW = Math.max(0, width - 3);
      const innerH = Math.max(0, height - 3);
      [rectPrimary, rectSecondary, rectTailInner, rectTailOuter].forEach(rect => {
        rect.setAttribute('x', '1.5');
        rect.setAttribute('y', '1.5');
        rect.setAttribute('width', innerW);
        rect.setAttribute('height', innerH);
        rect.setAttribute('rx', radius);
      });
    }

    function recalcGeometry() {
      hostRect = hostEl.getBoundingClientRect();
      const width = Math.max(0, hostRect.width + 22);
      const height = Math.max(0, hostRect.height + 22);
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

      const innerW = Math.max(0, width - 3);
      const innerH = Math.max(0, height - 3);
      const radius = Math.min(cfg.radius, Math.max(0, Math.min(innerW, innerH) / 2));
      setRectGeometry(width, height, radius);

      const perimeter = rectPrimary.getTotalLength ? rectPrimary.getTotalLength() : 2 * (innerW + innerH);
      metrics.perimeter = perimeter;
      metrics.arcQuarter = 2 * Math.PI * radius * 0.25;
      metrics.runnerSegment = metrics.arcQuarter + cfg.tail * 2;
      metrics.runnerHead = metrics.arcQuarter + cfg.tail;
      metrics.widthSpan = Math.max(0, innerW - radius * 2);

      metrics.bases.primaryStart = metrics.runnerHead;
      metrics.bases.primaryEnd = -metrics.widthSpan - metrics.arcQuarter + metrics.runnerHead;
      metrics.bases.secondaryStart = metrics.runnerHead - perimeter * 0.5;
      metrics.bases.secondaryEnd = -perimeter * 0.5 - metrics.widthSpan - metrics.arcQuarter + metrics.runnerHead;
      metrics.bases.wrap = metrics.bases.secondaryEnd + perimeter;

      const defaultPrimary = cfg.isBottom ? metrics.bases.secondaryEnd : metrics.bases.primaryStart;
      const defaultSecondary = cfg.isTop ? metrics.bases.primaryEnd : metrics.bases.secondaryStart;
      primary.eased = primary.target = defaultPrimary;
      secondary.eased = secondary.target = defaultSecondary;

      applyDashArrays();
    }

    function updateTargets() {
      if (!metrics.perimeter) return;

      if (state.isHover) {
        if ((cfg.hoverAxis || 'x').toLowerCase() === 'y') {
          const ratio = clamp(state.hoverY, 0, 1);
          primary.target = mix(metrics.bases.primaryStart, metrics.bases.wrap, ratio);
          secondary.target = mix(metrics.bases.primaryEnd, metrics.bases.secondaryStart, ratio);
        } else {
          const ratio = clamp(state.hoverX, 0, 1);
          primary.target = mix(metrics.bases.primaryStart, metrics.bases.primaryEnd, ratio);
          secondary.target = mix(metrics.bases.secondaryEnd, metrics.bases.secondaryStart, ratio);
        }
      } else {
        primary.target = cfg.isBottom ? metrics.bases.secondaryEnd : metrics.bases.primaryStart;
        secondary.target = cfg.isTop ? metrics.bases.primaryEnd : metrics.bases.secondaryStart;
      }
    }

    function applyDashArrays() {
      if (!metrics.perimeter) return;

      const segment = Math.min(metrics.perimeter, Math.max(1, metrics.runnerSegment));
      const mainGap = Math.max(0, metrics.perimeter - segment);
      rectPrimary.setAttribute('stroke-dasharray', `${segment} ${mainGap}`);
      rectPrimary.setAttribute('stroke-dashoffset', `${primary.eased}`);
      rectSecondary.setAttribute('stroke-dasharray', `${segment} ${mainGap}`);
      rectSecondary.setAttribute('stroke-dashoffset', `${secondary.eased}`);

      const tailLength = -secondary.eased + primary.eased - cfg.gap * 2 - segment;
      const leading = Math.max(0, tailLength);
      const leadingGap = Math.max(0, metrics.perimeter - leading);
      rectTailInner.setAttribute('stroke-dasharray', `${leading} ${leadingGap}`);
      rectTailInner.setAttribute('stroke-dashoffset', `${primary.eased - segment - cfg.gap}`);

      const trailingLength = metrics.perimeter + secondary.eased - primary.eased - cfg.gap * 2 - segment;
      const trailing = Math.max(0, trailingLength);
      const trailingGap = Math.max(0, metrics.perimeter - trailing);
      rectTailOuter.setAttribute('stroke-dasharray', `${trailing} ${trailingGap}`);
      rectTailOuter.setAttribute('stroke-dashoffset', `${secondary.eased - segment - cfg.gap + metrics.perimeter * 2}`);
    }

    function animate() {
      updateTargets();
      primary.eased += (primary.target - primary.eased) * cfg.ease;
      secondary.eased += (secondary.target - secondary.eased) * cfg.ease;
      applyDashArrays();
      rafId = requestAnimationFrame(animate);
    }

    function updateHoverFromRect(rect) {
      hostRect = hostEl.getBoundingClientRect();
      const centerX = (rect.left + rect.right) / 2;
      const centerY = (rect.top + rect.bottom) / 2;
      state.hoverX = clamp((centerX - hostRect.left) / (hostRect.width || 1), 0, 1);
      state.hoverY = clamp((centerY - hostRect.top) / (hostRect.height || 1), 0, 1);
    }

    function handleEnter(event) {
      state.isHover = true;
      updateHoverFromRect(event.currentTarget.getBoundingClientRect());
    }

    function handleLeave() {
      state.isHover = false;
    }

    const links = hostEl.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleEnter);
      link.addEventListener('mouseleave', handleLeave);
    });
    hostEl.addEventListener('mouseleave', handleLeave);

    const ro = new ResizeObserver(recalcGeometry);
    ro.observe(hostEl);
    window.addEventListener('resize', recalcGeometry);

    recalcGeometry();
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', recalcGeometry);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleEnter);
        link.removeEventListener('mouseleave', handleLeave);
      });
      hostEl.removeEventListener('mouseleave', handleLeave);
    };
  }

  // Initialize flying borders for desktop nav and mobile bits
  const desktopNav = document.querySelector('.nav.svelte-na9uof');
  const mobileBar = document.querySelector('.mobile-nav.svelte-na9uof');
  const mobilePanel = document.querySelector('#mobileMenu');
  initFlyingBorder(desktopNav);
  initFlyingBorder(mobileBar);
  initFlyingBorder(mobilePanel, { tail: 30, isBottom: true });
})();
