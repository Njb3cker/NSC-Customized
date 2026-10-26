import { tooltip } from '../dom.js';
import { getBaseUpgradeCost } from '../pricing/upgrades.js';
import { getEffectiveMinLevel, getPrerequisiteText, getExclusiveRivals, getEnemyRequirements } from '../rules.js';
import { getCurrentSettings } from '../settings.js';
import { ownedUpgrades, getOwnedCount } from '../state.js';
import { getUpgradeCost } from '../cart.js';

const CURSOR_OFFSET = 14;

let activeUpgrade = null;

export function showTooltip(upgrade) {
  const settings = getCurrentSettings();
  const owned = getOwnedCount(upgrade.name);
  const baseCost = getBaseUpgradeCost(upgrade, owned, settings);
  const adjustedCost = getUpgradeCost(upgrade, settings);
  const prerequisiteText = getPrerequisiteText(upgrade, settings, ownedUpgrades);
  const rivals = getExclusiveRivals(upgrade.name);
  const enemies = getEnemyRequirements(upgrade.name);

  tooltip.innerHTML = `
    <h3>${upgrade.name}</h3>
    <p><strong>Base cost:</strong> ${baseCost}</p>
    <p><strong>Cost:</strong> ${adjustedCost}</p>
    <p><strong>Owned:</strong> ${owned}/${upgrade.max}</p>
    <p><strong>Max:</strong> ${upgrade.max}</p>
    <p><strong>Min level:</strong> ${getEffectiveMinLevel(upgrade, settings.difficulty)}</p>
    ${prerequisiteText ? `<p><strong>Requirement:</strong> ${prerequisiteText}</p>` : ''}
    ${enemies.length ? `<p><strong>Requires enemy:</strong> ${enemies.join(', ')}</p>` : ''}
    ${rivals.length ? `<p><strong>Exclusive with:</strong> ${rivals.join(', ')}</p>` : ''}
    <p>${upgrade.description}</p>
  `;

  tooltip.hidden = false;
  activeUpgrade = upgrade;
}

export function hideTooltip() {
  tooltip.hidden = true;
  activeUpgrade = null;
}

// Re-render the open tooltip so its numbers follow the latest settings.
export function refreshTooltip() {
  if (activeUpgrade) {
    showTooltip(activeUpgrade);
  }
}

export function moveTooltip(event) {
  let x = event.clientX + CURSOR_OFFSET;
  let y = event.clientY + CURSOR_OFFSET;

  const tooltipRect = tooltip.getBoundingClientRect();

  if (x + tooltipRect.width > window.innerWidth) {
    x = event.clientX - tooltipRect.width - CURSOR_OFFSET;
  }

  if (y + tooltipRect.height > window.innerHeight) {
    y = event.clientY - tooltipRect.height - CURSOR_OFFSET;
  }

  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}
