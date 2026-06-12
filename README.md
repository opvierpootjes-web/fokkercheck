# Fokker check · Op Vier Pootjes

## Lokaal starten (voor testen)

1. Pak de zip uit
2. Open de map in je terminal (of in Claude Code)
3. Voer uit:

```
npm install
npm run dev
```

4. Open http://localhost:5173 in je browser

---

## Live zetten via Netlify (makkelijkste optie)

1. Bouw de tool:
```
npm run build
```

2. Ga naar https://app.netlify.com/drop
3. Sleep de map `/dist` naar het scherm
4. Je krijgt direct een werkende URL (bijv. https://iets-iets-12345.netlify.app)
5. Via Netlify kun je daarna een eigen domein koppelen (bijv. fokkercheck.opvierpootjes.nl)

---

## Live zetten via je eigen hosting (Cloud86)

1. Bouw de tool:
```
npm run build
```

2. Upload de inhoud van de `/dist` map via FTP of het bestandsbeheer van Cloud86
   naar een map op je server, bijv. `/public_html/fokkercheck/`

3. De tool is bereikbaar op bijv. https://opvierpootjes.nl/fokkercheck/

---

## Vragen aanpassen

Alle vragen staan in `src/App.jsx` bovenaan het bestand, in het blok `const THEMES = [...]`.

Per vraag kun je aanpassen:
- `text` – de vraag die de gebruiker ziet
- `goodAnswer` – 'ja' of 'nee' (het antwoord dat geen signaal geeft)
- `weight` – 'hard' (rode vlag) of 'soft' (aandachtspunt)
- `flagText` – de uitleg bij een slecht antwoord
- `follow` – de vervolgvraag in de accordion

Na elke aanpassing: sla op, de browser ververst automatisch (bij `npm run dev`).
