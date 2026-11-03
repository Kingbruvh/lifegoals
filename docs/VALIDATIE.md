# Validatie van de conceptdemo

Gecontroleerd op 3 november 2026, op Windows met Microsoft Edge/Chromium.

- Productiebuild: `npm run build` geslaagd, inclusief TypeScriptcontrole.
- Losse TypeScriptcontrole: `npm run typecheck` geslaagd.
- Browseracceptatie: acht tests geslaagd voor workflows A–E, dubbele aanmelding, bewaren na herladen, synchronisatie tussen twee tabbladen, reset, diepe links, menu’s, dialoogsluiting en ontbreken van JavaScriptfouten in de desktopcontrole.
- Responsive controle: deelnemerhome, portfolio en coachaanwezigheid op 390 × 844. Geen horizontale paginaoverflow; aanwezigheid kan direct met aanraking worden bijgewerkt.
- Automatische toegankelijkheidscontrole: axe WCAG 2 A/AA en 2.1 AA op de beheerhome, mobiele deelnemerhome en mobiele coachhome. Geen gedetecteerde overtredingen na de contrastverbeteringen. Dit is geen volledige toegankelijkheidscertificering of handmatige screenreaderaudit.
- Visuele inspectie: welkom, desktopdashboard en mobiele deelnemer-/coachomgeving. Lokale fontlevering, kleine tekst, contrast en animatietiming zijn aangepast naar aanleiding van screenshots.
- QR: gegenereerd door de `qrcode`-bibliotheek vanuit de actuele aanmeld-URL; afbeeldingsweergave en navigatie via dezelfde URL zijn gecontroleerd. Geen fysieke telefoonscan uitgevoerd.

De tests gebruiken aparte browsercontexten, zodat presentatiedata in de geopende preview behouden blijft. Testcode staat in `tests/`; het HTML-rapport in `playwright-report/` wordt lokaal gegenereerd en niet gepubliceerd.

Vercel is voorbereid, maar een publieke Vercel-deployment is niet uitgevoerd omdat in de sessie geen Vercel-accountverbinding beschikbaar is. Zie README voor de importstappen.
