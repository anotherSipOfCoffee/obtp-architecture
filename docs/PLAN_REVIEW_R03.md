# Architecture plan review R03 — 2026-09-24

24 planning selections: 3 bedroom counts × 2 office options × 2 size levels × 2 bathroom options. Fixed 7.60 m external width, two full storeys, gable-roof brief. Length and areas come from the v2 planning models, not from the legacy 3D catalogue.

Only B3-O1-C-F1 contains the user-edited R03 bathrooms. The other 23 PDFs retain v2 geometry. Wall thicknesses are provisional: the uploaded CAD wall bands indicate boundaries and door positions, not approved construction. Bathroom operating clearances and the upper washer require review. None of the complete houses has final architectural approval.

## Implementation boundary

All pre-existing inline scripts and embedded model data in dist/index.html are retained byte-for-byte. Existing exterior/Inside views, cut geometry, camera, appearance, contrast, consent and legacy renderer are unchanged. The old room controls remain hidden/inert so their DOM dependencies continue to resolve. New planning state is independent. It updates the option controls, plan statistics, revision text, URL fragment and selected PDF only. The 3D stage is explicitly identified as an earlier reference.

24 monochrome PDFs each show ground and upper plans on an A3 landscape page. The R03 example uses the preserved CAD SVG; others use the v2 model renderer. Plans remain PDF-only in the web interface. CAD source is retained for future refinement, not offered as an approved construction package.

## Rebuild

Install Python reportlab and svglib; use Node.js. Run `python planning-source/build-pdfs.py`. Source models, renderer, R03 DXF and R03 SVG are stored in planning-source. Do not propagate R03 automatically to other variants until block compatibility and operating clearances have been reviewed.

## Next refinement

Refine the office batch, then bedrooms, living/kitchen, circulation and stairs. Reconcile changed dimensions across both floors and inspect every complete variant. Only after plan approval should the 3D model and cuts be regenerated.
