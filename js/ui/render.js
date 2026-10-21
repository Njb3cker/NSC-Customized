import { altarShopSection, purificationShopSection, purchaseItemsButton } from '../dom.js';
import { ALTAR_SHOP_MIN_LEVEL, PURIFICATION_SHOP_MIN_LEVEL } from '../rules.js';
import { getCurrentSettings } from '../settings.js';
import { catalog } from '../state.js';
import { pruneInvalidShopSelections, canPurchaseSelectedItems } from '../cart.js';
import { renderOwnedGrid } from './ownedGrid.js';
import { renderShop } from './shop.js';
import { renderAltarShop } from './altarShop.js';
import { renderPurificationShop } from './purificationShop.js';
import { refreshTooltip } from './tooltip.js';

// Redraws the whole page from current state.
// onOwnedChange runs after owned upgrades change (should save); onSelectionChange after shop picks change.
export function renderAll({ onOwnedChange, onSelectionChange }) {
  const settings = getCurrentSettings();

  altarShopSection.classList.toggle('shop-locked', settings.currentLevel < ALTAR_SHOP_MIN_LEVEL);
  purificationShopSection.classList.toggle('shop-locked', settings.currentLevel < PURIFICATION_SHOP_MIN_LEVEL);

  pruneInvalidShopSelections(settings);

  renderOwnedGrid(catalog.upgrades, settings, onOwnedChange);
  renderShop(catalog.upgrades, settings, onSelectionChange);
  renderAltarShop(settings, onSelectionChange);
  renderPurificationShop(catalog.curses, settings, onSelectionChange);

  purchaseItemsButton.disabled = !canPurchaseSelectedItems(settings);

  refreshTooltip();
}
