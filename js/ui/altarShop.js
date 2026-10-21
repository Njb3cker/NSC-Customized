import { altarShopGrid, altarShopMoney } from '../dom.js';
import { getCurrentSettings } from '../settings.js';
import { selectedAltars } from '../state.js';
import { getAltarPreviewCost, getCombinedSelectedCost, getCombinedRemainingMoney, toggleAltarItem } from '../cart.js';

const ALTAR_IMAGE = 'assets/more-altars.png';
const LEVELS_SHOWN = 5;

// Protection altars for the current level and the next few.
export function renderAltarShop(settings, onChange) {
  const startLevel = Math.max(1, settings.currentLevel);
  const combinedSelectedCost = getCombinedSelectedCost(settings);

  altarShopGrid.innerHTML = '';

  for (let offset = 0; offset < LEVELS_SHOWN; offset += 1) {
    const level = startLevel + offset;
    const selected = selectedAltars.has(level);
    const cost = selected ? selectedAltars.get(level) : getAltarPreviewCost(level, settings);
    const isAffordable = selected || combinedSelectedCost + cost <= settings.currentMoney;

    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'shop-card altar-card';
    card.dataset.level = String(level);
    card.dataset.cost = String(cost);

    if (selected) {
      card.classList.add('is-selected');
    } else if (!isAffordable) {
      card.classList.add('is-unaffordable');
    }

    card.innerHTML = `
      <div class="shop-card-image">
        <img src="${ALTAR_IMAGE}" alt="Protection Altar" loading="lazy">
      </div>
      <div class="shop-card-content">
        <h3>Level ${level}</h3>
        <strong><span>${cost} GG</span></strong>
      </div>
    `;

    card.addEventListener('click', () => {
      toggleAltarItem(level, getCurrentSettings());
      onChange();
    });

    altarShopGrid.appendChild(card);
  }

  altarShopMoney.textContent = `Golden Gifts left: ${getCombinedRemainingMoney(settings)}`;
}
