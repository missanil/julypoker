const DEFAULT_PLAYER_NAMES = [
  "喳喳", "凯西", "艾丽", "泡饭", "JuJu", "刀瑞", "蔻儿", "呆呆", "果果", "贝妈", "克克", "WIN", "囡囡", "海伦"
];

const AVATAR_LIBRARY = [
  { id: "av01", bg: "#ffd166", hair: "#3b2418", skin: "#ffd8b8", shirt: "#f59e0b", glasses: false, style: "high-pony", accessory: "bow" },
  { id: "av02", bg: "#a7d8ff", hair: "#5a3826", skin: "#ffd5b5", shirt: "#93c5fd", glasses: true, style: "bob", accessory: "clip" },
  { id: "av03", bg: "#fb7185", hair: "#6b3f26", skin: "#ffd7bd", shirt: "#ef4444", glasses: false, style: "long", accessory: "earrings" },
  { id: "av04", bg: "#bbf7d0", hair: "#b7791f", skin: "#ffd9bd", shirt: "#22c55e", glasses: false, style: "messy-bun", accessory: "none" },
  { id: "av05", bg: "#c4b5fd", hair: "#111827", skin: "#ffd6b6", shirt: "#8b5cf6", glasses: false, style: "long", accessory: "headband" },
  { id: "av06", bg: "#f9a8d4", hair: "#171717", skin: "#ffd4b2", shirt: "#ec4899", glasses: false, style: "short", accessory: "beret" },
  { id: "av07", bg: "#bfdbfe", hair: "#4b2e1e", skin: "#ffd9bd", shirt: "#38bdf8", glasses: false, style: "side-braid", accessory: "flower" },
  { id: "av08", bg: "#ddd6fe", hair: "#3f2a1d", skin: "#ffd7b8", shirt: "#a855f7", glasses: false, style: "wavy", accessory: "beret" },
  { id: "av09", bg: "#dcfce7", hair: "#18181b", skin: "#f5c79f", shirt: "#16a34a", glasses: false, style: "side-braid", accessory: "flower" },
  { id: "av10", bg: "#fed7aa", hair: "#78350f", skin: "#ffd6b2", shirt: "#fb923c", glasses: false, style: "lob", accessory: "earrings" },
  { id: "av11", bg: "#d9f99d", hair: "#111827", skin: "#ffd3ad", shirt: "#10b981", glasses: true, style: "top-bun", accessory: "none" },
  { id: "av12", bg: "#fecdd3", hair: "#92400e", skin: "#ffd8b8", shirt: "#f43f5e", glasses: false, style: "twin-tail", accessory: "bow" },
  { id: "av13", bg: "#99f6e4", hair: "#4c1d95", skin: "#f7caa6", shirt: "#0d9488", glasses: false, style: "twin-tail", accessory: "bow" },
  { id: "av14", bg: "#bae6fd", hair: "#0f172a", skin: "#ffd6b3", shirt: "#0284c7", glasses: false, style: "pixie", accessory: "clip" },
  { id: "av15", bg: "#fde68a", hair: "#713f12", skin: "#ffd2aa", shirt: "#ca8a04", glasses: true, style: "lob", accessory: "none" },
  { id: "av16", bg: "#fbcfe8", hair: "#7f1d1d", skin: "#ffd7bd", shirt: "#db2777", glasses: false, style: "bob", accessory: "headband" },
  { id: "av17", bg: "#bbf7d0", hair: "#365314", skin: "#ffd8b8", shirt: "#65a30d", glasses: false, style: "high-pony", accessory: "flower" },
  { id: "av18", bg: "#c7d2fe", hair: "#27272a", skin: "#f6c19a", shirt: "#6366f1", glasses: true, style: "short", accessory: "clip" },
  { id: "av19", bg: "#fed7aa", hair: "#581c87", skin: "#ffd5b8", shirt: "#c026d3", glasses: false, style: "side-braid", accessory: "bow" },
  { id: "av20", bg: "#e2e8f0", hair: "#334155", skin: "#f7c39c", shirt: "#64748b", glasses: false, style: "wavy", accessory: "earrings" },
];

const FIXED_AVATAR_BY_NAME = {
  "喳喳": "av01",
  "凯西": "av02",
  "艾丽": "av03",
  "泡饭": "av04",
  "JuJu": "av05",
  "刀瑞": "av06",
  "蔻儿": "av07",
  "呆呆": "av08",
  "果果": "av09",
  "贝妈": "av10",
  "克克": "av11",
  "WIN": "av12",
  "囡囡": "av13",
  "海伦": "av14",
};

const LEVELS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
const REQUIRED_LEVELS = ["10", "K", "A"];
const STORAGE_KEY = "upgrade-poker-scorekeeper-v3-rules-fix-v4-avatars";
const OLD_STORAGE_KEY = "upgrade-poker-scorekeeper-v1";

const state = loadState();

function isZh() {
  return state.language === "zh";
}

function copy(en, zh) {
  return isZh() ? zh : en;
}

function createDefaultState() {
  const profiles = DEFAULT_PLAYER_NAMES.map((name, index) => ({
    id: `p-${index + 1}`,
    name,
    avatarId: FIXED_AVATAR_BY_NAME[name] || AVATAR_LIBRARY[index % AVATAR_LIBRARY.length].id,
    createdAt: Date.now() + index,
  }));

  return {
    screen: "setup",
    language: "en",
    isPlayerSelectExpanded: false,
    playerProfiles: profiles,
    selectedPlayerIds: [],
    seatingOrder: [],
    deckCount: 3,
    game: null,
    pending: {
      firstDealerId: "",
      partnerIds: [],
      opponentScore: 0,
      newPlayerName: "",
    },
    lastResult: null,
  };
}

