import { Component } from '@theme/component';

/**
 * Handles bundle selection for metafields bundle blocks.
 * @extends Component
 */
class MetafieldBundle extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('change', this.#handleChange.bind(this));
    this.#syncBundleInput();
  }

  /**
   * @param {Event} event
   */
  #handleChange(event) {
    if (!(event.target instanceof HTMLInputElement)) return;
    if (event.target.type !== 'radio' && event.target.type !== 'checkbox') return;

    this.#updateBundleInput(event.target);
  }

  /**
   * @returns {HTMLInputElement | null}
   */
  #getBundleInput() {
    const input = this.querySelector('input[ref^="metafield-bundle["]');
    return input instanceof HTMLInputElement ? input : null;
  }

  /**
   * @param {HTMLInputElement} target
   */
  #updateBundleInput(target) {
    const bundleInput = this.#getBundleInput();
    if (!bundleInput) return;

    const variantId = target.dataset.variantId || '';

    if (target.type === 'checkbox') {
      if (target.checked) {
        bundleInput.value = variantId;
        bundleInput.disabled = false;
        return;
      }

      const checkedInput = this.querySelector('input[type="checkbox"][data-variant-id]:checked');
      if (checkedInput instanceof HTMLInputElement) {
        bundleInput.value = checkedInput.dataset.variantId || '';
        bundleInput.disabled = false;
      } else {
        bundleInput.value = '';
        bundleInput.disabled = true;
      }
      return;
    }

    bundleInput.value = variantId;
    bundleInput.disabled = false;
  }

  #syncBundleInput() {
    const bundleInput = this.#getBundleInput();
    if (!bundleInput) return;

    const checkedInput = this.querySelector('input[type="radio"][data-variant-id]:checked') ||
      this.querySelector('input[type="checkbox"][data-variant-id]:checked');

    if (checkedInput instanceof HTMLInputElement) {
      bundleInput.value = checkedInput.dataset.variantId || '';
      bundleInput.disabled = false;
    } else {
      bundleInput.value = '';
      bundleInput.disabled = true;
    }
  }
}

customElements.define('metafield-bundle', MetafieldBundle);
