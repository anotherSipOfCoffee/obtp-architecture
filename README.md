## Plan review update — 24 September 2026

The live configurator now offers 24 two-storey planning options and monochrome PDF plans. Only B3-O1-C-F1 includes the user-edited R03 bathrooms; all options remain drafts. The existing 3D model and Inside/cut view remain unchanged and independent of the new plan selection. See [implementation and refinement notes](docs/PLAN_REVIEW_R03.md).

Browser verification: all 24 selections and PDF responses, selected download filename, URL restoration, mobile overflow, and exact canvas-image equality against the prior exterior and Inside views. Original inline scripts and model data are unchanged. PDF IDs and rendered examples were checked.

---

# OBTP Architecture

Independent repository for the Architecture project. Website files are in `dist/`.
Static HTML/CSS/JavaScript; no build or server required.

## GitHub Pages
The deployment workflow in `.github/workflows/pages.yml` publishes `dist/` on pushes to `main` or a manual workflow run. No build step is required.

One-time setup: in repository Settings → Pages → Build and deployment, select **GitHub Actions** as the source. Then run **Deploy GitHub Pages** from Actions, or re-run the initial failed run. The connected plugin cannot change the Pages source setting.

## Status
Imported from OBTP Project System v74 into this public GitHub repository with owner approval. Website files are in dist/. GitHub Pages deployment workflow is committed. A successful deployment has not yet been verified. GitHub Pages is the selected hosting target.