function normalizeState(parsed) {
  const base = createDefaultState();
  const incoming = parsed || {};
  const mergedProfiles = [...(incoming.playerProfiles || [])];

  DEFAULT_PLAYER_NAMES.forEach((name) => {
    if (!mergedProfiles.some((p) => p.name === name)) {
      mergedProfiles.push({
        id: `p-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name,
        avatarId: FIXED_AVATAR_BY_NAME[name],
        createdAt: Date.now(),
      });
    }
  });

  mergedProfiles.forEach((profile, index) => {
    const fixedAvatarId = FIXED_AVATAR_BY_NAME[profile.name];
    profile.avatarId = fixedAvatarId || profile.avatarId || AVATAR_LIBRARY[index % AVATAR_LIBRARY.length].id;
  });

  const normalizedGame = incoming.game
    ? { ...incoming.game, undoStack: incoming.game.undoStack || [], finished: incoming.game.finished || null }
    : incoming.game;

  return {
    ...base,
    ...incoming,
    game: normalizedGame,
    playerProfiles: mergedProfiles,
    isPlayerSelectExpanded: incoming.isPlayerSelectExpanded ?? false,
    pending: { ...base.pending, ...(incoming.pending || {}) },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
    if (!raw) return createDefaultState();
    return normalizeState(JSON.parse(raw));
  } catch {
    return createDefaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Keep the app usable if storage is unavailable or full.
  }
}

function render() {
  saveState();
  const app = document.querySelector("#app");
  app.innerHTML = state.screen === "game"
    ? renderGameScreen()
    : state.screen === "rules"
      ? renderRulesScreen()
      : renderSetupScreen();
  bindEvents();
}

function getPlayerProfile(id) {
  return state.playerProfiles.find((p) => p.id === id);
}

function getPlayerName(id) {
  return getPlayerProfile(id)?.name ?? copy("Unknown", "未知玩家");
}

function getPlayerNameHtml(id) {
  return escapeHtml(getPlayerName(id));
}

function getAvatar(id) {
  const avatarId = getPlayerProfile(id)?.avatarId || AVATAR_LIBRARY[0].id;
  return AVATAR_LIBRARY.find((a) => a.id === avatarId) || AVATAR_LIBRARY[0];
}

function renderAvatar(id, size = "normal") {
  const a = getAvatar(id);
  return `
    <span class="cartoon-avatar ${size} hair-${a.style} accessory-${a.accessory} ${a.glasses ? "has-glasses" : ""}" style="--bg:${a.bg};--hair:${a.hair};--skin:${a.skin};--shirt:${a.shirt};">
      <span class="hair-shape"></span>
      <span class="accessory-mark"></span>
      <span class="face">
        <span class="fringe"></span>
        <span class="eye left"></span><span class="eye right"></span>
        ${a.glasses ? `<span class="glasses"></span>` : ""}
        <span class="smile"></span>
      </span>
      <span class="body"></span>
    </span>
  `;
}

function getRequiredPartnerCount(playerCount) {
  return (playerCount - 3) / 2;
}

function getTakeoverScore(deckCount) {
  return deckCount === 4 ? 180 : 120;
}

function getMaxScore(deckCount) {
  return deckCount * 100;
}

function renderLanguageToggle() {
  return `
    <div class="language-toggle" aria-label="${copy("Language", "语言")}">
      <button class="${state.language !== "zh" ? "active" : ""}" data-action="set-language" data-value="en">EN</button>
      <button class="${state.language === "zh" ? "active" : ""}" data-action="set-language" data-value="zh">中</button>
    </div>
  `;
}

function getPlayerState(id) {
  return state.game.players.find((p) => p.playerId === id);
}

function getCurrentDealerId() {
  return state.game.currentDealerId;
}

function getDealerLevel() {
  const dealer = getPlayerState(getCurrentDealerId());
  return dealer?.level ?? "2";
}

function createGame() {
  if (state.seatingOrder.length < 5 || state.seatingOrder.length % 2 === 0) {
    alert(copy("Please select an odd number of players, at least 5.", "请选择至少 5 位玩家，且人数必须为奇数。"));
    return;
  }

  state.game = {
    roundNumber: 1,
    deckCount: state.deckCount,
    seatingOrder: [...state.seatingOrder],
    currentDealerId: null,
    players: state.seatingOrder.map((playerId) => ({
      playerId,
      level: "2",
      completedRequiredLevels: { "10": false, K: false, A: false },
    })),
    history: [],
    undoStack: [],
    finished: null,
  };
  state.pending = { ...state.pending, firstDealerId: "", partnerIds: [], opponentScore: 0 };
  state.lastResult = null;
  state.screen = "game";
  render();
}

function togglePlayer(playerId) {
  const selected = state.selectedPlayerIds.includes(playerId);
  if (selected) {
    state.selectedPlayerIds = state.selectedPlayerIds.filter((id) => id !== playerId);
    state.seatingOrder = state.seatingOrder.filter((id) => id !== playerId);
  } else {
    state.selectedPlayerIds.push(playerId);
    state.seatingOrder.push(playerId);
  }
  render();
}

function getRandomAvatarId() {
  const used = new Set(state.playerProfiles.map((p) => p.avatarId));
  const available = AVATAR_LIBRARY.filter((a) => !used.has(a.id));
  const pool = available.length ? available : AVATAR_LIBRARY;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

function addNewPlayer() {
  const name = state.pending.newPlayerName.trim();
  if (!name) return;
  const id = `p-${Date.now()}`;
  state.playerProfiles.push({ id, name, avatarId: getRandomAvatarId(), createdAt: Date.now() });
  state.selectedPlayerIds.push(id);
  state.seatingOrder.push(id);
  state.pending.newPlayerName = "";
  render();
}

function moveSeat(fromIndex, toIndex) {
  if (!Number.isFinite(fromIndex) || !Number.isFinite(toIndex)) return;
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= state.seatingOrder.length || toIndex >= state.seatingOrder.length) return;
  const next = [...state.seatingOrder];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  state.seatingOrder = next;
  render();
}

function resetGame() {
  if (!state.game) return;
  if (!confirm(copy(
    "Reset current game and return to setup? Players and seating will stay saved.",
    "确定要重置当前牌局并返回设置吗？玩家和座位会保留。"
  ))) return;
  state.game = null;
  state.lastResult = null;
  state.pending = { ...state.pending, firstDealerId: "", partnerIds: [], opponentScore: 0 };
  state.screen = "setup";
  render();
}

function cloneGameForUndo(game) {
  const { undoStack, ...snapshot } = game;
  return JSON.parse(JSON.stringify(snapshot));
}

function undoLastRound() {
  const undoStack = state.game?.undoStack || [];
  const undoEntry = undoStack.pop();
  if (!undoEntry) {
    alert(copy("No round to undo.", "没有可以撤销的回合。"));
    return;
  }
  state.game = JSON.parse(JSON.stringify(undoEntry.game));
  state.game.undoStack = undoStack;
  state.pending = { ...state.pending, ...(undoEntry.pending || {}), newPlayerName: state.pending.newPlayerName };
  state.lastResult = state.game.history[0] || null;
  render();
}

function advanceLevel(currentLevel, steps, completedRequiredLevels) {
  let index = LEVELS.indexOf(currentLevel);
  if (index < 0) index = 0;
  if (steps <= 0) return LEVELS[index];

  // Special rule: 10, K, and A cannot be skipped.
  // If a player is currently on one of these required levels and has not
  // completed it as the dealer, they must stay on that level.
  const current = LEVELS[index];
  if (REQUIRED_LEVELS.includes(current) && !completedRequiredLevels[current]) {
    return current;
  }

  for (let i = 0; i < steps; i += 1) {
    if (index >= LEVELS.length - 1) return LEVELS[index];

    const nextLevel = LEVELS[index + 1];

    // If the next level is 10 / K / A and the player has not completed it,
    // the player lands on that required level but cannot jump over it.
    if (REQUIRED_LEVELS.includes(nextLevel) && !completedRequiredLevels[nextLevel]) {
      index += 1;
      return LEVELS[index];
    }

    index += 1;
  }

  return LEVELS[index];
}

function markRequiredCompletion(dealerLevel, dealerSideIds) {
  // 10, K, and A can be completed either by the dealer or by helping
  // the dealer as a friend on the dealer side.
  // Example: if a player is currently level 7 but helped the dealer pass 10,
  // that player can later skip through 10 when their own level reaches it.
  if (!REQUIRED_LEVELS.includes(dealerLevel)) return;
  dealerSideIds.forEach((id) => {
    const player = getPlayerState(id);
    if (player) player.completedRequiredLevels[dealerLevel] = true;
  });
}

function createGameFinishedState(roundRecord, winnerIds) {
  return {
    completedLevel: "A",
    winnerIds: [...winnerIds],
    roundNumber: roundRecord.roundNumber,
    createdAt: Date.now(),
  };
}

function findNextDealer(currentDealerId, dealerSideIds) {
  const order = state.game.seatingOrder;
  const currentIndex = order.indexOf(currentDealerId);

  // Restore original v3 dealer-rotation behavior.
  // In the v3 seating model, this corresponds to the intended counter-clockwise order.
  for (let offset = 1; offset <= order.length; offset += 1) {
    const candidate = order[(currentIndex + offset) % order.length];
    if (!dealerSideIds.includes(candidate)) return candidate;
  }

  return currentDealerId;
}

function getRoundType(round) {
  if (round.resultType) return round.resultType;
  return round.resultText?.startsWith("Dealer side wins") || round.resultText?.startsWith("庄家方获胜")
    ? "dealerWin"
    : "takeover";
}

function formatRoundResult(round) {
  const type = getRoundType(round);
  if (type === "dealerWin") {
    return copy(
      "Dealer side wins. Dealer and partners advance. Dealer continues.",
      "庄家方获胜。庄家和朋友升级，庄家继续坐庄。"
    );
  }
  const advanceSteps = round.resultAdvanceSteps ?? Math.floor((round.opponentScore - getTakeoverScore(state.game.deckCount)) / 60);
  const nextDealerName = getPlayerName(round.nextDealerId);
  return copy(
    `Opponent side takes over. All opponents advance +${advanceSteps}. ${nextDealerName} becomes dealer.`,
    `对手上台。所有对手跳 ${advanceSteps} 级。${nextDealerName} 成为庄家。`
  );
}

function submitRound() {
  const game = state.game;
  if (game.finished) {
    alert(copy("This game is already finished. Export the recap or reset to start again.", "本局已经结束。可以导出战报，或重置后重新开始。"));
    return;
  }

  const partnerCount = getRequiredPartnerCount(game.seatingOrder.length);
  const dealerId = game.currentDealerId || state.pending.firstDealerId;
  const partnerIds = state.pending.partnerIds;
  const opponentScore = Number(state.pending.opponentScore);
  const maxScore = getMaxScore(game.deckCount);

  if (!dealerId) {
    alert(copy("Please select the first dealer.", "请选择第一局庄家。"));
    return;
  }
  if (partnerIds.length !== partnerCount) {
    alert(copy(`Please select exactly ${partnerCount} partner(s).`, `请选择正好 ${partnerCount} 位朋友。`));
    return;
  }
  if (partnerIds.includes(dealerId)) {
    alert(copy("Dealer cannot be selected as a partner.", "庄家不能被选为朋友。"));
    return;
  }
  if (!Number.isFinite(opponentScore) || opponentScore < 0 || opponentScore % 5 !== 0) {
    alert(copy("Please enter a valid opponent score in 5-point increments.", "请输入有效的对手分，必须是 5 的倍数。"));
    return;
  }
  if (opponentScore > maxScore) {
    alert(copy(`Please enter a score from 0 to ${maxScore}.`, `请输入 0 到 ${maxScore} 之间的分数。`));
    return;
  }

  game.undoStack = game.undoStack || [];
  game.undoStack.push({
    game: cloneGameForUndo(game),
    pending: JSON.parse(JSON.stringify(state.pending)),
  });

  if (!game.currentDealerId) game.currentDealerId = dealerId;

  const takeoverScore = getTakeoverScore(game.deckCount);
  const dealerLevel = getDealerLevel();
  const dealerSideIds = [dealerId, ...partnerIds];
  const levelChanges = [];
  let nextDealerId = dealerId;
  let resultText = "";
  let resultType = "";
  let resultAdvanceSteps = 0;

  const opponentSideIds = game.seatingOrder.filter((id) => !dealerSideIds.includes(id));
  let finishedWinnerIds = [];

  if (opponentScore >= takeoverScore) {
    const advanceSteps = Math.floor((opponentScore - takeoverScore) / 60);
    resultAdvanceSteps = advanceSteps;
    resultType = "takeover";
    nextDealerId = findNextDealer(dealerId, dealerSideIds);

    // Correct rule: once the opponent side takes over, every opponent-side
    // player receives the same level advancement, not only the next dealer.
    opponentSideIds.forEach((id) => {
      const player = getPlayerState(id);
      const before = player.level;
      player.level = advanceLevel(player.level, advanceSteps, player.completedRequiredLevels);
      if (before !== player.level) levelChanges.push({ playerId: id, before, after: player.level });
    });

    resultText = formatRoundResult({ resultType, resultAdvanceSteps, nextDealerId });
  } else {
    resultType = "dealerWin";
    const dealerSteps = opponentScore === 0 ? 4 : opponentScore < 60 ? 3 : 2;
    const partnerSteps = opponentScore === 0 ? 3 : opponentScore < 60 ? 2 : 1;

    // Correct rule: dealer side advances together; the dealer receives one
    // extra level compared with partners. If the dealer side wins on 10 / K / A,
    // both dealer and friends complete that required level.
    markRequiredCompletion(dealerLevel, dealerSideIds);
    if (dealerLevel === "A") {
      finishedWinnerIds = [...dealerSideIds];
    }

    dealerSideIds.forEach((id) => {
      const player = getPlayerState(id);
      const steps = id === dealerId ? dealerSteps : partnerSteps;
      const before = player.level;
      player.level = advanceLevel(player.level, steps, player.completedRequiredLevels);
      if (before !== player.level) levelChanges.push({ playerId: id, before, after: player.level });
    });

    nextDealerId = dealerId;
    resultText = formatRoundResult({ resultType });
  }

  const roundRecord = {
    roundNumber: game.roundNumber,
    dealerId,
    dealerLevel,
    partnerIds: [...partnerIds],
    opponentScore,
    resultType,
    resultAdvanceSteps,
    resultText,
    nextDealerId,
    levelChanges,
    createdAt: Date.now(),
  };

  game.history.unshift(roundRecord);
  game.currentDealerId = nextDealerId;
  game.roundNumber += 1;
  if (finishedWinnerIds.length) {
    game.finished = createGameFinishedState(roundRecord, finishedWinnerIds);
  }
  state.pending.partnerIds = [];
  state.pending.firstDealerId = "";
  state.pending.opponentScore = 0;
  state.lastResult = roundRecord;
  render();

  if (game.finished && confirm(copy(
    "Game finished! A has been completed. Generate the recap image now?",
    "比赛结束！已经成功打过 A。现在生成战报吗？"
  ))) {
    exportHistoryImage();
  }
}

function renderSetupScreen() {
  const selectedCount = state.seatingOrder.length;
  const setupSummary = selectedCount
    ? copy(`${selectedCount} players · ${state.deckCount} decks`, `${selectedCount} 人 · ${state.deckCount} 副牌`)
    : copy(`Select players · ${state.deckCount} decks`, `选择玩家 · ${state.deckCount} 副牌`);
  return `
    <main class="page setup-page">
      <header class="topbar">
        <div>
          <h1>${copy("July Poker", "七月牌局")}</h1>
        </div>
        ${renderLanguageToggle()}
        <button class="utility-button" data-action="open-rules">${copy("Rules", "规则")}</button>
      </header>

      <section class="panel setup-accordion ${state.isPlayerSelectExpanded ? "expanded" : "collapsed"}">
        <button class="accordion-header" data-action="toggle-player-section">
          <span>${state.isPlayerSelectExpanded ? "⌄" : "›"}</span>
          <strong>${setupSummary}</strong>
        </button>
        <div class="accordion-body">
          <h2>${copy("Select Players", "选择玩家")}</h2>
          <div class="player-grid avatar-picker">
            ${state.playerProfiles.map((player) => `
              <button class="chip avatar-chip ${state.selectedPlayerIds.includes(player.id) ? "selected" : ""}" data-action="toggle-player" data-id="${player.id}">
                ${renderAvatar(player.id, "tiny")}
                <span>${state.selectedPlayerIds.includes(player.id) ? "✓ " : ""}${escapeHtml(player.name)}</span>
              </button>
            `).join("")}
          </div>
          <div class="add-player-row">
            <input id="new-player-input" placeholder="${copy("Add new player", "添加新玩家")}" value="${escapeHtml(state.pending.newPlayerName)}" />
            <button class="secondary" data-action="add-player">${copy("Add", "添加")}</button>
          </div>
        </div>
      </section>

      <section class="panel">
        <h2>${copy("Seating Preview", "牌桌预览")}</h2>
        <div class="meta-row">
          <span>${copy(`${selectedCount} players`, `${selectedCount} 人`)}</span>
          <span>${selectedCount >= 5 && selectedCount % 2 === 1 ? copy(`${getRequiredPartnerCount(selectedCount)} partner(s) needed`, `需要 ${getRequiredPartnerCount(selectedCount)} 位朋友`) : copy("Select odd count ≥ 5", "至少 5 人，且为奇数")}</span>
        </div>
        ${renderTablePreview(state.seatingOrder)}
        ${renderSeatingControls()}
      </section>

      <section class="panel compact">
        <h2>${copy("Deck Count", "牌副数")}</h2>
        <div class="segmented">
          <button class="${state.deckCount === 3 ? "active" : ""}" data-action="set-decks" data-value="3">${copy("3 Decks · 120 Takeover", "3 副牌 · 120 上台")}</button>
          <button class="${state.deckCount === 4 ? "active" : ""}" data-action="set-decks" data-value="4">${copy("4 Decks · 180 Takeover", "4 副牌 · 180 上台")}</button>
        </div>
      </section>

      <button class="primary sticky" data-action="start-game">${copy("Start Game", "开始牌局")}</button>
    </main>
  `;
}

function renderTablePreview(order, options = {}) {
  const radius = 42;
  const center = 50;
  return `
    <div class="table-wrap">
      <div class="round-table">
        ${order.map((id, index) => {
          const angle = -90 - (360 / order.length) * index;
          const rad = angle * Math.PI / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          return `
            <button class="avatar-seat" style="left:${x}%;top:${y}%" >
              ${renderAvatar(id)}
              <span class="avatar-name">${getPlayerNameHtml(id)}</span>
              ${state.game ? `<strong>${getPlayerState(id)?.level ?? "2"}</strong>` : ""}
            </button>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderSeatingControls() {
  if (!state.seatingOrder.length) {
    return `<p class="muted seating-empty">${copy("Select players in the order they sit around the table.", "按牌桌座位顺序选择玩家。")}</p>`;
  }
  return `
    <div class="seating-controls">
      <div class="field-label">${copy("Seating Order", "座位顺序")}</div>
      ${state.seatingOrder.map((id, index) => `
        <div class="seat-row">
          <span class="seat-index">${index + 1}</span>
          ${renderAvatar(id, "tiny")}
          <strong>${getPlayerNameHtml(id)}</strong>
          <div class="seat-actions">
            <button class="mini-button" data-action="seat-left" data-index="${index}" ${index === 0 ? "disabled" : ""}>↑</button>
            <button class="mini-button" data-action="seat-right" data-index="${index}" ${index === state.seatingOrder.length - 1 ? "disabled" : ""}>↓</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGameScreen() {
  const game = state.game;
  const dealerId = game.currentDealerId;
  const partnerCount = getRequiredPartnerCount(game.seatingOrder.length);
  const takeoverScore = getTakeoverScore(game.deckCount);
  const maxScore = getMaxScore(game.deckCount);
  const selectedPartners = state.pending.partnerIds;
  const currentDealerLabel = dealerId ? getPlayerName(dealerId) : copy("Select after Round 1", "第一局后选择");
  const currentLevel = dealerId ? getDealerLevel() : "2";
  const isFinished = Boolean(game.finished);

  return `
    <main class="page game-page">
      <header class="topbar game-topbar">
        <button class="icon-button" data-action="back-setup">‹</button>
        <div class="topbar-title">
          <div class="eyebrow">${isFinished
            ? copy(`Game Complete · ${game.deckCount} decks`, `比赛结束 · ${game.deckCount} 副牌`)
            : copy(`Round ${game.roundNumber} · ${game.deckCount} decks · ${takeoverScore} takeover`, `第 ${game.roundNumber} 局 · ${game.deckCount} 副牌 · ${takeoverScore} 上台`)}</div>
          <h1>${dealerId ? escapeHtml(currentDealerLabel) : currentDealerLabel} <span class="level-pill">${copy(`Level ${currentLevel}`, `级牌 ${currentLevel}`)}</span></h1>
        </div>
        ${renderLanguageToggle()}
      </header>

      <section class="action-bar">
        <button class="secondary" data-action="undo-round" ${game.undoStack?.length ? "" : "disabled"}>${copy("Undo Last Round", "撤销上一局")}</button>
        <button class="secondary danger" data-action="reset-game">${copy("Reset Game", "重置牌局")}</button>
        <button class="secondary" data-action="open-rules">${copy("Rules", "规则")}</button>
      </section>

      <section class="panel table-panel">
        ${renderGameTable()}
      </section>

      ${state.lastResult ? renderLastResult() : ""}

      ${isFinished ? renderGameFinishedPanel() : `
      <section class="panel input-panel">
        <h2>${copy("End Current Round", "结束本局")}</h2>
        ${!dealerId ? renderFirstDealerSelector() : ""}
        <label class="field-label">${copy(`Dealer Partners · select ${partnerCount}`, `庄家的朋友 · 选择 ${partnerCount} 位`)}</label>
        <div class="player-grid small">
          ${game.seatingOrder.map((id) => {
            const disabled = (dealerId || state.pending.firstDealerId) === id;
            return `<button class="chip avatar-chip ${selectedPartners.includes(id) ? "selected blue" : ""}" ${disabled ? "disabled" : ""} data-action="toggle-partner" data-id="${id}">${renderAvatar(id, "tiny")}<span>${getPlayerNameHtml(id)}</span></button>`;
          }).join("")}
        </div>

        <label class="field-label">${copy(`Opponent Score · 0-${maxScore}`, `对手分 · 0-${maxScore}`)}</label>
        <div class="score-stepper numeric-only">
          <button data-action="score-minus">−5</button>
          <input id="score-input" type="number" inputmode="numeric" min="0" max="${maxScore}" step="5" value="${state.pending.opponentScore}" />
          <button data-action="score-plus">+5</button>
        </div>
        <p class="hint">${copy("Each deck has up to 100 points. Scores should be entered in 5-point increments.", "每副牌最多 100 分。分数必须是 5 的倍数。")}</p>
        <button class="primary" data-action="submit-round">${copy("End Round and Calculate", "结束本局并计分")}</button>
      </section>
      `}

      <section class="panel history-panel">
        <div class="panel-title-row">
          <h2>${copy("History", "历史记录")}</h2>
          <button class="secondary small-action" data-action="export-history-image" ${game.history.length ? "" : "disabled"}>${copy("Export Result", "导出战报")}</button>
        </div>
        ${game.history.length === 0 ? `<p class="muted">${copy("No rounds yet.", "还没有记录。")}</p>` : game.history.map(renderHistoryItem).join("")}
      </section>
    </main>
  `;
}

function renderGameFinishedPanel() {
  const finished = state.game.finished;
  const winnerNames = finished.winnerIds.map(getPlayerNameHtml).join(" · ");
  return `
    <section class="panel finished-panel">
      <div class="eyebrow">${copy("Final Result", "最终结果")}</div>
      <h2>${copy("Game Complete", "比赛结束")}</h2>
      <p>${copy(
        `${winnerNames} completed A in Round ${finished.roundNumber}.`,
        `${winnerNames} 在第 ${finished.roundNumber} 局成功打过 A。`
      )}</p>
      <button class="primary" data-action="export-history-image">${copy("Generate Recap", "生成战报")}</button>
    </section>
  `;
}

function renderGameTable() {
  const game = state.game;
  const dealerId = game.currentDealerId || state.pending.firstDealerId;
  const partnerIds = state.pending.partnerIds;
  const radius = 42;
  const center = 50;
  return `
    <div class="table-wrap live">
      <div class="round-table">
        ${game.seatingOrder.map((id, index) => {
          const angle = -90 - (360 / game.seatingOrder.length) * index;
          const rad = angle * Math.PI / 180;
          const x = center + radius * Math.cos(rad);
          const y = center + radius * Math.sin(rad);
          const player = getPlayerState(id);
          const isDealer = id === dealerId;
          const isPartner = partnerIds.includes(id);
          return `
            <div class="avatar-seat live-seat ${isDealer ? "dealer" : ""} ${isPartner ? "partner" : ""}" style="left:${x}%;top:${y}%">
              ${renderAvatar(id)}
              <span class="avatar-name">${getPlayerNameHtml(id)}</span>
              <strong>${player.level}</strong>
              ${isDealer ? `<em>庄</em>` : isPartner ? `<em>友</em>` : ""}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderFirstDealerSelector() {
  return `
    <label class="field-label">${copy("First Round Dealer", "第一局庄家")}</label>
    <div class="player-grid small">
      ${state.game.seatingOrder.map((id) => `
        <button class="chip avatar-chip ${state.pending.firstDealerId === id ? "selected" : ""}" data-action="set-first-dealer" data-id="${id}">${renderAvatar(id, "tiny")}<span>${getPlayerNameHtml(id)}</span></button>
      `).join("")}
    </div>
  `;
}

function renderLastResult() {
  const r = state.lastResult;
  return `
    <section class="result-card">
      <strong>${copy("Last Result", "上一局结果")}</strong>
      <span>${escapeHtml(formatRoundResult(r))}</span>
      <div>${r.levelChanges.length ? r.levelChanges.map((c) => `${getPlayerNameHtml(c.playerId)} ${c.before} → ${c.after}`).join(" · ") : copy("No level change", "无人升级")}</div>
    </section>
  `;
}

function renderHistoryItem(item) {
  return `
    <details class="history-item">
      <summary>${copy(`Round ${item.roundNumber}: ${getPlayerNameHtml(item.dealerId)} · Score ${item.opponentScore}`, `第 ${item.roundNumber} 局：${getPlayerNameHtml(item.dealerId)} · 对手分 ${item.opponentScore}`)}</summary>
      <p>${copy("Dealer level:", "庄家级牌：")} ${item.dealerLevel}</p>
      <p>${copy("Partners:", "朋友：")} ${item.partnerIds.map(getPlayerNameHtml).join(", ")}</p>
      <p>${escapeHtml(formatRoundResult(item))}</p>
      <p>${item.levelChanges.map((c) => `${getPlayerNameHtml(c.playerId)} ${c.before} → ${c.after}`).join(" · ") || copy("No level change", "无人升级")}</p>
    </details>
  `;
}

function getLevelRank(level) {
  const rank = LEVELS.indexOf(level);
  return rank < 0 ? 0 : rank;
}

function buildHistoryAnalysis() {
  const game = state.game;
  const stats = game.players.map((player) => ({
    playerId: player.playerId,
    name: getPlayerName(player.playerId),
    level: player.level,
    levelRank: getLevelRank(player.level),
    gains: 0,
    dealerWins: 0,
    friendWins: 0,
    takeoverWins: 0,
    opponentPoints: 0,
  }));
  const byId = new Map(stats.map((item) => [item.playerId, item]));

  game.history.forEach((round) => {
    const dealerStat = byId.get(round.dealerId);
    const dealerSideWon = getRoundType(round) === "dealerWin";
    if (dealerSideWon && dealerStat) dealerStat.dealerWins += 1;
    if (dealerSideWon) {
      round.partnerIds.forEach((id) => {
        const partnerStat = byId.get(id);
        if (partnerStat) partnerStat.friendWins += 1;
      });
    } else {
      game.seatingOrder.forEach((id) => {
        if (id === round.dealerId || round.partnerIds.includes(id)) return;
        const opponentStat = byId.get(id);
        if (opponentStat) opponentStat.takeoverWins += 1;
      });
    }
    round.levelChanges.forEach((change) => {
      const playerStat = byId.get(change.playerId);
      if (!playerStat) return;
      playerStat.gains += Math.max(0, getLevelRank(change.after) - getLevelRank(change.before));
    });
    game.seatingOrder.forEach((id) => {
      if (id === round.dealerId || round.partnerIds.includes(id)) return;
      const opponentStat = byId.get(id);
      if (opponentStat) opponentStat.opponentPoints += round.opponentScore;
    });
  });

  stats.sort((a, b) =>
    b.levelRank - a.levelRank ||
    b.gains - a.gains ||
    b.dealerWins - a.dealerWins ||
    b.friendWins - a.friendWins
  );

  const mvp = stats[0];
  const closer = [...stats].sort((a, b) => b.dealerWins - a.dealerWins || b.levelRank - a.levelRank)[0];
  const bestFriend = [...stats].sort((a, b) => b.friendWins - a.friendWins || b.gains - a.gains)[0];
  const takeoverArtist = [...stats].sort((a, b) => b.takeoverWins - a.takeoverWins || b.gains - a.gains)[0];
  const pressureArtist = [...stats].sort((a, b) => b.opponentPoints - a.opponentPoints || b.takeoverWins - a.takeoverWins || b.levelRank - a.levelRank)[0];
  const totalRounds = game.history.length;
  const topChanges = stats.filter((item) => item.gains > 0).slice(0, 4);

  const jokes = [
    copy(`${mvp.name} climbed to ${mvp.level} with the calm face of someone who absolutely did not just steal the table's snacks.`, `${mvp.name} 一路爬到 ${mvp.level}，表情淡定得像刚刚偷吃零食的人不是自己。`),
    copy(`${mvp.name} played like the scorekeeper owed them rent: tidy, persistent, and mildly alarming.`, `${mvp.name} 打得像计分器欠 TA 房租：稳定、执着，还有点吓人。`),
    copy(`${mvp.name} turned small wins into a whole staircase. The table has requested a ladder inspection.`, `${mvp.name} 把小胜攒成楼梯，牌桌已经申请安全检查。`),
    copy(`${mvp.name} reached ${mvp.level}; everyone else has been advised to shuffle with more sincerity.`, `${mvp.name} 到了 ${mvp.level}，其他人被建议洗牌时更虔诚一点。`),
    copy(`${mvp.name} treated the scoreboard like a personal calendar and scheduled steady progress all night.`, `${mvp.name} 把计分板当私人日程表，整晚都安排得明明白白。`),
    copy(`${mvp.name} kept advancing with the quiet confidence of someone who already saw the ending credits.`, `${mvp.name} 一路升级，淡定得像早就看过结局彩蛋。`),
    copy(`${mvp.name} did not sprint; they simply made everyone else look like they were walking through syrup.`, `${mvp.name} 没有冲刺，只是让别人看起来都像陷在糖浆里。`),
    copy(`${mvp.name} climbed to ${mvp.level} and left the table doing some very private math.`, `${mvp.name} 打到 ${mvp.level}，留下全桌开始默默心算人生。`),
    copy(`${mvp.name} made progress look casual, which is frankly the most annoying way to make progress.`, `${mvp.name} 把升级打得很随意，而随意地赢通常最气人。`),
    copy(`${mvp.name} arrived at ${mvp.level} with excellent timing and a suspicious lack of apology.`, `${mvp.name} 抵达 ${mvp.level}，时机精准，而且完全没有要道歉的意思。`),
    copy(`${mvp.name} collected levels like receipts and somehow made the whole thing look organized.`, `${mvp.name} 收级牌像收小票，还收得井井有条。`),
    copy(`${mvp.name} gave the scoreboard a long-term plan, and unfortunately the plan worked.`, `${mvp.name} 给计分板制定了长期规划，更糟的是规划还成功了。`),
  ];

  return {
    totalRounds,
    mvp,
    closer,
    bestFriend,
    takeoverArtist,
    pressureArtist,
    topChanges,
    joke: jokes[Math.abs(mvp.name.length + totalRounds + mvp.levelRank) % jokes.length],
    leaderboard: stats,
  };
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const source = String(text);
  const tokens = source.match(/[A-Za-z0-9+#'’.-]+|[\s]+|./gu) || [];
  const lines = [];
  let line = "";

  tokens.forEach((token) => {
    const normalized = /^\s+$/.test(token) ? " " : token;
    const testLine = `${line}${normalized}`;
    if (ctx.measureText(testLine.trimEnd()).width > maxWidth && line.trim()) {
      lines.push(line.trimEnd());
      line = normalized.trimStart();
    } else {
      line = testLine;
    }
  });
  if (line.trim()) lines.push(line.trimEnd());

  lines.slice(0, maxLines).forEach((textLine, index) => {
    const suffix = index === maxLines - 1 && lines.length > maxLines ? "..." : "";
    ctx.fillText(`${textLine}${suffix}`, x, y + index * lineHeight);
  });
  return y + Math.min(lines.length, maxLines) * lineHeight;
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawStatPill(ctx, label, value, x, y, width) {
  drawRoundRect(ctx, x, y, width, 92, 18);
  ctx.fillStyle = "rgba(255,255,255,0.11)";
  ctx.fill();
  ctx.fillStyle = "#a9c9bd";
  ctx.font = "23px system-ui, sans-serif";
  ctx.fillText(label, x + 20, y + 31);
  ctx.fillStyle = "#f6bf32";
  ctx.font = "900 44px system-ui, sans-serif";
  ctx.fillText(value, x + 20, y + 76);
}

function pickRecapLine(lines, seed) {
  return lines[Math.abs(seed) % lines.length];
}

function formatRecapDate() {
  const date = new Date();
  if (isZh()) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function getRecapFileName() {
  return `${isZh() ? "zhaopengyou-zhanbao" : "poker-night-recap"}-${Date.now()}.png`;
}

function downloadCanvasImage(canvas, fileName) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function canvasToPngBlob(canvas) {
  const dataUrl = canvas.toDataURL("image/png");
  const binary = atob(dataUrl.split(",")[1]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "image/png" });
}

async function shareOrDownloadCanvas(canvas) {
  const fileName = getRecapFileName();
  const blob = canvasToPngBlob(canvas);

  if (blob && navigator.canShare && navigator.share) {
    const file = new File([blob], fileName, { type: "image/png" });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: copy("Poker Night Recap", "找朋友战报"),
          text: copy("Poker night recap image", "找朋友牌局战报"),
        });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
  }

  downloadCanvasImage(canvas, fileName);
}

async function exportHistoryImage() {
  const game = state.game;
  if (!game?.history?.length) {
    alert(copy("No history to export yet.", "还没有历史记录可以导出。"));
    return;
  }

  const analysis = buildHistoryAnalysis();
  const recapDate = formatRecapDate();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#0b6046");
  gradient.addColorStop(0.55, "#04251d");
  gradient.addColorStop(1, "#01120e");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(246,191,50,0.16)";
  ctx.beginPath();
  ctx.arc(940, 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(47,125,246,0.14)";
  ctx.beginPath();
  ctx.arc(100, 1710, 260, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f6bf32";
  ctx.font = "900 72px system-ui, sans-serif";
  ctx.fillText(copy("Poker Night Recap", "找朋友战报"), 72, 124);
  ctx.fillStyle = "#a9c9bd";
  ctx.font = "30px system-ui, sans-serif";
  ctx.fillText(copy(
    `${analysis.totalRounds} rounds · ${game.deckCount} decks · Match Recap · ${recapDate}`,
    `${analysis.totalRounds} 局 · ${game.deckCount} 副牌 · 本场战报 · ${recapDate}`
  ), 74, 176);

  drawRoundRect(ctx, 64, 232, 952, 310, 34);
  ctx.fillStyle = "rgba(255,255,255,0.09)";
  ctx.fill();
  ctx.strokeStyle = "rgba(246,191,50,0.42)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f6bf32";
  ctx.font = "800 30px system-ui, sans-serif";
  ctx.fillText(copy("Tonight's MVP", "今晚 MVP"), 104, 290);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 70px system-ui, sans-serif";
  ctx.fillText(analysis.mvp.name, 104, 374, 820);
  ctx.fillStyle = "#d8ffe9";
  ctx.font = "31px system-ui, sans-serif";
  ctx.fillText(copy(`Current level: ${analysis.mvp.level} · Total rounds: ${analysis.totalRounds}`, `当前级牌：${analysis.mvp.level} · 总局数：${analysis.totalRounds}`), 106, 426);
  ctx.fillStyle = "#f4fff9";
  ctx.font = "29px system-ui, sans-serif";
  wrapCanvasText(ctx, analysis.joke, 104, 468, 850, 36, 2);

  drawStatPill(ctx, copy("Dealer wins", "庄家胜场"), String(analysis.closer.dealerWins), 64, 570, 292);
  drawStatPill(ctx, copy("Friend wins", "朋友助攻"), String(analysis.bestFriend.friendWins), 394, 570, 292);
  drawStatPill(ctx, copy("Takeover heat", "上台热度"), String(analysis.takeoverArtist.takeoverWins), 724, 570, 292);

  drawRoundRect(ctx, 64, 704, 952, 480, 30);
  ctx.fillStyle = "rgba(3, 31, 24, 0.74)";
  ctx.fill();
  ctx.fillStyle = "#f6bf32";
  ctx.font = "800 36px system-ui, sans-serif";
  ctx.fillText(copy("Leaderboard", "排行榜"), 104, 764);

  const rowStart = 820;
  const rowHeight = Math.min(44, Math.max(33, 326 / Math.max(analysis.leaderboard.length, 1)));
  const nameFontSize = rowHeight < 42 ? 22 : 29;
  const detailFontSize = rowHeight < 42 ? 18 : 23;
  analysis.leaderboard.forEach((player, index) => {
    const y = rowStart + index * rowHeight;
    const avatar = getAvatar(player.playerId);
    const rowTop = y - rowHeight + 14;
    ctx.fillStyle = index % 2 === 0 ? "rgba(255,255,255,0.045)" : "rgba(255,255,255,0.018)";
    drawRoundRect(ctx, 92, rowTop, 880, rowHeight - 6, 14);
    ctx.fill();
    if (index > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(112, rowTop - 5);
      ctx.lineTo(952, rowTop - 5);
      ctx.stroke();
    }
    ctx.fillStyle = avatar.bg;
    ctx.beginPath();
    ctx.arc(122, y - 8, Math.min(20, rowHeight * 0.38), 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ["#f6bf32", "#dce7e2", "#d59b5a"][index] || "#8fb9ab";
    ctx.font = `800 ${detailFontSize}px system-ui, sans-serif`;
    ctx.fillText(`#${index + 1}`, 162, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = `800 ${nameFontSize}px system-ui, sans-serif`;
    ctx.fillText(player.name, 224, y, 230);
    ctx.fillStyle = "#a9c9bd";
    ctx.font = `${detailFontSize}px system-ui, sans-serif`;
    ctx.fillText(copy(
      `Lv ${player.level} · D${player.dealerWins} · F${player.friendWins} · T${player.takeoverWins}`,
      `级牌 ${player.level} · 庄家 ${player.dealerWins} · 朋友 ${player.friendWins} · 上台 ${player.takeoverWins}`
    ), 500, y, 470);
  });

  drawRoundRect(ctx, 64, 1220, 952, 550, 30);
  ctx.fillStyle = "rgba(3, 31, 24, 0.60)";
  ctx.fill();
  ctx.fillStyle = "#f6bf32";
  ctx.font = "800 36px system-ui, sans-serif";
  ctx.fillText(copy("Table Gossip", "牌桌小作文"), 104, 1278);
  ctx.fillStyle = "#d8ffe9";
  ctx.font = "33px system-ui, sans-serif";
  let gossipY = 1338;
  const closerLines = [
    copy(`${analysis.closer.name} held the dealer seat like it came with a tiny throne.`, `${analysis.closer.name} 坐庄像坐小王座，稳得很有统治欲。`),
    copy(`${analysis.closer.name} guarded the dealer seat with calm hands and very selective generosity.`, `${analysis.closer.name} 守庄守得手很稳，慷慨程度则相当挑人。`),
    copy(`${analysis.closer.name} treated the dealer seat like reserved parking: available, but mostly for them.`, `${analysis.closer.name} 把庄位打成了专属车位：理论上大家都能坐，实际主要是 TA。`),
    copy(`${analysis.closer.name} kept returning to the dealer seat with the confidence of someone who paid the deposit.`, `${analysis.closer.name} 反复回到庄位，气势像已经付过押金。`),
    copy(`${analysis.closer.name} made the dealer seat look comfortable, which is usually how trouble starts.`, `${analysis.closer.name} 把庄位坐得很舒服，而麻烦通常就是这样开始的。`),
    copy(`${analysis.closer.name} held court as dealer and somehow made it feel like official policy.`, `${analysis.closer.name} 坐庄坐出了开会气质，仿佛这是官方政策。`),
    copy(`${analysis.closer.name} kept the dealer badge close and the table's optimism at a reasonable distance.`, `${analysis.closer.name} 把庄家标识握得很紧，也把全桌乐观情绪控制在合理距离。`),
    copy(`${analysis.closer.name} turned dealer wins into a routine, which is rude behavior dressed as consistency.`, `${analysis.closer.name} 把坐庄胜利打成日常，稳定得有点没礼貌。`),
  ];
  const friendLines = [
    copy(`${analysis.bestFriend.name} was the friend every dealer wants: useful, suspiciously cheerful, and hard to blame.`, `${analysis.bestFriend.name} 是每个庄家都想要的朋友：好用、乐观，而且锅还甩不到 TA 身上。`),
    copy(`${analysis.bestFriend.name} brought premium friend energy: helpful at the exact moment it became inconvenient for everyone else.`, `${analysis.bestFriend.name} 贡献了高级朋友能量：帮得刚刚好，也刚好让别人难受。`),
    copy(`${analysis.bestFriend.name} showed up as a friend and immediately became a small operational problem for the other side.`, `${analysis.bestFriend.name} 一当朋友就变成对面的小型运营难题。`),
    copy(`${analysis.bestFriend.name} made friendship look less emotional and more like a tactical asset.`, `${analysis.bestFriend.name} 把“朋友”打得不像感情关系，更像战术资产。`),
    copy(`${analysis.bestFriend.name} provided friend support with the efficiency of a very polite conspiracy.`, `${analysis.bestFriend.name} 提供朋友支援的效率，像一场非常礼貌的合谋。`),
    copy(`${analysis.bestFriend.name} kept appearing on the helpful side of history, which was convenient and suspicious.`, `${analysis.bestFriend.name} 总是站在“有帮助”的历史一边，方便，而且可疑。`),
    copy(`${analysis.bestFriend.name} turned friend duty into a performance review and quietly passed with honors.`, `${analysis.bestFriend.name} 把朋友职责打成绩效考核，还悄悄拿了优秀。`),
    copy(`${analysis.bestFriend.name} helped just enough to look generous and just too much to be forgiven.`, `${analysis.bestFriend.name} 帮得足够大方，也刚好大方到让人不太想原谅。`),
  ];
  const takeoverLines = [
    copy(`${analysis.takeoverArtist.name} helped flip the table momentum ${analysis.takeoverArtist.takeoverWins} time(s). Politely terrifying.`, `${analysis.takeoverArtist.name} 帮对手翻盘 ${analysis.takeoverArtist.takeoverWins} 次，礼貌但可怕。`),
    copy(`${analysis.takeoverArtist.name} treated takeover chances like open doors and walked through ${analysis.takeoverArtist.takeoverWins} of them.`, `${analysis.takeoverArtist.name} 看到上台机会就像看到门开了，直接走进去 ${analysis.takeoverArtist.takeoverWins} 次。`),
    copy(`${analysis.takeoverArtist.name} changed the table temperature ${analysis.takeoverArtist.takeoverWins} time(s), which was rude but statistically impressive.`, `${analysis.takeoverArtist.name} 改变牌桌气温 ${analysis.takeoverArtist.takeoverWins} 次，不太礼貌，但数据很好看。`),
    copy(`${analysis.takeoverArtist.name} specialized in momentum theft tonight: ${analysis.takeoverArtist.takeoverWins} clean takeover moment(s).`, `${analysis.takeoverArtist.name} 今晚专攻气势转移：漂亮上台 ${analysis.takeoverArtist.takeoverWins} 次。`),
    copy(`${analysis.takeoverArtist.name} kept finding takeover windows and opening them with unnecessary confidence.`, `${analysis.takeoverArtist.name} 总能找到上台窗口，而且开窗时自信得有点多余。`),
    copy(`${analysis.takeoverArtist.name} made ${analysis.takeoverArtist.takeoverWins} takeover moment(s) feel less like chance and more like paperwork.`, `${analysis.takeoverArtist.name} 把 ${analysis.takeoverArtist.takeoverWins} 次上台打得不像机会，更像流程审批。`),
    copy(`${analysis.takeoverArtist.name} interrupted the dealer-side comfort ${analysis.takeoverArtist.takeoverWins} time(s), for balance and mild emotional damage.`, `${analysis.takeoverArtist.name} 打断庄家方舒适区 ${analysis.takeoverArtist.takeoverWins} 次，主打平衡和轻微心理冲击。`),
    copy(`${analysis.takeoverArtist.name} brought takeover energy with the timing of someone arriving exactly when the room gets quiet.`, `${analysis.takeoverArtist.name} 带着上台能量精准出现，像房间刚安静 TA 就推门进来。`),
  ];
  const noTakeoverLines = [
    copy("No major takeover storm tonight. The table remained emotionally insured.", "今晚没有大型上台风暴，牌桌情绪险暂时不用理赔。"),
    copy("No serious takeover drama tonight; the scoreboard chose order over chaos.", "今晚没有严肃上台大戏，计分板选择了秩序而不是混乱。"),
    copy("Takeover energy stayed politely low, which is either discipline or everyone being tired.", "上台能量礼貌偏低，可能是纪律，也可能是大家累了。"),
    copy("The takeover department filed almost no paperwork tonight. Surprisingly peaceful.", "今晚“上台部门”几乎没交材料，意外和平。"),
    copy("The table avoided a takeover spiral tonight. Very mature. Almost suspiciously mature.", "今晚牌桌避开了上台螺旋。很成熟，成熟得有点可疑。"),
    copy("Takeover drama stayed in draft mode, never quite brave enough to publish.", "上台戏码一直停在草稿箱，始终没勇敢发布。"),
    copy("No one really weaponized the takeover lane tonight, and the scoreboard looked relieved.", "今晚没人认真武器化上台路线，计分板看起来松了口气。"),
    copy("The takeover plot remained quiet, possibly waiting for a sequel.", "上台剧情保持安静，可能是在等续集。"),
  ];
  const pressureLines = [
    copy(`${analysis.pressureArtist.name} collected ${analysis.pressureArtist.opponentPoints} opponent-side points, a steady little tax on dealer comfort.`, `${analysis.pressureArtist.name} 在对手方累计拿到 ${analysis.pressureArtist.opponentPoints} 分，稳定给庄家舒适区收税。`),
    copy(`${analysis.pressureArtist.name} stacked up ${analysis.pressureArtist.opponentPoints} pressure points from across the table. Quietly rude.`, `${analysis.pressureArtist.name} 在对面攒了 ${analysis.pressureArtist.opponentPoints} 分压力值，安静但很冒犯。`),
    copy(`${analysis.pressureArtist.name} did not always take over, but ${analysis.pressureArtist.opponentPoints} opponent points kept the room alert.`, `${analysis.pressureArtist.name} 不一定每次上台，但 ${analysis.pressureArtist.opponentPoints} 对手分足够让全桌坐直。`),
    copy(`${analysis.pressureArtist.name} put ${analysis.pressureArtist.opponentPoints} points into the dealer-side stress account.`, `${analysis.pressureArtist.name} 往庄家方压力账户里存了 ${analysis.pressureArtist.opponentPoints} 分。`),
    copy(`${analysis.pressureArtist.name} built ${analysis.pressureArtist.opponentPoints} opponent points like a slow elevator with suspicious music.`, `${analysis.pressureArtist.name} 把对手分慢慢堆到 ${analysis.pressureArtist.opponentPoints}，像一部配乐可疑的电梯。`),
    copy(`${analysis.pressureArtist.name} brought ${analysis.pressureArtist.opponentPoints} points of background pressure, the kind that makes dealers count twice.`, `${analysis.pressureArtist.name} 带来 ${analysis.pressureArtist.opponentPoints} 分背景压力，属于让庄家忍不住多算一遍的那种。`),
    copy(`${analysis.pressureArtist.name} made ${analysis.pressureArtist.opponentPoints} opponent points feel less like scoring and more like persistent weather.`, `${analysis.pressureArtist.name} 把 ${analysis.pressureArtist.opponentPoints} 对手分打得不像得分，更像持续性天气。`),
    copy(`${analysis.pressureArtist.name} kept tapping the dealer side for ${analysis.pressureArtist.opponentPoints} total points. Annoying, but well documented.`, `${analysis.pressureArtist.name} 对庄家方持续敲出 ${analysis.pressureArtist.opponentPoints} 分，烦人，但证据充分。`),
  ];
  const gossip = [
    pickRecapLine(closerLines, analysis.closer.name.length + analysis.totalRounds + analysis.closer.dealerWins),
    pickRecapLine(friendLines, analysis.bestFriend.name.length + analysis.bestFriend.friendWins + analysis.mvp.gains),
    analysis.takeoverArtist.takeoverWins
      ? pickRecapLine(takeoverLines, analysis.takeoverArtist.name.length + analysis.takeoverArtist.takeoverWins + analysis.totalRounds)
      : pickRecapLine(noTakeoverLines, analysis.totalRounds + analysis.mvp.levelRank),
    pickRecapLine(pressureLines, analysis.pressureArtist.name.length + analysis.pressureArtist.opponentPoints + analysis.totalRounds),
  ];
  gossip.forEach((line) => {
    ctx.fillStyle = "#f6bf32";
    ctx.beginPath();
    ctx.arc(114, gossipY - 11, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d8ffe9";
    gossipY = wrapCanvasText(ctx, line, 136, gossipY, 800, 38, 2) + 8;
  });

  ctx.fillStyle = "#a9c9bd";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(copy("Share responsibly. Brag irresponsibly.", "理性分享，放肆炫耀。"), 72, 1842);
  ctx.textAlign = "right";
  ctx.fillText(copy("July Poker · Upgrade Poker Scorekeeper", "七月牌局 · 找朋友计分器"), 1008, 1842);
  ctx.textAlign = "left";

  await shareOrDownloadCanvas(canvas);
}

function renderRulesScreen() {
  const activeDeckCount = state.game?.deckCount || state.deckCount;
  return `
    <main class="page rules-page">
      <header class="topbar">
        <button class="icon-button" data-action="close-rules">‹</button>
        <div>
          <div class="eyebrow">${copy("Rules and Settings", "规则与设置")}</div>
          <h1>${copy("Table Rules", "牌桌规则")}</h1>
        </div>
        ${renderLanguageToggle()}
      </header>

      <section class="panel">
        <h2>${copy("Score Limits", "分数范围")}</h2>
        <p class="rule-line">${copy(`${activeDeckCount} decks · maximum opponent score ${getMaxScore(activeDeckCount)}`, `${activeDeckCount} 副牌 · 对手最高分 ${getMaxScore(activeDeckCount)}`)}</p>
        <p class="rule-line">${copy("Each deck has up to 100 points. Scores must be entered in 5-point increments.", "每副牌最多 100 分。分数必须是 5 的倍数。")}</p>
      </section>

      <section class="panel">
        <h2>${copy("Level Rules", "级牌规则")}</h2>
        <p class="rule-line">${copy("10 / K / A cannot be skipped unless already completed.", "10 / K / A 不能跳过，除非已经完成。")}</p>
        <p class="rule-line">${copy("A player completes 10 / K / A by winning on the dealer side, either as the dealer or as the dealer's friend.", "玩家作为庄家或庄家的朋友，在庄家方获胜时完成 10 / K / A。")}</p>
      </section>

      <section class="panel">
        <h2>${copy("Round Actions", "牌局操作")}</h2>
        <p class="rule-line">${copy("Undo restores the table to the exact state before the last submitted round.", "撤销会恢复到上一局提交前的状态。")}</p>
        <p class="rule-line">${copy("Reset clears the current game and returns to setup while keeping players and seating.", "重置会清空当前牌局并回到设置，保留玩家和座位。")}</p>
      </section>

      ${state.game ? `
        <section class="action-bar stacked">
          <button class="secondary" data-action="undo-round" ${state.game.undoStack?.length ? "" : "disabled"}>${copy("Undo Last Round", "撤销上一局")}</button>
          <button class="secondary danger" data-action="reset-game">${copy("Reset Game", "重置牌局")}</button>
        </section>
      ` : ""}
    </main>
  `;
}

function bindEvents() {
  document.querySelectorAll("[data-action]").forEach((el) => {
    el.addEventListener("click", (event) => {
      const target = event.currentTarget;
      const action = target.dataset.action;
      const id = target.dataset.id;
      const value = target.dataset.value;
      const index = Number(target.dataset.index);

      if (action === "set-language") { state.language = value === "zh" ? "zh" : "en"; render(); }
      if (action === "toggle-player-section") { state.isPlayerSelectExpanded = !state.isPlayerSelectExpanded; render(); }
      if (action === "toggle-player") togglePlayer(id);
      if (action === "add-player") addNewPlayer();
      if (action === "seat-left") moveSeat(index, index - 1);
      if (action === "seat-right") moveSeat(index, index + 1);
      if (action === "set-decks") {
        state.deckCount = Number(value);
        state.pending.opponentScore = Math.min(Number(state.pending.opponentScore) || 0, getMaxScore(state.deckCount));
        render();
      }
      if (action === "start-game") createGame();
      if (action === "back-setup") { if (confirm(copy("Return to setup? Current game will stay saved.", "返回设置？当前牌局会继续保存。"))) { state.screen = "setup"; render(); } }
      if (action === "open-rules") { state.pending.returnScreen = state.screen; state.screen = "rules"; render(); }
      if (action === "close-rules") { state.screen = state.pending.returnScreen || "setup"; state.pending.returnScreen = ""; render(); }
      if (action === "undo-round") undoLastRound();
      if (action === "reset-game") resetGame();
      if (action === "export-history-image") exportHistoryImage();
      if (action === "set-first-dealer") { state.pending.firstDealerId = id; state.pending.partnerIds = state.pending.partnerIds.filter((p) => p !== id); render(); }
      if (action === "toggle-partner") togglePartner(id);
      if (action === "score-minus") { updateOpponentScore(-5); }
      if (action === "score-plus") { updateOpponentScore(5); }
      if (action === "submit-round") submitRound();
    });
  });

  const newPlayerInput = document.querySelector("#new-player-input");
  if (newPlayerInput) {
    newPlayerInput.addEventListener("input", (e) => state.pending.newPlayerName = e.target.value);
    newPlayerInput.addEventListener("keydown", (e) => { if (e.key === "Enter") addNewPlayer(); });
  }

  const scoreInput = document.querySelector("#score-input");
  if (scoreInput) {
    scoreInput.addEventListener("input", (e) => {
      const value = Number(e.target.value);
      state.pending.opponentScore = Number.isFinite(value) ? value : 0;
    });
  }

}

function updateOpponentScore(delta) {
  const current = Number(state.pending.opponentScore);
  const base = Number.isFinite(current) ? current : 0;
  const maxScore = getMaxScore(state.game.deckCount);
  state.pending.opponentScore = Math.min(maxScore, Math.max(0, base + delta));
  render();
}

function togglePartner(id) {
  const dealerId = state.game.currentDealerId || state.pending.firstDealerId;
  if (id === dealerId) return;
  const partnerCount = getRequiredPartnerCount(state.game.seatingOrder.length);
  const selected = state.pending.partnerIds.includes(id);
  if (selected) {
    state.pending.partnerIds = state.pending.partnerIds.filter((p) => p !== id);
  } else if (state.pending.partnerIds.length < partnerCount) {
    state.pending.partnerIds.push(id);
  } else {
    alert(copy(`Only ${partnerCount} partner(s) are allowed.`, `最多只能选择 ${partnerCount} 位朋友。`));
  }
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[char]));
}

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}
