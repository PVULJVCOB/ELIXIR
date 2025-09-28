Audit: Doppelte und ungenutzte Klassen/Funktionen

Stand: 28.09.2025

Überblick

- Projektstruktur: index.html, js/navbar.js, js/siderun.js, styles/\*.css
- Ziel: Auflistung von doppelten Definitionen sowie ungenutzten CSS-Klassen und JS-Funktionen inkl. Fundstellen.

Zusammenfassung (nach Bereinigung)

- JS-Funktionen: Keine doppelten Namen. Tote Referenzen entfernt (#glassCard, #srButton-Inline-Code).
- CSS-Klassen: Unbenutzte Selektoren entfernt (.logo, .buy-block*, .flying-border*, .glass-card\* in navbar.css; .sr-button in main.css). Duplikat-Selektor konsolidiert.
- Fehlende Datei entfernt: Verweis auf ./js/liquid.js aus index.html entfernt.
- Responsive/Media-Einstellungen vorerst entfernt (Fokus: einheitlicher Vollbild/Desktop-Modus). Spezifisch: @media (max-width: 768px) aus styles/navbar.css gelöscht.
- Verbesserungen:
  - Klassenbasierte Menü-Steuerung (.is-open) statt inline styles; Overlay + Body-Scroll-Lock.
  - Fokus-Management (Focus Trap, ESC schließt, Fokus wird nach dem Schließen zurückgegeben).
  - SideRun: prefers-reduced-motion berücksichtigt (minimierte Bewegung), Pointer-Move gedrosselt über rAF.

JavaScript

1. js/navbar.js
   Deklarationen
   - function openMenu() (Zeile ~23)
   - function closeMenu() (Zeile ~35)
   - function toggleMenu() (Zeile ~44)
   - function onKeyDown(e) (Zeile ~48)
   - const measureLinksWidth = () => (Zeile ~67)
   - const expand = () => (Zeile ~76)
   - const scheduleCollapse = () => (Zeile ~81)

   Hinweise/Verwendung
   - Alle oben genannten Funktionen werden im selben Modul verwendet (Event-Handler/Helper). Keine offensichtlichen Duplikate.
     - Behoben: Referenz auf nicht existierendes DOM-Element (#glassCard) entfernt; zugehörige Initialisierung in js/navbar.js gelöscht.

2. js/siderun.js
   Deklarationen
   - function init(hostEl, options = {}) (Zeile ~8)
   - Diverse lokale Helper (clamp, mix) und Closures innerhalb init
   - Globaler Export: window.SideRun = { init } (Zeile ~276)

   Hinweise/Verwendung
   - init wird aus index.html (inline) und aus js/navbar.js verwendet. Keine doppelten Funktionsnamen zwischen Dateien.

CSS
A) styles/main.css
Selektoren (Auszug) - #srContainer, #srContainer .glass-card_content, #srContainer .D5, #srContainer .D8 - .sr-container, .sr-button, .sr-button:hover, .sr-button .nav_stroke.siderun, .sr-button > :not(.nav_stroke)

    Nutzung
    - index.html nutzt: #srContainer, .sr-container, .glass-card_content (als Kind), .nav_stroke.siderun
    - Nicht genutzt in HTML: .sr-button (kommt im Markup nicht vor). Keine JS-Referenzen auf .sr-button. -> Kandidat: ungenutzt

B) styles/navbar.css
Selektoren (Auszug, alle mit ".siderun" suffixed außer Utilities) - .logo.siderun – Nicht im HTML vorhanden -> ungenutzt - .nav.siderun, .nav_links.siderun, .nav_link.siderun, .nav_button.siderun – verwendet in index.html - #leftCta.nav_button-left.siderun – verwendet in index.html - .mobile-nav.siderun, .menu-prompt.siderun, .menu-prompt_icon.siderun, .click-catch.siderun, .mobile-menu.siderun, .mobile-menu_links.siderun, .mobile-menu_link.siderun – verwendet in index.html - .buy-block.siderun, .buy-block_left.siderun, .buy-block_cta.siderun – nicht vorhanden im HTML -> ungenutzt - .flying-border*, .fb-* – alte Namensvariante der SideRun-Border; wird nicht im HTML/JS verwendet -> ungenutzt (Nachfolger in styles/siderun.css) - .glass-card.siderun, .glass-card_content, .glass-card .nav_button.siderun – HTML enthält keine .glass-card Instanz; index.html nutzt stattdessen <section id="srContainer" class="sr-container glass-bg">. -> derzeit ungenutzt
Duplikate - Selektor-Gruppe ".nav.siderun:hover .nav_links.siderun" kommt doppelt vor (Zeilen ~82 und ~203). Inhalt identisch. -> Duplikat entfernen empfohlen.

