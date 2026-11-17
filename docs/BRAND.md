# Bronnen en ontwerpkeuzes

Geraadpleegd op 3 november 2026:

- https://www.stichtinglifegoals.nl/
- https://lifegoalsamsterdam.nl/
- https://lifegoalsamsterdam.nl/opleidingen/
- https://www.stichtinglifegoals.nl/academie/monitoring/

## Brandbook 2024 (toegepast op 17 november 2026)

De huisstijl volgt het **LIFE GOALS – BRANDBOOK** (2024):

- **Palet:** Empowerment Ember **#D53B45**, Harmonious Unity Cream **#FAF8DB**, Halo **#FAFAFA**, Teamwork Charcoal **#252525** en Passion Orange **#D14C33**. Neutrale grijzen zijn afgeleid van Charcoal; lichte vlakken krijgen een Cream-tint. Voor kleine rode tekst op lichte achtergronden gebruiken we een iets diepere Ember (#C4303A) om WCAG AA-contrast te halen. Groen (#2A6F44) is alleen een statuskleur voor ‘aanwezig’ en ‘afgerond’.
- **Typografie:** Heebo voor lopende tekst; koppen in hoofdletters, heavy italic, regelhoogte ±80–90%. Het merklettertype **Druk** is commercieel gelicenseerd en wordt daarom niet meegeleverd. **Anton** (SIL OFL) is de vervanger, met een cursieve weergave. Met een Druk-webfontlicentie kan dit in `src/app/globals.css` (`--display`) worden vervangen.
- **Branding element “Nebula”:** de penseelstreek uit `assets/images/elements/life-goals-figure.svg` van de website staat als `public/nebula.svg`. Hij wordt via een CSS-masker in elke merkkleur getoond en draait langzaam in hero’s, kaarten en posters.
- **Pay-off:** “Never offside” en de drie G’s (Gemeenschap, Gezondheid, Groei) lopen als band onder het welkomstscherm.
- **Tone of voice:** uitnodigend, motiverend, met pit. Bestaande teksten zijn ongewijzigd.

De stijllaag staat apart in `src/app/brand.css` en wordt na `globals.css` geladen.

Het woordmerk komt uit `https://www.stichtinglifegoals.nl/wp-content/themes/lifegoals/assets/images/logo/life-goals.svg`. De lichte variant staat in de Charcoal-navigatie; een donkere variant wordt met een CSS-filter weergegeven. De foto komt uit `https://www.stichtinglifegoals.nl/wp-content/uploads/2024/08/hero-1-1920x1080.jpg` en wordt alleen gebruikt als algemene merk-/sportillustratie. Afgebeelde personen worden nergens gekoppeld aan fictieve namen of profielen. Rechten blijven bij de oorspronkelijke rechthebbenden; de publieke beschikbaarheid is geen algemene hergebruiklicentie. Controleer publicatierechten voor gebruik buiten deze stakeholderconceptdemo.

De lettertypen Heebo en Anton komen van Google Fonts en worden lokaal geladen (`public/heebo.woff2`, `public/anton.woff2`). De SIL Open Font Licenses staan in `public/HEEBO-LICENSE.txt` en `public/ANTON-LICENSE.txt`.

Terminologie zoals MDT Set Your Life Goals, Maatschappelijk Sportcoach, Life Goals Academie en Life Goals Events sluit aan bij de officiële sites. Alle overige opleidingsbeschrijvingen, locaties, planning, namen, opdrachten en monitoringrecords zijn eigen fictieve voorbeeldinhoud. Er worden geen werkelijke Life Goals prestatiecijfers gebruikt.

Ontwerp: een Charcoal-navigatie met Ember-accenten; Halo als werkvlak; Charcoal-, Ember- en Cream-vlakken met de Nebula voor hero’s, opleidingen en events; zichtbare focusstijlen; native selecties en dialogen. Beweging: gefaseerde binnenkomst, oplopende kerncijfers, vullende voortgangsbalken, hover-lift op kaarten en een langzaam draaiende Nebula. Bij `prefers-reduced-motion` staat alle animatie uit. De sportfoto ondersteunt het menselijke verhaal; initialen voorkomen dat echte portretten als fictieve deelnemers worden voorgesteld.
