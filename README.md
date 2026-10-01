# EU2SAR

A clean, responsive EUR ↔ SAR currency converter built with vanilla HTML, CSS, and JavaScript.

## Features

- Convert in either direction by editing either amount.
- Swap the conversion direction instantly.
- Editable exchange rate, initialized to an indicative 1 EUR = 4.15 SAR.
- Optional reference-rate refresh using the Frankfurter API (`api.frankfurter.app`). If the service is unavailable, your current rate remains unchanged.
- Responsive layout and accessible labels.

## Run locally

Open `index.html` in a modern browser. The live-rate refresh needs an internet connection; the converter itself works offline with its current rate.

## Publish with GitHub Pages

The included GitHub Actions workflow publishes the site from the `main` branch on every push. In the repository, open **Settings → Pages** and ensure the source is set to **GitHub Actions** if it is not selected automatically. The Pages deployment URL will appear in the repository's **Actions** or **Settings → Pages** after the first successful deployment.

## Rate note

The initial rate is an editable indicative value, not a guaranteed market or bank quote. Refresh to request the latest available reference rate. Actual provider rates and fees may vary.
