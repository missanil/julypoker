# 七月牌局 / July Poker

七月牌局 is a mobile-first PWA scorekeeper for 找朋友 / upgrade poker nights. It helps a friend group select players, arrange seating, track dealer-side partners and opponent scores, apply level rules, undo rounds, end the game when A is completed, and export a bilingual shareable recap poster.

Based on the preserved cleaned version.

Updates:

Initial:
- Keeps the v3 UI baseline.
- Keeps the scoring fixes.
- Uses lightweight CSS avatars, with 14 unique preset avatars.
- Keeps extra CSS avatar definitions for newly added players.
- Adds seating controls, undo/reset, and an in-app rules/settings screen.
- Limits opponent score by deck count: 0-300 for 3 decks, 0-400 for 4 decks.
- Exports game history as a shareable recap image with playful analysis.
- Adds an EN/CN UI toggle. Chinese app title: 找朋友计分器.
- Adds iPhone-oriented PWA metadata, app icons, and a service worker.

v2:
- Ends the game when a player side successfully completes A, with a recap prompt.
- Allows EN/CN switching during setup, active play, and the finished game screen.
- Uses the native share sheet for recap images when supported, with download fallback.
- Updates recap images to a 1080x1920 mobile poster with full leaderboard and expanded playful analysis templates.
- Refreshes the service worker cache version for PWA updates.

Local test:

```bash
python3 -m http.server 8080
```

Then hard refresh:

```text
Cmd + Shift + R
```
