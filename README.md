# Juab County Water Supply Plan — Community Water Values Site

A public-facing website concept for the **Public Involvement** component of the Juab County
Water Supply Plan. It reports survey results in aggregate (modeled on the Envision Utah
*Water Values Study*) and routes water users to the right survey — a public one for residents,
and an invite-model one for priority groups like irrigation companies and large agricultural users.

**This is a draft demonstration** to share with the project team (PM: Devan Shields, Sunrise
Engineering). It is not wired to live surveys or real data yet.

---

## What's here

| File | Purpose |
|------|---------|
| `index.html` | The full single-page site (hero, values, results dashboard, supply story, participate) |
| `styles.css` | All styling. Palette grounded in the Juab Valley — reservoir blue, canal teal, dry sage, wheat gold |
| `app.js` | Animations, count-ups, and results loading. No build step, no dependencies |
| `data/results.json` | The **only file you edit to publish new numbers**. Placeholders show until real data is added |

## Design intent

- **Values first.** The narrative follows the PIP: understand *why* people value water, not just what they prefer.
- **Privacy by design.** Results show in aggregate only. Priority-group responses (irrigation, large ag) are combined before display.
- **Two survey paths.** A public ESRI Survey123 instrument, and an invite/magic-link model for targeted groups whose surveys are not web-published.
- **Reporting, not collection.** Like Envision Utah, the site primarily *reports* results; the actual data collection happens in Survey123 or on paper.

## How to publish results

Edit `data/results.json`. No code changes needed:

```json
{
  "stats": [842, 6, 9],
  "concerns": [
    { "label": "Growth outpacing supply", "value": 71 },
    { "label": "Loss of local farms", "value": 63 }
  ],
  "growth": { "welcome": 34, "cautious": 52, "oppose": 14 }
}
```

- `stats` — the three top cards: `[responses, groups engaged, events attended]`
- `concerns` / `segments` — bar lists; `value` is a percent (0–100)
- `growth` — donut chart percentages; should sum to 100

If the file is missing or empty, the site gracefully shows "awaiting data" placeholders.

## Wiring the surveys

In `app.js`, find the `urls` object and drop in the real links:

```js
const urls = {
  public: "https://survey123.arcgis.com/share/YOUR_PUBLIC_ID",
  invite: "" // handled by email magic-link
};
```

## Publishing with GitHub Pages

1. Create a new repository (e.g. `juab-water-values`) and push these files.
2. In **Settings → Pages**, set the source to the `main` branch, root folder.
3. The site goes live at `https://<user>.github.io/juab-water-values/`.
4. A custom domain (e.g. `juabwater.org`) can be added later under the same Pages settings.

## Notes for the team

- Fonts load from Google Fonts; no other external dependencies.
- Fully responsive down to mobile, keyboard-accessible, and respects reduced-motion.
- Everything is static — safe to host anywhere, easy for anyone to maintain.
- Replace the demonstration copy and the 8,000 acre-feet / 2032 / 75-year figures if any change.

---

*Public involvement led by Sunrise Engineering for the Central Utah Water Conservancy District,
in partnership with Jones & DeMille Engineering.*
