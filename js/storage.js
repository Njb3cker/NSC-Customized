import { getCurrentSettings, applySettings } from './settings.js';
import { ownedUpgrades, restoreOwnedUpgrades } from './state.js';

const STORAGE_KEY = 'nullscape-shop-calculator-state';

export function saveState() {
  const settings = getCurrentSettings();

  const state = {
    currentMoney: settings.currentMoney,
    currentLevel: settings.currentLevel,
    difficulty: settings.difficulty,
    playerCount: settings.playerCount,
    partySize: settings.partySize,
    nothingCurse: settings.nothingCurse,
    dependenceDelusion: settings.dependenceDelusion,
    arroganceConceitDelusion: settings.arroganceConceitDelusion,
    ownedUpgrades: Array.from(ownedUpgrades.entries()),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Could not save state:', error);
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return;
    }

    const state = JSON.parse(raw);

    applySettings(state);
    restoreOwnedUpgrades(state.ownedUpgrades);
  } catch (error) {
    console.warn('Could not load state:', error);
  }
}

export function clearSavedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Could not clear saved state:', error);
  }
}
