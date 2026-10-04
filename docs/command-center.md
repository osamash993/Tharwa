# O.db Command Center

Open `?view=cc`; return to the previous interface with the back arrow or Display settings. The saved `view` setting and explicit URL override continue to work. The legacy interface remains available for comparison and acceptance.

The supplied visual reference is compiled into an isolated same-origin document under `public/command-center`. `public/legacy/command-bridge.js` adapts the existing calculation engine. The original `public/legacy/app.js` is unchanged: totals, FIFO, positions, look-through exposure, health, goals and zakat continue to use it. No account data, imported workbook, personal financial fixtures or secrets are included in these files.

Implemented surfaces: three-column dashboard with responsive mobile layout; portfolio and rebalance; market ranges and gold ounce quote; globe and location; health, diversification and scenarios; monthly transaction chart and ledger; goals; orbit, overlap network and heatmap; event radar; live display; asset/company/country/category/month/transaction/cash/zakat/settings dialogs; transaction preview and persisted buy/sell/cash/transfer/edit/archive/restore; currency, asset registry, fund composition, alerts, custom events, display settings and exports.

## Storage and synchronization

No tables, schema migrations or existing RPC signatures changed. Preferences use the existing settings map (`commandCenter`, `view`, and existing application keys). The deployed database stores a versioned portfolio document and has no Realtime publication. Therefore this implementation polls the authenticated `load_portfolio` RPC every six seconds while visible, adopting newer versions and rendering affected sections. This is version polling, not Postgres Realtime or row-level deltas. Writes retain existing compare-and-swap conflict protection. Optimistic writes roll back on failure; stale transaction editors are blocked.

## External data

The existing authenticated `portfolio-market` Edge Function adds history, news, company quotes, calendar and market status. It still validates the user's bearer token with `auth.getUser` before dispatch. FMP secrets stay server-side; exports and the new display omit private API settings. HTTPS fetches remain allowlisted, size-limited and timed out.

History: Yahoo daily close for one year, cached 12 hours. Component quotes/news: 15 minutes. Calendar: one day, with MSCI source cache of 30 days. Price refresh runs every minute while a tracked market is open and every 15 minutes when the returned market metadata says markets are closed; hidden documents pause refresh.

Live provider availability depends on authentication, upstream responses and subscription access. FMP earnings/economic calendars require the deployment secret and provider entitlement. MSCI can deny automated access. Dividend estimates require a sufficiently regular observed history and are labelled estimates. Missing sources remain unavailable; there are no generated price series, company changes, news or fixed calendar dates. News translation and AI/time-machine extensions have no provider configured and are not enabled.

Advanced legacy workflows remain reachable for comparison, including the full original zakat reports and advanced asset workflows. Original calculation semantics, including recorded movement totals and fees, are preserved. Existing records are not repriced simply by opening or editing their notes.

## Validation

- Original totals/categories/positions, health and zakat compared in browser.
- Demo-only buy, sell, edit, paired transfer, archive/restore, oversell validation and preview/post-save agreement.
- Desktop/tablet/mobile layouts at 1366, 820 and 390 CSS pixels; no horizontal page overflow.
- Main dialogs, analysis tabs, empty state, saved currency/location and authentication gate.
- Existing database ownership/CAS/isolation tests plus new polling and external-source contract tests.
- Build and classic-script syntax check. Owner-account writes are not used for QA.

## Rebuilding the reference

Run `python scripts/build-command-center.py /path/to/the-supplied-reference.html`, followed by `npm run build`. The compiler performs fail-fast literal replacements and emits script syntax checks. Override sources live in `scripts/cc`. Generated browser assets are committed so normal deployment does not require the private uploaded reference. Changes to the original calculation file should be reviewed separately.

## Interface refinement (2026-10-04)

- Settings use a responsive navigation rail and grouped asset cards. All registered types have show/hide, edit, and delete controls. Display hiding uses the existing `marketHidden` setting for stocks, gold, property, and cash; it never changes balances, financial totals, or account indices. Deleting a registry entry with existing transactions is blocked with an explanation and hide alternative; unused entries can be deleted. Other sources retain their existing inclusion semantics.
- Zakat has a summary, asset breakdown tab, and separate calculation settings. Missing metal prices are shown as an incomplete nisab calculation rather than a zero amount implying no liability. All amounts still come from the original engine, including debts entered in the selected base currency.
- Transaction entry keeps the prototype picker and form, with a clearer impact preview. Login uses the same dark/cyan design without changing the authentication flow.
- The price chart uses its actual SVG screen transform to locate the pointer. The floating tooltip shows the nearest trading day's closing price; transaction markers expose the recorded trade price/currency and quantity, and remain clickable and keyboard accessible.
- The header displays the oldest available quote timestamp (not a fabricated fresh time). Source timestamps, market status, and portfolio sync time are available under Data & Sources.
- Economic events now include official FOMC dates, BLS CPI/PPI/employment/JOLTS, and BEA GDP/PCE. The server requests official calendars daily. A bundled public schedule, verified on 2026-10-04, provides explicitly dated fallback events if a source blocks automated requests. The fallback contains only announced dates, not recurrence guesses; it expires naturally as dates pass. FMP remains optional for corporate earnings and additional country events.
- The calendar details show the source and why the event may matter; they do not predict market direction. Some official sites can block server fetches. Fallback provenance is visible on those events. Refreshing the screen does not imply each price is live or that a market is open.
