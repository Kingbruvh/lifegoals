# Life Goals Hub

Een werkende, verbonden conceptdemo voor Stichting Life Goals. **Alle gegevens zijn fictief.** Gebouwd met Next.js App Router, TypeScript, Tailwind CSS, Lucide, Motion, Recharts en een lokale, getypeerde store.

## Starten

Vereist: Node.js 22 of nieuwer en npm.

```powershell
cd "C:\Users\isase\Documents\ChatGPT\ISA 2\life-goals-hub"
npm ci
npm run dev
```

Open http://localhost:3100. Voor een productiepreview:

```powershell
npm run build
npm run start
```

Gebruik één previewproces tegelijk op poort 3100. Er zijn geen omgevingsvariabelen, database, account of API-sleutels nodig. De bestaande projecten in de bovenliggende map zijn niet gewijzigd.

## Wat werkt

- Welkomstscherm met vijf persona’s; rolwisseling blijft altijd bereikbaar.
- Landelijk overzicht en een Amsterdamse coördinatoromgeving.
- Deelnemers zoeken en filteren, meerdere rollen binnen één identiteit, gekoppelde profielen en een tijdlijn.
- Opleidingen aanmaken met programma, regio, data, trainer, capaciteit, locatie, beschrijving en optionele WhatsApp-uitnodigingslink.
- Werkelijke aanmeld-URL en lokaal gegenereerde QR-code. Aanmelding van bestaande of nieuwe fictieve deelnemers, controle op dubbele inschrijving en capaciteit.
- Opleideromgeving met toegewezen opleidingen, roster, inschrijfstatus, voortgangsmatrix en bewerkbare checklists.
- Mobiele coachomgeving met sessiekeuze, zoeken en aanwezig/afwezig/wissen per deelnemer.
- Mijn Life Goals met activiteiten, opleidingen, portfolio, generieke opdracht, voorbeelddocument en persoonlijke tijdlijn.
- Events: deelnemen en aanmelden als vrijwilliger vanuit de deelnemer- en coachomgeving, met directe zichtbaarheid in beheer.
- Nationale en regionale Monitor, berekend vanuit deelnemers, inschrijvingen en aanwezigheidsregistraties.
- localStorage-persistentie, synchronisatie tussen tabbladen van dezelfde origin en herstel van de volledige beginstand.

## Bewust gesimuleerd

Dit is geen productieapplicatie. Rollen zijn een presentatiesimulatie, geen authenticatie of beveiligingsgrens. Alle 36 deelnemers, zes coaches (ook deelnemers) en drie opleiders zijn fictief. De demoplanning staat op 3 november 2026; vijf opleidingen, negen wekelijkse activiteiten en drie events verbinden Amsterdam, Utrecht en Rotterdam.

Kantar T0/T1, Verian/MDT, ondertekening en startdocumenten zijn uitsluitend checkliststatussen. De drie opleidingsbijeenkomsten zijn generieke planningsvoorbeelden. Er is geen vragenlijstverzending, ondertekening, e-mail, bericht, echte dossierupload, WhatsApp-integratie of subsidie-export. Het document in het portfolio is een generieke tekstvoorbeeldopdracht. De impactkaart toont expliciet fictieve monitoringrecords en bevat geen causale effectclaim.

Gegevens staan alleen in deze browser onder `life-goals-demo-v1`. Gebruik fictieve namen en e-mailadressen op `@example.invalid`. Nieuw aangemaakte opleidingen en wijzigingen worden **niet tussen apparaten of verschillende origins gedeeld**. Een QR-code is geldig, maar op een ander apparaat bestaan alleen de oorspronkelijke opleidingen. Demonstreer nieuwe opleidingen daarom in hetzelfde browserprofiel. `localhost` en `127.0.0.1` zijn verschillende origins: kies één adres voor de hele presentatie.

De huidige opslag is bedoeld voor één presenter, niet voor gelijktijdige samenwerking. Bij schrijven in meerdere tabbladen tegelijk geldt de laatst opgeslagen versie. Beschikbaarheid voor vrijwilligerswerk is een fictieve eigenschap in de dataset. Toekomstideeën vormen geen toezegging over de eerste ontwikkelfase.

## Architectuur

- `src/lib/model.ts`: getypeerde entiteiten en afgeleide tellingen.
- `src/lib/seed.ts`: deterministische, verbonden begindataset.
- `src/lib/store.tsx`: opslagadapter en centrale mutaties; UI-componenten veranderen de dataset nooit rechtstreeks.
- `src/components/`: herbruikbare onderdelen en taakgerichte schermen.
- `src/app/[[...slug]]/page.tsx`: App Router-ingang; ondersteunt diepe links en herladen, ook voor lokaal aangemaakte opleidingen.
- `src/app/globals.css`: responsive ontwerp, font, focusstijlen en reduced-motion ondersteuning.

Een toekomstige backend kan de centrale store-operaties vervangen. Echte autorisatie, multi-user transacties, servervalidatie, privacy-afspraken en integraties zijn nog afzonderlijk te ontwerpen.

## Controleren

```powershell
npm run typecheck
npm run build
# Start de productiepreview in een tweede terminal:
npm run start
# Voer daarna de browsertests uit:
npm test
```

De Playwright-configuratie gebruikt de aanwezige Microsoft Edge-browser. Op een andere machine: installeer Edge of verwijder `launchOptions.channel` in `playwright.config.ts` en voer `npx playwright install chromium` uit. De tests gebruiken een apart browserprofiel en wijzigen de presentatiedata niet.

De suite toetst workflows A–E, dubbele aanmelding, persistentie, tabbladsynchronisatie, reset, diepe links, mobiele breedtes, menu’s, dialogen en belangrijke toegankelijkheidsregels. Screenshots en eventuele fouttraces verschijnen in `test-results/`.

## Vercel

Deze zelfstandige map is de projectroot. Next.js gebruikt standaard Vercel-detectie; geen aangepaste rewrite of databaseconfiguratie is nodig.

1. Importeer de GitHub-repository in Vercel met **Add New → Project**.
2. Kies **Next.js**, Node.js **22.x** en de root van deze repository. Als je de bovenliggende workspace uploadt, kies dan **Root Directory: `life-goals-hub`**.
3. Install: `npm ci`. Build: `npm run build`. Laat Output Directory op de Next.js-standaard staan.
4. Voeg geen environment variables toe. Kies **Deploy**.
5. Open de gegenereerde HTTPS-URL en kies een persona. Alle nieuwe lokale aanmeldlinks en QR-codes gebruiken automatisch die origin.

Alternatief, vanuit de projectmap met een eigen Vercel-login:

```powershell
npx vercel login
npx vercel --prod
```

Er is in deze sessie geen Vercel-login aangetroffen; de productiebuild is wel lokaal geverifieerd. Publiceer geen echt deelnemersbestand in deze demo.

Zie [de 15-minutenpresentatie](docs/PRESENTATIEROUTE.md) en [bron- en ontwerpnotities](docs/BRAND.md).
