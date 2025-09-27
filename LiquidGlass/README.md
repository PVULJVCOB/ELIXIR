# iOS26 Liquid Glass Clone

Refraction-first "liquid glass" that bends the background with subtle chromatic aberration — not a simple blur. Built with the RealGlass library already present in this repo (see `realglass-effect/`).

## Files

- `liquidglass.html` — Demo page with scrollable background content and a fixed glass element.
- `ios-liquid-glass.css` — iOS26-inspired visuals: subtle chroma edge ring, inner glow, and pointer-follow highlight.

## How it works

- Uses RealGlass to capture the page and render a refractive pass over the glass element with parameters for IOR, thickness, frosting, and chromatic aberration.
- Elements marked with `data-realglass` are hidden until the initial capture finishes to avoid self-capture.
- A subtle static highlight accents curvature (no pointer-follow effect).

## Try it

Open `LiquidGlass/liquidglass.html` in a browser. Scroll the page; the glass should refract the content underneath and show a subtle chromatic edge.

If opened from file:// and the capture fails, serve locally due to security policies. Optional commands:

```bash
# macOS: run a quick server from the repo root
python3 -m http.server 8080
# Then visit
# http://localhost:8080/LiquidGlass/liquidglass.html
```

## Tuning

You can tweak options directly on the element in `liquidglass.html`:

```json
{
  "frosting": 0.15,
  "borderRadius": 24,
  "lightStrength": 2.4,
  "chromaticAberration": 1.05,
  "glassOpacity": 0.09,
  "lightX": 0.74,
  "lightY": 0.28,
  "edgeSmoothness": 2.0,
  "ior": 1.82,
  "specularShininess": 52,
  "thickness": 2.25,
  "tintColor": [0.95, 0.98, 1.0],
  "tintStrength": 0.06
}
```

- Increase `ior`/`thickness` for stronger bending.
- Increase `chromaticAberration` for more color fringing at the edge.
- Adjust `glassOpacity` and the CSS pseudo-elements for different material feels.

## Notes

- The RealGlass helper auto-recaptures on large scroll changes to keep the refraction accurate as you move through the page.
- Keep the glass element out of the initial capture; the helper already hides `.rg-hidden-until-ready` for you.
