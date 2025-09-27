Du bist ein erfahrener Frontend-Engineer mit tiefem Verständnis für moderne UI-Effekte.
Aufgabe: Entwickle eine eigene, saubere und dokumentierte Implementierung eines Glass-/Liquid-Effekts, der an iOS 26 Liquid Design angelehnt ist – aber nicht das klassische „Blur-Glass“, sondern das echte Lichtbrechungs-Design.
Ziel:
Erstelle eine neue Variante namens BreakView.
Der Effekt muss Licht brechen, Text sauber rendern und darf sich beim Zoomen mit dem Touchpad nicht verschieben oder neu laden.
Es soll sich um eine stabile Lösung handeln, die unabhängig von Re-Renders des Hintergrunds funktioniert.
Struktur:
Erstelle einen neuen Ordner im Projekt, in dem der gesamte Code liegt.
Dokumentiere den kompletten Code mit Kommentaren (Schritt für Schritt).
Verwende Best Practices für CSS-Variablen und moderne Browserkompatibilität.
Füge eine :root-Option ein, um die Objektgrößen global anzupassen.
Spezielle Anforderungen:
SideRun-Effekt:
Container sollen automatisch den „Flying Border“-Effekt haben.
Diesen Effekt nennst du SideRun.
Alle Funktionen, Variablen und Klassen müssen konsequent zu diesem Namensschema passen.
Hauptklassen (auf Basis von BreakView):
.navbar → macht eine flüssige Glas-Navigationsleiste
.glasscard → erstellt eine Glas-Card mit BreakView + SideRun
.btn → erstellt einen Button mit dem Effekt
Nutzung per <div class="navbar">, <div class="btn"> oder <div class="glasscard">
Ergebnis:
Eine sofort nutzbare, wartbare Codebasis mit eigener Ordnerstruktur.
Keine externe Abhängigkeit von JavaScript-Frameworks baue deine eigene.
Der Effekt muss „award-winning“ aussehen und sich an Apples Liquid-Design-Philosophie orientieren, aber eigenständig (kein 1:1-Klon).

alles zur flying border und den runnern findest du in dem ELEXIR ordner unter navbar.css navbar.js und index-navbar.html

im real glass kannst du sehen wie es ungefähr funktionieren könnte die variante ist aber nicht gut genug passe das also an und baue deine eigene version die eigenständig perfekt funktioniert

suche erst nach lösungen bau dir eine todo und google wenn du nicht weiter weißt 
bleib proofessionell benutze best practice und halizuniere nicht