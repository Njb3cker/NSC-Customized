import { howToUseModal, openHowToUseButton, closeHowToUseButton } from '../dom.js';

function openHowToUseModal() {
  howToUseModal.hidden = false;
  openHowToUseButton.setAttribute('aria-expanded', 'true');
  closeHowToUseButton.focus();
}

function closeHowToUseModal() {
  howToUseModal.hidden = true;
  openHowToUseButton.setAttribute('aria-expanded', 'false');
  openHowToUseButton.focus();
}

export function initHowToUseModal() {
  openHowToUseButton.addEventListener('click', openHowToUseModal);
  closeHowToUseButton.addEventListener('click', closeHowToUseModal);

  howToUseModal.addEventListener('click', (event) => {
    if (event.target === howToUseModal) {
      closeHowToUseModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !howToUseModal.hidden) {
      closeHowToUseModal();
    }
  });
}
