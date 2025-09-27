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
    try { mobileMenu.querySelector('a')?.focus();
    } catch (e) { /* no-op */ }
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
  // Flying border effect is now provided by SideRun.init in effects/siderun.js

  // Initialize flying borders for desktop nav and mobile bits
  const desktopNav = document.querySelector('.nav.svelte-na9uof');
  const mobileBar = document.querySelector('.mobile-nav.svelte-na9uof');
  const mobilePanel = document.querySelector('#mobileMenu');
  const glassCard = document.querySelector('#glassCard');
  if (window.SideRun && typeof window.SideRun.init === 'function'){
    const common = { margin: 11 };
    SideRun.init(desktopNav, common);
    SideRun.init(mobileBar, common);
    SideRun.init(mobilePanel, { ...common, tail: 30, isBottom: true });
    // Card border with slightly larger radius to match 16px border-radius
    SideRun.init(glassCard, { ...common, radius: 16, tail: 16 });
  }
})();
