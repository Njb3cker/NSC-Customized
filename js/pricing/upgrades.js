const PARTY_PLUS_DIVISOR = 1.125;
const NOTHING_CURSE_MULTIPLIER = 0.85;

function getEffectivePartySize(playerCount, partySize) {
  if (playerCount > 8) {
    return 'party-plus';
  }

  return partySize;
}

export function shouldApplySoloPricing(playerCount, partySize) {
  return getEffectivePartySize(playerCount, partySize) === 'solo';
}

function shouldApplyPartyPlusDiscount(playerCount, partySize) {
  return getEffectivePartySize(playerCount, partySize) === 'party-plus' && playerCount > 1;
}

// Price of the next stack of an upgrade, before player-count scaling and discounts.
export function getBaseUpgradeCost(upgrade, owned, { playerCount, difficulty, partySize }) {
  const isSolo = shouldApplySoloPricing(playerCount, partySize);
  const isCasual = difficulty === 'Casual';
  const isExtreme = difficulty === 'Extreme';

  let stackCosts = upgrade.stackCosts;

  if (isSolo && Array.isArray(upgrade.stackCostsSolo)) {
    stackCosts = upgrade.stackCostsSolo;
  } else if (isCasual && Array.isArray(upgrade.stackCostsCasual)) {
    stackCosts = upgrade.stackCostsCasual;
  } else if (isExtreme && Array.isArray(upgrade.stackCostsExtreme)) {
    stackCosts = upgrade.stackCostsExtreme;
  }

  if (Array.isArray(stackCosts) && owned < stackCosts.length) {
    return stackCosts[owned];
  }

  if (isSolo && upgrade.costSolo != null) {
    return upgrade.costSolo;
  }

  if (isCasual) {
    return upgrade.costCasual ?? upgrade.cost;
  }

  if (isExtreme) {
    return upgrade.costExtreme ?? upgrade.cost;
  }

  return upgrade.cost;
}

function applySoloPricing(price, upgrade, { playerCount, partySize }) {
  if (!shouldApplySoloPricing(playerCount, partySize)) {
    return price;
  }

  // Upgrades with explicit solo prices already have the discount baked in.
  if (Array.isArray(upgrade.stackCostsSolo) || upgrade.costSolo != null) {
    return price;
  }

  const soloDiscount = upgrade.soloDiscount ?? 0;
  return price * (1 - soloDiscount / 100);
}

// Final in-game price of the next stack of an upgrade.
export function getAdjustedCost(upgrade, owned, settings) {
  const { playerCount, partySize, nothingCurse } = settings;

  let price = getBaseUpgradeCost(upgrade, owned, settings);

  price = applySoloPricing(price, upgrade, settings);
  price *= Math.sqrt(playerCount);

  if (shouldApplyPartyPlusDiscount(playerCount, partySize)) {
    price /= PARTY_PLUS_DIVISOR;
  }

  if (nothingCurse) {
    price *= NOTHING_CURSE_MULTIPLIER;
  }

  return Math.ceil(price);
}
