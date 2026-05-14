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

function formatText(template, values = {}) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template
  );
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
    ? { ...incoming.game, undoStack: incoming.game.undoStack || [] }
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  state.pending.partnerIds = [];
  state.pending.firstDealerId = "";
  state.pending.opponentScore = 0;
  state.lastResult = roundRecord;
  render();
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
          <div class="eyebrow">${copy("Mobile PWA Prototype", "手机 PWA 原型")}</div>
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
        ${renderTablePreview(state.seatingOrder, { editable: false })}
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
  const editable = options.editable;
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

  return `
    <main class="page game-page">
      <header class="topbar game-topbar">
        <button class="icon-button" data-action="back-setup">‹</button>
        <div>
          <div class="eyebrow">${copy(`Round ${game.roundNumber} · ${game.deckCount} decks · ${takeoverScore} takeover`, `第 ${game.roundNumber} 局 · ${game.deckCount} 副牌 · ${takeoverScore} 上台`)}</div>
          <h1>${dealerId ? escapeHtml(currentDealerLabel) : currentDealerLabel} <span class="level-pill">${copy(`Level ${currentLevel}`, `级牌 ${currentLevel}`)}</span></h1>
        </div>
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
  const totalRounds = game.history.length;
  const topChanges = stats.filter((item) => item.gains > 0).slice(0, 4);

  const jokes = [
    copy(`${mvp.name} climbed to ${mvp.level} with the calm face of someone who absolutely did not just steal the table's snacks.`, `${mvp.name} 一路爬到 ${mvp.level}，表情淡定得像刚刚偷吃零食的人不是自己。`),
    copy(`${mvp.name} played like the scorekeeper owed them rent: tidy, persistent, and mildly alarming.`, `${mvp.name} 打得像计分器欠 TA 房租：稳定、执着，还有点吓人。`),
    copy(`${mvp.name} turned small wins into a whole staircase. The table has requested a ladder inspection.`, `${mvp.name} 把小胜攒成楼梯，牌桌已经申请安全检查。`),
    copy(`${mvp.name} reached ${mvp.level}; everyone else has been advised to shuffle with more sincerity.`, `${mvp.name} 到了 ${mvp.level}，其他人被建议洗牌时更虔诚一点。`),
  ];

  return {
    totalRounds,
    mvp,
    closer,
    bestFriend,
    takeoverArtist,
    topChanges,
    joke: jokes[Math.abs(mvp.name.length + totalRounds + mvp.levelRank) % jokes.length],
    leaderboard: stats.slice(0, 6),
  };
}

function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
  const source = String(text);
  const words = source.includes(" ") ? source.split(" ") : [...source];
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const testLine = source.includes(" ") && line ? `${line} ${word}` : `${line}${word}`;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  });
  if (line) lines.push(line);

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
  drawRoundRect(ctx, x, y, width, 72, 18);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.fill();
  ctx.fillStyle = "#a9c9bd";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(label, x + 20, y + 28);
  ctx.fillStyle = "#f6bf32";
  ctx.font = "800 28px system-ui, sans-serif";
  ctx.fillText(value, x + 20, y + 58);
}

