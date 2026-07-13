# Projects Blog Employer Review

## Main Gap

The Projects section needs to read less like notes and more like employer-facing case studies. Right now it shows that real projects exist, but it does not quickly answer: what problem was solved, what was personally owned, how hard it was, what evidence proves it works, and why an employer should care.

## What Is Missing

Add these to each project note:

- Project links: GitHub repo, demo/wiki, release/download, screenshots/video links near the top.
- Role and ownership: "Designed and implemented X," especially if work was professional or collaborative.
- Outcome and evidence: measurable or concrete proof, such as parsed SQLite DWARF data, generated BPF scripts, processed Arabic PDFs, async job queue behavior, released CSP app, or similar.
- Technical architecture: short sections for data flow, major components, and important libraries.
- Hard engineering decisions: why LLVM/DWARF, why Qt5/C++17, why Lua/CSP telemetry, and what tradeoffs were made.
- Failure modes and constraints: unsupported binaries, OCR accuracy limits, GPU VRAM limits, simulator telemetry limitations.
- Polish signals: install/run instructions, status, roadmap, and test/validation notes.

## Project-Specific Refinement

### Sigminer

`Blog/Projects/Sigminer.md` is the strongest employer project. It has the most serious engineering signal: ELF, DWARF, LLVM, C ABI, BPF tooling, and production-adjacent observability work.

Lead with this project. Add a "What it demonstrates" section covering systems programming, binary introspection, API design, observability tooling, and production-adjacent problem solving. Also add a code/API example showing input and output.

### OCR-App

`Blog/Projects/OCR-App.md` has strong product potential, but the note spends too long on personal motivation before proving technical depth. Keep the motivation, but shorten it.

Add architecture details: PDF/image ingestion, preprocessing, OCR backend abstraction, async queue, model parameter UI, and batch processing. Fix small polish issues like "simpelr," subject/verb agreement around "leverage," and the stray backtick in the Application Preview section.

### AC-HardBrakeDetect

`Blog/Projects/AC-HardbrakeDetect.md` is a good human-centered project, but it needs more engineering substance.

Add the braking detection logic: telemetry fields used, thresholding, smoothing/debounce, UI behavior, and false-positive handling. Otherwise employers may read it as a small mod rather than a useful instrumentation project.

## What To Leave Out Or Reduce

- Reduce long personal context unless it directly explains product requirements.
- Avoid phrases like "at my behest," "of much benefit," and broad claims like "state-of-the-art" unless the model or benchmark is named.
- Avoid future-heavy language. "Next Feature" is useful, but each project should first feel complete and demonstrable.
- Avoid vague status labels like "Beyond MVP" without saying what already works.

## Page-Level Issues

The Projects page at `website/src/app/projects/page.tsx` is too sparse for employer scanning. Add a short intro under "Projects" that frames the portfolio: systems tooling, C++ apps, applied automation, and low-level work.

The cards in `website/src/components/projects/ProjectCard.tsx` should include visible actions: "Read case study," "GitHub," "Demo," and possibly "Release." Right now the title link is easy to miss.

Consider adding compact metadata per card: status, role, year, and project type. Employers skim; make the strongest facts visible before they click.

One important implementation/content mismatch: `Blog/Projects/Sigminer.md` has `published: false`, but project pages intentionally include unpublished project notes. That may be fine technically, but it is confusing editorially. If it is employer-facing, mark it published or use a separate `featured: true` field.

## Highest-Impact Change

Turn each project into this structure:

```md
## Summary
One paragraph: what it is, who it helps, and what it proves technically.

## Highlights
- Built X
- Implemented Y
- Integrated Z
- Result/evidence

## Technical Design
Architecture, libraries, data flow, constraints.

## Demo
Screenshots/video plus links.

## What I Learned / Tradeoffs
Specific engineering judgment.

## Current Status
What works now, what is next.
```

If only one thing is refined first, make Sigminer the flagship case study. It has the strongest employer signal and should anchor the Projects page.
