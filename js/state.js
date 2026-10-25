// Shared app state. Modules import these objects and mutate them in place.
import { getExclusiveRivals } from './rules.js';

// Item data loaded from upgrades.json / curses.json.
export const catalog = {
  upgrades: [],
  curses: [],
};

// Upgrade name -> number of stacks owned. Saved to localStorage.
export const ownedUpgrades = new Map();

// Shop planning selections (not saved). Altars map level -> cost frozen at selection time.
export const selectedShopItems = new Set();
export const selectedPurificationItems = new Set();
export const selectedAltars = new Map();

export function findUpgrade(name) {
  return catalog.upgrades.find((upgrade) => upgrade.name === name);
}

export function findCurse(name) {
  return catalog.curses.find((curse) => curse.name === name);
}

export function getOwnedCount(upgradeName) {
  return ownedUpgrades.get(upgradeName) ?? 0;
}

export function cycleOwnedCount(upgrade) {
  const currentOwned = getOwnedCount(upgrade.name);
  const nextOwned = currentOwned >= upgrade.max ? 0 : currentOwned + 1;

  if (nextOwned === 0) {
    ownedUpgrades.delete(upgrade.name);
  } else {
    ownedUpgrades.set(upgrade.name, nextOwned);
    getExclusiveRivals(upgrade.name).forEach((name) => ownedUpgrades.delete(name));
  }
}

export function restoreOwnedUpgrades(entries) {
  ownedUpgrades.clear();

  if (!Array.isArray(entries)) {
    return;
  }

  entries.forEach(([name, count]) => {
    if (typeof name === 'string' && typeof count === 'number' && count > 0) {
      ownedUpgrades.set(name, count);
    }
  });
}

function toggleInSet(set, key) {
  if (set.has(key)) {
    set.delete(key);
  } else {
    set.add(key);
  }
}

export function toggleShopItem(upgrade) {
  toggleInSet(selectedShopItems, upgrade.name);

  // Picking one of a mutually exclusive pair drops the other from the picks.
  if (selectedShopItems.has(upgrade.name)) {
    getExclusiveRivals(upgrade.name).forEach((name) => selectedShopItems.delete(name));
  }
}

export function togglePurificationItem(curse) {
  toggleInSet(selectedPurificationItems, curse.name);
}

export function clearSelections() {
  selectedShopItems.clear();
  selectedPurificationItems.clear();
  selectedAltars.clear();
}
