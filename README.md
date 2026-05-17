# 七月牌局 / July Poker

## 中文概览

七月牌局是一个为「找朋友 / 升级」朋友局设计的移动端 PWA 计分器，适合在手机上现场使用。它支持选择玩家、安排座位、选择牌副数、记录庄家的朋友名额、输入对手分、自动计算升级与上台、撤销上一局、保存和恢复被中断的牌局，并在打过 A 后结束比赛、导出双语战报海报。应用 UI 支持中英文切换。

核心规则与功能：
- 支持 5 到 9 人参与。朋友位数按 `floor((playerCount - 2) / 2)` 计算，因此 5/6/7/8/9 人局分别使用 1/2/2/3/3 个朋友位。
- 支持 3 副牌和 4 副牌。每副牌最多计 100 个对手分。
- 上台分为 `deckCount * 40`：3 副牌 120 分上台，4 副牌 160 分上台。
- 跳级间隔为上台分的一半：3 副牌每 60 分一档，4 副牌每 80 分一档。
- 庄家方获胜时，庄家和实际朋友升级；庄家获得庄家奖励，同一个朋友被找多次也只升级一次。
- 朋友位可以重复选择同一名玩家，庄家也可以选择自己作为朋友。
- 如果所有朋友位都是庄家本人，则视为单人坐庄；庄家方获胜时，庄家在普通庄家奖励基础上额外 +1 级。
- 对手方达到上台分时，由实际对手方上台，并按上台分和跳级间隔计算跳级，随后轮换庄家。
- 10 / K / A 是必打级，除非已经在庄家方获胜中完成，否则不能跳过。
- 牌局存档保存在当前设备/浏览器的 `localStorage` 中，支持保存、恢复和删除。

## English Overview

July Poker is a mobile-first PWA scorekeeper for 找朋友 / upgrade poker nights. It is designed for in-person friend-group games on a phone, helping players select participants, arrange seating, choose deck count, record dealer-side friend slots, enter opponent scores, apply level and takeover rules, undo rounds, save and restore interrupted games, end the match when A is completed, and export a bilingual shareable recap poster. The app UI supports English and Chinese switching.

Core rules and features:
- Supports 5 to 9 players. Friend slots are calculated from player count with `floor((playerCount - 2) / 2)`, so 5/6/7/8/9-player games use 1/2/2/3/3 friend slots.
- Supports 3-deck and 4-deck games. Each deck contributes up to 100 opponent points.
- Takeover score is `deckCount * 40`: 120 for 3 decks and 160 for 4 decks.
- Jump interval is half of the takeover score: 60 for 3 decks and 80 for 4 decks.
- Dealer-side wins advance the dealer and actual friends; the dealer receives the normal dealer bonus, and repeated friends only advance once.
- Friend slots may repeat the same player, and the dealer may choose themselves as a friend.
- If every friend slot is filled by the dealer, the round is treated as a solo-dealer round. On a dealer-side win, the dealer gets one extra level beyond the normal dealer bonus.
- Opponent-side takeover advances the actual opponent side according to the takeover score and jump interval, then rotates the dealer.
- Required levels 10 / K / A cannot be skipped unless already completed on a dealer-side win.
- Saved games are stored locally in the current device/browser `localStorage`, with save, restore, and delete actions for interrupted sessions.

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
- Adds opponent-side takeover and pressure-point stats to the recap poster.
- Refreshes the service worker cache version for PWA updates.

v3:
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

Local test:

```bash
python3 -m http.server 8080
```

Then hard refresh:

```text
Cmd + Shift + R
```
