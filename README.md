# IEDC KMCTCE Website

Static GitHub Pages website for IEDC KMCTCE. The site is built with plain HTML, CSS, and JavaScript so it can be hosted directly from the repository root without a build step.

## Pages

- `index.html` - landing page
- `about.html` - about, purpose, and impact placeholders
- `programs.html` - program track placeholders
- `events.html` - activity gallery loaded from `data/events.json`
- `team.html` - team directory loaded from `data/team.json`
- `contact.html` - contact placeholders and form UI
- `members/*.html` - separate role-based member profile pages

## Update Content

- Edit member details in `data/team.json`.
- Edit activities in `data/events.json`.
- Replace images in `assets/images/placeholders/` or update image paths in the JSON files.
- Member page file names use role slugs, for example `members/chief-executive-officer.html`.

## GitHub Pages Publishing

1. Commit and push these files to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Set source to `Deploy from a branch`.
5. Select the `main` branch and `/ (root)` folder.
6. Save and wait for GitHub Pages to publish.

The `.nojekyll` file is included so GitHub Pages serves the static assets directly.
