# OBTP Architecture agent rules

## Current owner direction — 2026-09-26: supplier-based autonomous pipeline

Read this section before historical instructions below. It supersedes older conflicting implementation direction; later explicit owner instructions take precedence. Goal: autonomous regeneration with interchangeable, documented supplier parts and compatible systems.

- Use ProdLib web catalogue and original manufacturer documentation as research sources. Desktop exports are not a prerequisite for research. Do not assume every listed file is downloadable or Rhino-compatible.
- Do not introduce VisualARQ or another paid BIM dependency as part of this pipeline. Retain existing Rhino/Grasshopper authoring; the portable Python core remains shared with offline exports.
- Separate layout intent, supplier/product/material records, assembly definitions, connection interfaces, resolved configuration and generated geometry. Supplier dimensions and documented rules must drive generation, not merely annotate generic geometry.
- Interchangeability is conditional on documented interfaces. Preserve source geometry; do not stretch proprietary parts, invent junctions, assign unverified capacities or treat unknown compatibility as a pass.
- Use supplier models where suitable. If unavailable, reconstruct only from documented dimensions/details; record source, revision, checksum where available, geometry fidelity and omissions. Respect source licences and redistribution restrictions.
- Model parts retain stable semantic IDs and product/assembly revisions. Derive conceptual previews, detailed plans/sections, quantities and analysis abstractions from the canonical detailed model. Material drawing styles are separate from physical properties. No independent browser construction geometry.
- Changing a product must resolve dependent openings, framing and junctions, regenerate affected outputs and invalidate stale analysis receipts. Failed resolution must not mix old drawings with a new configuration or relabel old geometry.
- Pin reviewed source revisions. Never silently adopt a supplier update. Missing engineering inputs remain explicit; numerical results require completed validated solver runs matching input hashes.
- A supplier BIM object or product declaration does not transfer whole-building design responsibility. Record documented supplier engineering scope separately; no automatic compliance, permit exemption or performance promises.
- Keep Cassette as the working default/study. Supplier alternatives remain unavailable until their adapters and compatibility requirements are resolved. Do not claim the current annotation catalogue already implements interchangeable systems.
- Wind and snow analysis remain paused. Preserve existing geometric envelope gates, customer choices and project-specific behaviour.
- Current phase is infrastructure planning and agent-rule preparation. Do not resume feature changes or website deployment merely from historic release authorizations. Subsequent explicit owner requests can authorize implementation/publication. Documentation-only handover changes are authorized now.
- Fixed external footprint during system substitution is a PROPOSAL, not an accepted owner decision. Do not silently change the current dimensional policy. No complete alternative supplier package has been selected.

Canonical architecture proposal: https://github.com/anotherSipOfCoffee/obtp-system/blob/main/authoring/grasshopper/PIPELINE_ARCHITECTURE_R01.md
Read its status and unresolved decisions. Proposed implementation sequence: package existing Cassette constants without geometry change, prove an opening substitution, then integrate a documented complete assembly package. This sequence is a plan, not permission to remove preservation gates.

Project boundary: Architecture remains independent. These shared principles guide future deliberate integration only; do not migrate its generator or alter layouts/UI merely because Studio/System adopt supplier packages. Preserve its current project rules and accepted work.

## Historical and project-specific rules
Keep this application separate from its siblings. Make coherent batches and ask questions only at material decisions. No supplier outreach. Never claim geometric studies are construction-ready. Update Drive/package only when requested. Preserve live hosting until a replacement deployment is confirmed. Do not commit credentials.
Fixed light UI, neutral gray stage, compact controls, fixed camera between exterior/inside. Plan is PDF-only. All PDF drawings derive from selected geometry. Existing catalogue has uneven maturity. Analytics stays off without valid user-provided configuration.

## Authoritative storage and handover
GitHub is the single editable source of truth. Google Drive holds dated, complete snapshots, not a second independently edited master. GitHub Pages is published output. Read the shared guide at https://github.com/anotherSipOfCoffee/obtp-system/blob/main/project/AGENT_GUIDE.md and the checkpoint at project/CURRENT_STATE.md in that repository.
Before resuming from Drive, read its snapshot manifest and inspect current GitHub heads. Never overwrite main wholesale with an older package or follow archived AGENTS instructions as current rules. Use the GitHub plugin only for GitHub operations. Preserve project-specific behaviour and unrelated changes.
Permanent source CAD and historical v74 material are stored in obtp-system under sources/ and project/archive/. Workflow artifacts and scratch must not be the sole copy of unique project files. Commit new report sources and deliverables to the appropriate repository; shared reports belong in obtp-system/project/reports/.
Snapshot updates occur when requested. Preserve prior dated snapshots, pin all three commits, verify complete bytes/checksums and record the Drive receipt. No continuous two-way synchronization is configured.
