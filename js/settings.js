import {
  currentMoneyInput,
  currentLevelInput,
  difficultySelect,
  playerCountInput,
  partySizeSelect,
  nothingCurseInput,
} from './dom.js';

function readPlayerCount() {
  return Math.max(1, Number(playerCountInput.value) || 1);
}

// Snapshot of the run settings from the inputs at the top of the page.
export function getCurrentSettings() {
  return {
    currentMoney: Number(currentMoneyInput.value) || 0,
    currentLevel: Number(currentLevelInput.value) || 1,
    difficulty: difficultySelect.value,
    playerCount: readPlayerCount(),
    partySize: partySizeSelect.value,
    nothingCurse: nothingCurseInput.checked,
  };
}

export function applySettings(state) {
  setSharedGoldenGifts(state.currentMoney ?? 0);
  currentLevelInput.value = state.currentLevel ?? '';
  difficultySelect.value = state.difficulty ?? 'Standard';
  partySizeSelect.value = state.partySize ?? 'solo';
  playerCountInput.value = state.playerCount ?? '';
  nothingCurseInput.checked = Boolean(state.nothingCurse);
}

export function setSharedGoldenGifts(value) {
  currentMoneyInput.value = String(Math.max(0, value));
}

export function setCurrentLevel(level) {
  currentLevelInput.value = level;
}

export function resetRunSettings() {
  setSharedGoldenGifts(0);
  currentLevelInput.value = '3';
  nothingCurseInput.checked = false;
}

export function isSoloOrDuoSelected() {
  return partySizeSelect.value === 'solo' || partySizeSelect.value === 'duo';
}

// Bump the party size up when the player count no longer fits it.
export function syncPartySizeWithPlayerCount() {
  const playerCount = readPlayerCount();
  const currentPartySize = partySizeSelect.value;

  if (playerCount > 8 && currentPartySize === 'party') {
    partySizeSelect.value = 'party-plus';
    return;
  }

  if (playerCount > 1 && currentPartySize === 'solo') {
    partySizeSelect.value = 'duo';
  }

  if (playerCount > 2 && currentPartySize === 'duo') {
    partySizeSelect.value = 'party';
  }
}
