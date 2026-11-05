# vedan1999.github.io

Source for [danielbaldwin's personal site](https://vedan1999.github.io), built with Jekyll on GitHub Pages.

- `index.md`, `research.md`, `projects.md`, `writing.md`, `maths.md`, `quant.md` : the pages
- `_posts/` : write-ups (puzzles, notes). See `_drafts/jane-street-template.md` for the format.
- `_quant/` : quant interview questions, one per file, each with one ```python block. See `_drafts/quant-template.md`. Run `python tools/quant_check.py` to extract the scripts to `assets/quant/` and execute them all.
- `_bounces/` : the complex-bounce calculations, one potential per file, listed on the Research page. `assets/research/bounces_check.py` verifies the closed forms numerically.
- `_problems/` : problems for students, listed on `/maths/`.
- `_layouts/`, `assets/css/style.css` : layout and styling
- `_config.yml` : site settings

Pushing to `main` rebuilds the site automatically.