C) styles/siderun.css
Selektoren - .siderun-border \* und .sr-backdrop
Nutzung - Diese Klassen werden dynamisch von js/siderun.js erzeugt (SVG und Blur-Layer). Kein direkter HTML-Verweis, aber zur Laufzeit genutzt. -> verwendet.

HTML: index.html - Behoben: Inline-Referenz auf #srButton entfernt; `SideRun.init` nur noch für vorhandene Elemente. - Behoben: Script-Tag für fehlendes ./js/liquid.js entfernt.

Konkrete Funde (mit Pfad und Zeilenbereich)

- Unbenutzte CSS-Selektoren (entfernt)
  1.  styles/main.css: .sr-button
  2.  styles/navbar.css: .logo.siderun; .buy-block.siderun, .buy-block_left.siderun, .buy-block_cta.siderun; .flying-border*; .glass-card* und Unterelemente

- Doppelte CSS-Definitionen
  - Behoben: styles/navbar.css enthielt ".nav.siderun:hover .nav_links.siderun" doppelt – eine Definition entfernt.

- JavaScript Unstimmigkeiten/ungenutzt (behoben)
  - js/navbar.js: #glassCard-Referenz + Init entfernt
  - index.html (inline): #srButton-Referenz entfernt
  - index.html: Verweis auf fehlendes js/liquid.js entfernt

Empfehlungen

1. Entfernen oder Nachziehen unbenutzter CSS-Selektoren in navbar.css und main.css (siehe Liste oben). Alternativ: in README belassen, falls in zukünftigen Seiten vorgesehen.
2. Duplikat-Selektor in navbar.css konsolidieren.
3. JS/HTML angleichen:
   - Entweder #glassCard im HTML ergänzen oder den Codezweig in js/navbar.js entfernen.
   - Entweder #srButton im HTML ergänzen oder den Inline-Init-Aufruf entfernen.
   - Entweder js/liquid.js hinzufügen (falls benötigt) oder den Script-Tag entfernen.

Hinweis zur Genauigkeit
Die Analyse basiert auf statischer Quellcode-Suche in diesem Repository-Stand. Dynamisch generierte Klassen/IDs außerhalb der SideRun-Injektionen wurden nicht gefunden. Bei späterer Template-Erweiterung bitte erneut scannen.

## Keyboard & Focus (Menu)

- Toggle: Space/Enter on the burger button opens/closes the menu.
- ESC closes the menu and returns focus to the previously focused trigger.
- Tab is trapped inside the menu while open (Shift+Tab cycles backwards).
- Overlay click closes the menu.
- Body scroll is disabled while the menu is open.

Accessibility attributes during open state:

- menu button: `aria-expanded="true"`
- dialog panel: `role="dialog" aria-modal="true" aria-hidden="false"`

## Tooling

Format code:

- npm run format

Lint CSS:

- npm run lint:css
- npm run lint:css:fix

Configs: `.prettierrc`, `.stylelintrc.json`. Lockfiles are ignored in `.prettierignore`.
