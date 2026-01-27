const OPTION_SELECTOR = '[data-variant-option]';
const DROPDOWN_SELECTOR = '[data-variant-dropdown]';

const setTemporaryDisabled = (button, isLoading) => {
  if (isLoading) {
    if (button.hasAttribute('disabled')) {
      button.dataset.wasDisabled = 'true';
    } else {
      button.dataset.wasDisabled = 'false';
      button.disabled = true;
    }
    return;
  }

  if (button.dataset.wasDisabled === 'false') {
    button.disabled = false;
  }
  delete button.dataset.wasDisabled;
};

const setLoadingState = (component, isLoading) => {
  const label = component.querySelector('[data-variant-label]');
  const defaultLabel = component.dataset.defaultLabel || '';
  const loadingLabel = component.dataset.loadingLabel || defaultLabel;

  if (label) {
    if (isLoading) {
      if (!component.dataset.labelCache) {
        component.dataset.labelCache = label.textContent?.trim() || defaultLabel;
      }
      label.textContent = loadingLabel;
    } else {
      label.textContent = component.dataset.labelCache || defaultLabel;
      delete component.dataset.labelCache;
    }
  }

  component.classList.toggle('is-loading', isLoading);
  component.setAttribute('aria-busy', isLoading ? 'true' : 'false');

  component.querySelectorAll(OPTION_SELECTOR).forEach((button) => {
    if (button instanceof HTMLButtonElement) {
      setTemporaryDisabled(button, isLoading);
    }
  });
};

const updateSelectedState = (dropdown, selectedButton) => {
  const options = dropdown.querySelectorAll(`${OPTION_SELECTOR}[role="option"]`);
  options.forEach((option) => {
    option.setAttribute('aria-selected', option === selectedButton ? 'true' : 'false');
  });

  const label = dropdown.querySelector('[data-variant-label]');
  if (label && selectedButton.dataset.variantLabel) {
    label.textContent = selectedButton.dataset.variantLabel;
  }
};

const handleOptionClick = (event) => {
  const optionButton = event.target.closest(OPTION_SELECTOR);
  if (!(optionButton instanceof HTMLButtonElement)) return;
  if (optionButton.disabled) return;

  const component = optionButton.closest('product-card-variant-buttons');
  if (!(component instanceof HTMLElement)) return;

  const form = optionButton.closest('form');
  if (!(form instanceof HTMLFormElement)) return;

  const variantId = optionButton.dataset.variantId;
  if (!variantId) return;

  const variantInput = form.querySelector('input[name="id"]');
  if (variantInput instanceof HTMLInputElement) {
    variantInput.value = variantId;
    variantInput.removeAttribute('disabled');
  }

  const dropdown = optionButton.closest(DROPDOWN_SELECTOR);
  if (dropdown) {
    updateSelectedState(dropdown, optionButton);
    if (dropdown instanceof HTMLDetailsElement) {
      dropdown.open = false;
    }
  }

  if (component.dataset.hasBundle === 'true') {
    const dialogId = component.dataset.bundleDialogId;
    const dialogComponent = dialogId
      ? document.getElementById(dialogId)
      : component.querySelector('dialog-component');
    if (dialogComponent && typeof dialogComponent.showDialog === 'function') {
      dialogComponent.showDialog();
    }
    return;
  }

  if (typeof form.requestSubmit === 'function') {
    form.requestSubmit();
  } else {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }
};

const handleFormSubmit = (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const component = form.closest('product-card-variant-buttons');
  if (!(component instanceof HTMLElement)) return;

  setLoadingState(component, true);
};

const handleCartUpdate = (event) => {
  const productId = event?.detail?.data?.productId;
  if (!productId) return;

  document
    .querySelectorAll(`product-card-variant-buttons[data-product-id="${productId}"]`)
    .forEach((component) => {
      if (component instanceof HTMLElement) {
        setLoadingState(component, false);

        const dialogComponent = component.querySelector('dialog-component');
        if (dialogComponent && typeof dialogComponent.closeDialog === 'function') {
          dialogComponent.closeDialog();
        }
      }
    });
};

const handleCartError = (event) => {
  const sourceId = event?.detail?.sourceId;
  if (!sourceId) return;

  const form = document.getElementById(sourceId);
  const component = form?.closest('product-card-variant-buttons');
  if (component instanceof HTMLElement) {
    setLoadingState(component, false);
  }
};

document.addEventListener('click', handleOptionClick);
document.addEventListener('submit', handleFormSubmit);
document.addEventListener('cart:update', handleCartUpdate);
document.addEventListener('cart:error', handleCartError);
