# 七月牌局 / July Poker

Based on the preserved cleaned version.

Updates:
- Keeps the v3 UI baseline.
- Keeps the scoring fixes.
- Uses lightweight CSS avatars, with 14 unique preset avatars.
- Keeps extra CSS avatar definitions for newly added players.
- Adds seating controls, undo/reset, and an in-app rules/settings screen.
- Limits opponent score by deck count: 0-300 for 3 decks, 0-400 for 4 decks.
- Exports game history as a shareable recap image with playful analysis.
- Adds an EN/CN UI toggle. Chinese app title: 找朋友计分器.
- Adds iPhone-oriented PWA metadata, app icons, and a service worker.

Local test:

```bash
python3 -m http.server 8080
```

Then hard refresh:

```text
Cmd + Shift + R
```
