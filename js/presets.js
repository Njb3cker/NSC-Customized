
import { 
  presetSelect,
  playerCountInput,
  currentLevelInput,
  partySizeSelect,
 } from './dom.js';
 import { ownedUpgrades } from './state.js';
 import { isSoloOrDuoSelected } from './settings.js';

export function loadPreset() {
  
    switch (presetSelect.value) {
      case 'default-preset':
        // Solo and duo runs start with a Paycheck.
        if (isSoloOrDuoSelected()) {
          ownedUpgrades.set('Paycheck', 1);
        }
        currentLevelInput.value = '3';
        break;
      case 'solo-preset':
        currentLevelInput.value = '5';
        playerCountInput.value = '1';
        partySizeSelect.value = 'solo';

        ownedUpgrades.set('Adrenaline', 1);
        ownedUpgrades.set('Business License', 1);
        ownedUpgrades.set('Paycheck', 2);
        break;
      case 'duo-preset':
        currentLevelInput.value = '5';
        playerCountInput.value = '2';
        partySizeSelect.value = 'duo';

        ownedUpgrades.set('Business License', 1);
        ownedUpgrades.set('Paycheck', 2);
        break;
      case 'party-preset':
        currentLevelInput.value = '5';
        partySizeSelect.value = 'party';
        if (Number(playerCountInput.value < 3)) {
          playerCountInput.value = '3';
        } else if (Number(playerCountInput.value > 8)) {
          partySizeSelect.value = 'party-plus';
        }

        ownedUpgrades.set('Business License', 1);
        break;
      }
}