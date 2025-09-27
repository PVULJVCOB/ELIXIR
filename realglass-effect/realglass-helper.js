/*
  RealGlass Helper - simple reusable manager to apply RealGlass to any element

  Usage (copy/paste):
  1) Include CDN before this helper
     <script src="https://cdn.jsdelivr.net/npm/realglass/RealGlass.standalone.js"></script>
     <script src="./realglass-helper.js"></script>

  2) Mark elements with data-realglass and optional data options
     <div class="card" data-realglass data-realglass-options='{"frosting":0.3,"borderRadius":20}'></div>

  3) Or call programmatically:
     await RealGlassManager.applyTo(el, { frosting: 0.3, borderRadius: 20 })

  The manager ensures:
  - Single screenshot/init reused across instances
  - Target remains hidden until screenshot is done, then fades in
  - Safe re-apply on resize if desired
*/

(function(global){
  const DEFAULT_OPTIONS = {
    frosting: 0.3,
    borderRadius: 20,
    lightStrength: 2.0,
    chromaticAberration: 0.6,
    glassOpacity: 0.08,
    lightX: 0.7,
    lightY: 0.3,
    edgeSmoothness: 1.8,
    ior: 1.65,
    specularShininess: 48,
    thickness: 1.5,
    tintColor: [0.98, 0.99, 1.0],
    tintStrength: 0.08,
    useMask: false,
    maskSmoothing: 0.15
  };

  class RealGlassManager {
    static _instance = null;
    static _initPromise = null;
    static _applied = new Map(); // el -> options
    static _lastCaptureY = 0;
    static _recapturePending = false;
    static _listenersBound = false;

    static async getInstance(){
      if (this._instance) return this._instance;
      this._instance = new RealGlass();
      return this._instance;
    }

    static async ensureInitialized(){
      if (this._initPromise) return this._initPromise;
      const inst = await this.getInstance();
      // Run init once to take the screenshot and set listeners
      this._initPromise = inst.init();
      return this._initPromise;
    }

    // Utility: merge options
    static _mergeOptions(base, extra){
      return Object.assign({}, base, extra || {});
    }

    // Ensure element stays hidden until init is done
    static _hideUntilReady(el){
      el.classList.add('rg-hidden-until-ready');
    }

    static _show(el){
      el.classList.remove('rg-hidden-until-ready');
    }

    static async applyTo(el, options){
      if (!el) throw new Error('RealGlassManager.applyTo: element is required');

      // Hide until screenshot is taken
      this._hideUntilReady(el);

      // Ensure global init once
      await this.ensureInitialized();

      const inst = await this.getInstance();
      const opts = this._mergeOptions(DEFAULT_OPTIONS, options);

      // Show the element before applying so RealGlass can size it correctly
      this._show(el);

      await inst.apply(el, opts);
      // track for future reapply
      try { this._applied.set(el, opts); } catch(_) {}
      // mark for CSS overrides
      try { el.setAttribute('data-rg-applied', ''); } catch(_) {}
      return inst;
    }

    // Auto-scan elements with data-realglass attribute
    static async autoApply(){
      const nodes = document.querySelectorAll('[data-realglass]');
      if (!nodes.length) return;

      // Hide all first
      nodes.forEach(n => this._hideUntilReady(n));

      // Scroll to top for a consistent full-page screenshot, then restore
      const prevX = window.scrollX; const prevY = window.scrollY;
      window.scrollTo(0, 0);

  await this.ensureInitialized();
      const inst = await this.getInstance();

      for (const n of nodes){
        const raw = n.getAttribute('data-realglass-options');
        let parsed = {};
        if (raw){
          try { parsed = JSON.parse(raw); } catch(e){ console.warn('Invalid data-realglass-options JSON', e); }
        }
        // Show then apply
        this._show(n);
        const opts = this._mergeOptions(DEFAULT_OPTIONS, parsed);
        await inst.apply(n, opts);
        try { this._applied.set(n, opts); } catch(_) {}
        try { n.setAttribute('data-rg-applied', ''); } catch(_) {}
      }

      // Restore scroll position on next frame to avoid jank during capture
      requestAnimationFrame(() => window.scrollTo(prevX, prevY));

      // Set capture baseline and bind listeners for recapture on significant scroll
      this._lastCaptureY = window.scrollY || 0;
      this._bindAutoRecapture();
    }

    static _bindAutoRecapture(){
      if (this._listenersBound) return;
      this._listenersBound = true;
      const onScrollOrResize = () => {
        const dy = Math.abs((window.scrollY || 0) - this._lastCaptureY);
        const threshold = Math.max(200, window.innerHeight * 0.6);
        if (dy < threshold || this._recapturePending) return;
        this._recapturePending = true;
        // Debounce a bit to avoid zapping while scrolling fast
        setTimeout(async () => {
          try {
            const inst = await this.getInstance();
            // Re-run init to retake screenshot at current scroll position
            await inst.init();
            // Re-apply to all tracked elements without hiding to avoid flicker
            for (const [el, opts] of this._applied.entries()){
              try { await inst.apply(el, opts); } catch(e){ console.warn('RealGlass re-apply failed', e); }
            }
            this._lastCaptureY = window.scrollY || 0;
          } catch(e){ console.error('RealGlass recapture failed', e); }
          finally { this._recapturePending = false; }
        }, 120);
      };
      window.addEventListener('scroll', onScrollOrResize, { passive: true });
      window.addEventListener('resize', onScrollOrResize);
    }
  }

  // Expose
  global.RealGlassManager = RealGlassManager;

  // Prefer running after full window load so the screenshot captures all content
  document.addEventListener('DOMContentLoaded', () => {
    const run = () => {
      if (typeof RealGlass === 'undefined'){
        console.warn('RealGlass library not found. Include https://cdn.jsdelivr.net/npm/realglass/RealGlass.standalone.js before realglass-helper.js');
        return;
      }
      RealGlassManager.autoApply().catch(err => console.error('RealGlass autoApply failed', err));
    };
    if (document.readyState === 'complete') {
      // All resources loaded already
      run();
    } else {
      window.addEventListener('load', run, { once: true });
    }
  });
})(window);
