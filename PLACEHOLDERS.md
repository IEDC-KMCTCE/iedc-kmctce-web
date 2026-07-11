# Placeholder Guide

The site is intentionally ready for future updates. Replace the placeholders when the latest IEDC KMCTCE content is confirmed.

## Editable Data Files

- `data/team.json` controls team cards and individual member profile details.
- `data/events.json` controls activity/program cards.

## Placeholder Images

- `assets/images/placeholders/hero-placeholder.svg`
- `assets/images/placeholders/program-placeholder.svg`
- `assets/images/placeholders/event-placeholder.svg`
- `assets/images/placeholders/team-placeholder.svg`
- `assets/images/placeholders/member-placeholder.svg`

## Member Pages

Each member profile has a separate page under `members/`. The current files are named by role:

- `nodal-officer.html`
- `faculty-coordinator.html`
- `chief-executive-officer.html`
- `chief-operating-officer.html`
- `innovation-lead.html`
- `technology-lead.html`
- `creative-lead.html`
- `finance-lead.html`
- `community-lead.html`
- `media-lead.html`

If you add a new member role, add the matching object in `data/team.json` and create a matching HTML file in `members/` using the same structure.
