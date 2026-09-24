# R04 main-bedroom dressing pockets — 24 September 2026

All 24 review models and PDFs now adapt the approved OBTP Master Wardrobe Study R01. This is draft integration, not completed architectural validation. Four repeated main-bedroom sizes remain within their original boundaries. Width, length, bedroom counts, offices, bathrooms and all other room geometry are unchanged. Existing 3D and Inside/cut scripts and model data are unchanged.

## Applied geometry

Pocket 1500 mm wide: 600 mm storage depth + 900 mm aisle. Partition allowance 150 mm; pocket opening 900 mm. Bed envelope 2100 × 1800 mm, east head, two bedside tables. These are OBTP study assumptions, not dimensions copied from professional precedents or certified standards.

| Family | Count | Sleeping zone | Pocket | Foot gap |
|---|---:|---|---|---:|
| 1 bedroom | 8 | 3600 × 3100 mm, 11.16 m² | 4.65 m² | 1500 mm |
| 2 bedrooms | 8 | 2850 × 3100 mm, 8.84 m² | 4.65 m² | 750 mm |
| 3 bedrooms compact | 4 | 2950 × 3550 mm, 10.47 m² | 5.33 m² | 850 mm |
| 3 bedrooms generous | 4 | 4150 × 3550 mm, 14.73 m² | 5.33 m² | 2050 mm |

One/two-bedroom entries shift along the existing hall-facing wall, with an opening shown pending door hardware selection. Three-bedroom entries retain the existing side door; the lower 1200 mm of the storage run is omitted to preserve the entry sweep. Its pocket opening shifts to local y1200–2100. No bathroom access is created through the bedroom.

## Outstanding manual review

- Two-bedroom sleeping zone is tight: 8.84 m² excluding pocket. No compliance or comfort approval is claimed.
- Existing windows retained provisionally. One/two-bedroom south windows straddle the new partition: resize/reposition after manual review; this integration does not resolve facade coordination.
- Bedroom desks removed; their reintroduction is not demonstrated. The separate office option is unchanged.
- One-bedroom separate dressing/storage room retained; duplication needs a whole-house decision.
- Door hardware, operating clearances, daylight, ventilation, structure, construction wall thicknesses and complete house circulation require review.
- User bathroom CAD blocks remain only in B3-O1-C-F1. They are preserved in its R04 DXF and PDF.
- Earlier main-bedroom use/operation targets removed so they cannot be presented as current validation.

## Provenance and rebuild

Concept study informed by professional plans for Trivselhus Villa Söderhamn (https://www.trivselhus.se/husmodeller/villa-soderhamn/) and Villa Vindö, with Nathalie Eldan Chaptal as a secondary partition precedent. R01 study dimensions are an OBTP adaptation, not traced prototype dimensions.

`models.json.gz` is the R04 review source. `apply-pockets.py` records the one-time R03→R04 transformation and rejects already-updated data. Run `build-pocket-cad.py` (requires ezdxf, shapely) then `build-pdfs.py` (Node, reportlab, svglib) to rebuild. R03 compressed CAD retained for bathroom block provenance.

Validation: all 24 option selections/PDF responses, selected download filename, URL restoration and mobile width checked. Exterior and Inside canvas pixels matched the pre-update baseline. Furniture containment and pairwise non-overlap checked for all new pocket blocks; this is not a complete functional or regulatory check. Representative PDFs rendered for visual review.