function exportHistoryImage() {
  const game = state.game;
  if (!game?.history?.length) {
    alert(copy("No history to export yet.", "还没有历史记录可以导出。"));
    return;
  }

  const analysis = buildHistoryAnalysis();
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1520;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, 1080, 1520);
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
  ctx.arc(100, 1320, 240, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f4fff9";
  ctx.font = "900 58px system-ui, sans-serif";
  ctx.fillText(copy("Poker Night Recap", "找朋友战报"), 72, 110);
  ctx.fillStyle = "#a9c9bd";
  ctx.font = "26px system-ui, sans-serif";
  ctx.fillText(copy(
    `${analysis.totalRounds} rounds · ${game.deckCount} decks · generated by Upgrade Poker Scorekeeper`,
    `${analysis.totalRounds} 局 · ${game.deckCount} 副牌 · 找朋友计分器生成`
  ), 74, 154);

  drawRoundRect(ctx, 64, 210, 952, 292, 34);
  ctx.fillStyle = "rgba(255,255,255,0.09)";
  ctx.fill();
  ctx.strokeStyle = "rgba(246,191,50,0.42)";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = "#f6bf32";
  ctx.font = "800 30px system-ui, sans-serif";
  ctx.fillText(copy("Tonight's MVP", "今晚 MVP"), 104, 266);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 72px system-ui, sans-serif";
  ctx.fillText(analysis.mvp.name, 104, 350);
  ctx.fillStyle = "#d8ffe9";
  ctx.font = "32px system-ui, sans-serif";
  ctx.fillText(copy(`Current level: ${analysis.mvp.level} · Total climb: +${analysis.mvp.gains}`, `当前级牌：${analysis.mvp.level} · 总跳级：+${analysis.mvp.gains}`), 106, 402);
  ctx.fillStyle = "#f4fff9";
  ctx.font = "28px system-ui, sans-serif";
  wrapCanvasText(ctx, analysis.joke, 104, 452, 840, 38, 2);

  drawStatPill(ctx, copy("Dealer wins", "庄家胜场"), String(analysis.closer.dealerWins), 64, 536, 292);
  drawStatPill(ctx, copy("Friend wins", "朋友助攻"), String(analysis.bestFriend.friendWins), 394, 536, 292);
  drawStatPill(ctx, copy("Takeover heat", "上台热度"), String(analysis.takeoverArtist.takeoverWins), 724, 536, 292);

  drawRoundRect(ctx, 64, 642, 952, 470, 30);
  ctx.fillStyle = "rgba(3, 31, 24, 0.74)";
  ctx.fill();
  ctx.fillStyle = "#f4fff9";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.fillText(copy("Leaderboard", "排行榜"), 104, 704);

  analysis.leaderboard.forEach((player, index) => {
    const y = 760 + index * 54;
    const avatar = getAvatar(player.playerId);
    ctx.fillStyle = avatar.bg;
    ctx.beginPath();
    ctx.arc(122, y - 8, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f6bf32";
    ctx.font = "800 24px system-ui, sans-serif";
    ctx.fillText(`#${index + 1}`, 162, y);
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 30px system-ui, sans-serif";
    ctx.fillText(player.name, 224, y);
    ctx.fillStyle = "#a9c9bd";
    ctx.font = "24px system-ui, sans-serif";
    ctx.fillText(copy(
      `Level ${player.level} · +${player.gains} · dealer ${player.dealerWins} · friend ${player.friendWins}`,
      `级牌 ${player.level} · +${player.gains} · 庄家 ${player.dealerWins} · 朋友 ${player.friendWins}`
    ), 500, y);
  });

  ctx.fillStyle = "#f4fff9";
  ctx.font = "800 34px system-ui, sans-serif";
  ctx.fillText(copy("Table Gossip", "牌桌小作文"), 104, 1158);
  ctx.fillStyle = "#d8ffe9";
  ctx.font = "27px system-ui, sans-serif";
  let gossipY = 1210;
  const gossip = [
    copy(`${analysis.closer.name} held the dealer seat like it came with a tiny throne.`, `${analysis.closer.name} 坐庄像坐小王座，稳得很有统治欲。`),
    copy(`${analysis.bestFriend.name} was the friend every dealer wants: useful, suspiciously cheerful, and hard to blame.`, `${analysis.bestFriend.name} 是每个庄家都想要的朋友：好用、乐观，而且锅还甩不到 TA 身上。`),
    analysis.takeoverArtist.takeoverWins
      ? copy(`${analysis.takeoverArtist.name} helped flip the table momentum ${analysis.takeoverArtist.takeoverWins} time(s). Politely terrifying.`, `${analysis.takeoverArtist.name} 帮对手翻盘 ${analysis.takeoverArtist.takeoverWins} 次，礼貌但可怕。`)
      : copy("No major takeover storm tonight. The table remained emotionally insured.", "今晚没有大型上台风暴，牌桌情绪险暂时不用理赔。"),
  ];
  gossip.forEach((line) => {
    gossipY = wrapCanvasText(ctx, line, 104, gossipY, 850, 36, 2) + 12;
  });

  ctx.fillStyle = "#a9c9bd";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText(copy("Share responsibly. Brag irresponsibly.", "理性分享，放肆炫耀。"), 104, 1450);

  const link = document.createElement("a");
  link.download = `${isZh() ? "zhaopengyou-zhanbao" : "poker-night-recap"}-${Date.now()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
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
      if (action === "score-minus") { state.pending.opponentScore = Math.max(0, Number(state.pending.opponentScore) - 5); render(); }
      if (action === "score-plus") { state.pending.opponentScore = Math.min(getMaxScore(state.game.deckCount), Number(state.pending.opponentScore) + 5); render(); }
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
    scoreInput.addEventListener("input", (e) => state.pending.opponentScore = Number(e.target.value));
  }

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
