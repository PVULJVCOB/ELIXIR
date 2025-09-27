# RealGlass Effekt – Reusable Helper

Dieser Ordner enthält einen kleinen Helper, mit dem du den RealGlass-Effekt schnell
und zuverlässig auf beliebige Elemente anwenden kannst (Copy & Paste tauglich).

## Inhalt

- `realglass-helper.js` – Manager, der init (Screenshot) genau einmal ausführt, Ziele
  bis dahin versteckt und dann den Effekt anwendet.
- `styles.css` – Basistyle inkl. `.rg-hidden-until-ready` und Demo-Styles.
- `template.html` – Demo-Seite mit fixer Glas-Karte über scrollbarem Inhalt.

## Quickstart (Copy & Paste)

1) Binde die Bibliothek und den Helper ein (Reihenfolge beachten):

```html
<link rel="stylesheet" href="./styles.css" />
<script src="https://cdn.jsdelivr.net/npm/realglass/RealGlass.standalone.js"></script>
<script defer src="./realglass-helper.js"></script>
```

2) Markiere dein Ziel-Element mit `data-realglass` und optionalen Optionen in JSON:

```html
<div class="deine-card" data-realglass data-realglass-options='{"frosting":0.25, "borderRadius":16}'></div>
```

Das Element bleibt unsichtbar, bis der Screenshot erstellt wurde; erst dann wird der Effekt angewendet
und das Element sichtbar gemacht. So landet es nicht im Screenshot und bricht den darunterliegenden Inhalt richtig.

3) Alternativ: Programmgesteuert anwenden

```html
<script>
  document.addEventListener('DOMContentLoaded', async () => {
    const el = document.querySelector('.deine-card');
    await RealGlassManager.applyTo(el, { frosting: 0.3, borderRadius: 20 });
  });
</script>
```

## Optionen

Du kannst alle RealGlass-Parameter in `data-realglass-options` setzen. Beispiele:

- `frosting` – Blur (0..1)
- `chromaticAberration` – Farbsäume
- `glassOpacity` – Opazität des Glaslayers
- `lightStrength` – Lichtintensität
- `lightX`, `lightY` – Normierte Lichtposition
- `edgeSmoothness` – weichere Kanten
- `ior` – Brechungsindex (größer = stärkere Brechung)
- `borderRadius` – Eckenradius in Pixeln
- `specularShininess` – Größe/Intensität Highlights
- `thickness` – simulierte Glasdicke (mehr Brechung)
- `tintColor`, `tintStrength` – Tönung
- `useMask`, `maskImage`, `maskElement`, `maskSmoothing`

## Demo starten

Öffne `template.html` im Browser. Du siehst eine fixe Glas-Card in der Mitte.
Scrolle: Der gesamte Text und Content darunter wird gebrochen. Die Karte erscheint erst,
nachdem der Screenshot erstellt wurde.

## Hinweise

- Stelle sicher, dass das Ziel-Element (z. B. Card) eine Größe besitzt (Breite/Höhe),
  bevor du den Effekt anwendest.
- Der Helper blendet Elemente mit `.rg-hidden-until-ready` aus. Wenn du eine Fade-Animation
  möchtest, füge `.rg-fade-in` hinzu (die CSS-Datei enthält einen Opacity-Transition).
- Willst du mehrere Elemente anwenden, füge einfach `data-realglass` zu jedem hinzu –
  der Helper reuse’t den Screenshot und arbeitet sie nacheinander ab.
