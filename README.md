# Portfolio

A static site (no build step) for GitHub Pages. The home page draws my work as a measurement model you can poke. Each "toy" is its own page in `toys/`, listed on `play.html`, and tied back to the project in the model it comes from (and the model links forward to it).

## Where things are

| Path | What it is |
| --- | --- |
| `index.html` | The home page: diagram, list, footer. `index.html?open=cleome` opens that project's card (the toy pages link back this way). |
| `play.html` | The Play page: one card per toy, each showing the factor and project it comes from. |
| `assets/content.js` | **Every word on the site.** Edit here to change a card, a role line, a link or the role-fit rows. |
| `assets/model.js` | The diagram, hover card, bottom sheet, Plain English / Nerd modes. |
| `assets/site.css` | The print-shop look. |
| `assets/nav.js`, `assets/nav.css` | The shared top bar (injected on every page) and the small factor-to-project drawing. |
| `assets/shell.js`, `assets/shell.css` | The frame around each toy: what it shows, why it is here, link to the model, previous and next. Reads each toy's entry in `content.js`. |
| `toys/*.html` | One interactive page per toy. Each names itself with `<body data-toy="...">`; its title, question and link to the model come from `toys` in `content.js` (`from` lists the projects it relates to, the first is its home). |
| `downloads/` | Files visitors can download. Only simulated data goes here, never participant data. |
| `tests/` | Playwright checks (see below). |
| `_backup/` | The previous landing page and README, kept for reference. |

## Rules for what goes on the site

No results, no sample sizes, nothing from unpublished work beyond the question and the method. Unpublished projects are phrased as ongoing. Any toy uses invented data.

## Before it goes public

- To add a toy: copy a file in `toys/`, add an entry to `toys` in `assets/content.js`, and it appears on `play.html`, in the project's card and as a badge on the diagram.
- In `assets/content.js`, set `APPS` to the Hugging Face Space URLs once each app is deployed. Until then each tool says "live app coming soon". Set `SOURCE.github` too.
- Check the LinkedIn address in `index.html` and `assets/content.js` (it is not in the usual `linkedin.com/in/...` form).
- Confirm the Jivisha partner wording and whether to name the partner.
- The role-fit panel has no button. It opens only when `#research` is added to the address.

## Deploy on GitHub Pages

1. Create a GitHub repository (for a user site name it `<username>.github.io`).
2. In this folder run `git init -b main`, `git add -A`, `git commit -m "Portfolio site"`, then add the remote and push.
3. Repository settings, Pages, deploy from branch `main`, folder `/ (root)`.

The three Shiny apps (SEMpathy, Cleome, Distill) cannot run on GitHub Pages. They live on Hugging Face Spaces and the site links to them.

## Test locally

```
python -m http.server 8765        # from this folder
cd tests && npm install
node smoke.js                     # window fill, text size, overflow, banned words, six window sizes
node interact.js                  # pinning, keyboard, resizing
node a11y.js                      # axe accessibility audit (light only, as the site is light-only)
```

Both scripts drive Microsoft Edge by default. Set `BROWSER_CHANNEL=chrome` to use Chrome. Screenshots go to `tests/shots/`.

## Resume

The resume is a page of its own at `resume/index.html` (A4, two pages, Archivo embedded; every Resume link on the site opens it, set once as `RESUME` in `assets/content.js`). Its PDF is `downloads/Sukrit Research Assistant+Teaching Resume.pdf`, linked from the page's Download PDF button. After editing the page, print it again to PDF (A4, margins none, background graphics on; the button bar does not print) and replace that file. The cover letter is not part of the site.
