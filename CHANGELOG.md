# Changelog

## v3

- Supports 5 to 9 players, including even-numbered games.
- Calculates friend slots from player count: `floor((playerCount - 2) / 2)`.
- Replaces unique partner selection with friend slots, allowing the same player to be selected multiple times.
- Allows the dealer to fill friend slots with themselves.
- Keeps repeated friends from receiving duplicate level advancement.
- Treats all-dealer friend slots as a solo-dealer round; on a dealer-side win, the dealer gets one extra level beyond the normal dealer bonus.
- Updates takeover score to `deckCount * 40`: 120 for 3 decks and 160 for 4 decks.
- Uses half of the takeover score as the jump interval for both dealer-side scoring bands and opponent-side takeover jumps.
- Shows repeated friend slots on the table, including dealer badges such as `庄+友×2`.
- Adds local saved games with save, restore, and delete actions. Saves are stored in the current device/browser `localStorage`.
- Updates history and recap statistics to use the actual unique dealer side when friend slots repeat.
- Refreshes the service worker cache version for PWA updates.

## v2

- Ends the game when a player side successfully completes A, with a recap prompt.
- Allows EN/CN switching during setup, active play, and the finished game screen.
- Uses the native share sheet for recap images when supported, with download fallback.
- Updates recap images to a 1080x1920 mobile poster with full leaderboard and expanded playful analysis templates.
- Adds opponent-side takeover and pressure-point stats to the recap poster.
- Refreshes the service worker cache version for PWA updates.

## Initial

Based on the preserved cleaned version.

- Keeps the v3 UI baseline.
- Keeps the scoring fixes.
- Uses lightweight CSS avatars, with 14 unique preset avatars.
- Keeps extra CSS avatar definitions for newly added players.
- Adds seating controls, undo/reset, and an in-app rules/settings screen.
- Limits opponent score by deck count: 0-300 for 3 decks, 0-400 for 4 decks.
- Exports game history as a shareable recap image with playful analysis.
- Adds an EN/CN UI toggle. Chinese app title: 找朋友计分器.
- Adds iPhone-oriented PWA metadata, app icons, and a service worker.
