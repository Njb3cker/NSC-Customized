// Prices of the items currently picked across all three shops, and buying them.
import { getAdjustedCost } from './pricing/upgrades.js';
import { getProtectionAltarCost } from './pricing/altars.js';
import { getPurificationCost } from './pricing/purification.js';
import { getShopItems, getNextShopLevel, getMaxStacks } from './rules.js';
import {
  catalog,
  ownedUpgrades,
  selectedShopItems,
  selectedPurificationItems,
  selectedAltars,
  findUpgrade,
  findCurse,
  getOwnedCount,
} from './state.js';

export function getUpgradeCost(upgrade, settings) {
  return getAdjustedCost(upgrade, getOwnedCount(upgrade.name), settings);
}

export function getCurseCost(curse, settings) {
  return getPurificationCost(curse.value ?? 0, settings.currentLevel, settings.playerCount);
}

export function getSelectedShopCost(settings) {
  let total = 0;

  selectedShopItems.forEach((upgradeName) => {
    const upgrade = findUpgrade(upgradeName);

    if (upgrade) {
      total += getUpgradeCost(upgrade, settings);
    }
  });

  return total;
}

export function getSelectedPurificationCost(settings) {
  let total = 0;

  selectedPurificationItems.forEach((curseName) => {
    const curse = findCurse(curseName);

    if (curse) {
      total += getCurseCost(curse, settings);
    }
  });

  return total;
}

export function getSelectedAltarCost() {
  let total = 0;

  selectedAltars.forEach((cost) => {
    total += cost;
  });

  return total;
}

export function getCombinedSelectedCost(settings) {
  return (
    getSelectedShopCost(settings) +
    getSelectedAltarCost() +
    getSelectedPurificationCost(settings)
  );
}

export function getCombinedRemainingMoney(settings) {
  return settings.currentMoney - getCombinedSelectedCost(settings);
}

export function canSelectShopItem(upgrade, settings) {
  if (selectedShopItems.has(upgrade.name)) {
    return true;
  }

  return getCombinedRemainingMoney(settings) >= getUpgradeCost(upgrade, settings);
}

// Price of an altar if it were picked next, based on Golden Gifts left after everything already picked.
export function getAltarPreviewCost(level, settings) {
  return getProtectionAltarCost(level, settings, getCombinedRemainingMoney(settings));
}

export function toggleAltarItem(level, settings) {
  if (selectedAltars.has(level)) {
    selectedAltars.delete(level);
    return;
  }

  selectedAltars.set(level, getAltarPreviewCost(level, settings));
}

// Drop shop picks that are no longer offered (e.g. after changing level or owned upgrades).
export function pruneInvalidShopSelections(settings) {
  const validNames = new Set(getShopItems(catalog.upgrades, settings, ownedUpgrades).map((upgrade) => upgrade.name));

  for (const itemName of selectedShopItems) {
    if (!validNames.has(itemName)) {
      selectedShopItems.delete(itemName);
    }
  }
}

export function canPurchaseSelectedItems(settings) {
  return selectedShopItems.size > 0 && settings.currentMoney >= getSelectedShopCost(settings);
}

// Buys the picked shop upgrades. Returns the Golden Gifts and level to move to, or null if nothing was bought.
export function purchaseSelectedItems(settings) {
  if (!canPurchaseSelectedItems(settings)) {
    return null;
  }

  const totalCost = getSelectedShopCost(settings);

  selectedShopItems.forEach((upgradeName) => {
    const upgrade = findUpgrade(upgradeName);

    if (!upgrade) {
      return;
    }

    const currentOwned = getOwnedCount(upgrade.name);

    if (currentOwned < getMaxStacks(upgrade, settings)) {
      ownedUpgrades.set(upgrade.name, currentOwned + 1);
    }
  });

  selectedShopItems.clear();

  return {
    remainingMoney: settings.currentMoney - totalCost,
    nextLevel: getNextShopLevel(settings.currentLevel),
  };
}
