# Command Center — phase 0 (2026-10-04)

Stable pre-migration source: commit `cb63c91d04c2aef00d670a780118eb0eb7b4d89b`.
Git history retains the complete published version. The patch also creates a dated
local source backup before making any replacement (`.migration-backups/`).

Scope: independent empty `#cc-root`, URL `?view=cc` / `?view=legacy`, menu entry,
return control and preference using the existing `saveSetting('view', ...)` API.
No new database tables, RPCs, formulas, market sources or prototype data.
The preference is saved when the user presses either switch. URL overrides apply
to the current visit and do not silently write to the database. Demo mode remains
unsaved. Default stays legacy until a user chooses otherwise.

Apply the exact-literal patch once with `python scripts/patch-cc-phase0.py`.
It stops on missing/ambiguous targets and runs `node --check` after patching.
The accompanying `src/command-view.js` and `.css` are independent new files.

User acceptance before phase 1:
- Open the existing app and confirm its usual numbers and pages.
- From the three-dot menu choose Command Center. Expect a deliberately empty
  preparation screen, not the full prototype.
- Return using the visible button; confirm the existing page and values remain.
- Choose a view, reopen the normal app URL, and confirm the preference is retained
  in a signed-in session. Demo mode intentionally does not persist.
- Check switching at desktop width and 390px, with no horizontal overflow.

Remaining checklist items (globe, live screen, new modals, market data and realtime)
belong to later phases and are not claimed as implemented or tested here.
The migration brief assumes separate data tables; the deployed implementation
currently uses a portfolio JSONB row. Resolve that mapping before phase 11 without
silently changing the schema. The current repository is a Vite app plus a legacy
script, not the standalone v193 file named in the brief.
