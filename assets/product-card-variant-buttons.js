// @ts-check

/**
 * @typedef {HTMLElement & {
 *   showDialog?: () => void,
 *   closeDialog?: () => void
 * }} DialogComponentElement
 */

/**
 * @typedef {{ data?: { productId?: string | number } }} CartUpdateDetail
 */

/**
 * @typedef {{ sourceId?: string }} CartErrorDetail
 */

const OPTION_SELECTOR = '[data-variant-option]'
const DROPDOWN_SELECTOR = '[data-variant-dropdown]'

/**
 * Theme events extend Event and attach a custom "detail" field.
 *
 * @param {Event} event
 * @returns {unknown}
 */
const getEventDetail = (event) => {
  const eventWithDetail = /** @type {Event & { detail?: unknown }} */ (event)
  return eventWithDetail.detail
}

/**
 * @param {HTMLElement} component
 * @returns {DialogComponentElement | null}
 */
const getBundleDialogComponent = (component) => {
  const dialogId = component.dataset.bundleDialogId
  if (dialogId) {
    return /** @type {DialogComponentElement | null} */ (
      document.getElementById(dialogId)
    )
  }

  return /** @type {DialogComponentElement | null} */ (
    component.querySelector('dialog-component')
  )
}

/**
 * @param {HTMLElement} component
 */
const closeBundleDialog = (component) => {
  const dialogComponent = getBundleDialogComponent(component)
  if (dialogComponent && typeof dialogComponent.closeDialog === 'function') {
    dialogComponent.closeDialog()
  }
}

/**
 * @param {HTMLButtonElement} button
 * @param {boolean} isLoading
 */
const setTemporaryDisabled = (button, isLoading) => {
  if (isLoading) {
    if (button.hasAttribute('disabled')) {
      button.dataset.wasDisabled = 'true'
    } else {
      button.dataset.wasDisabled = 'false'
      button.disabled = true
    }
    return
  }

  if (button.dataset.wasDisabled === 'false') {
    button.disabled = false
  }
  delete button.dataset.wasDisabled
}

/**
 * @param {HTMLElement} component
 * @param {boolean} isLoading
 */
const setLoadingState = (component, isLoading) => {
  component.classList.toggle('is-loading', isLoading)
  component.setAttribute('aria-busy', isLoading ? 'true' : 'false')

  component.querySelectorAll(OPTION_SELECTOR).forEach((button) => {
    if (button instanceof HTMLButtonElement) {
      setTemporaryDisabled(button, isLoading)
    }
  })
}

/**
 * @param {Element} dropdown
 * @param {HTMLButtonElement} selectedButton
 */
const updateSelectedState = (dropdown, selectedButton) => {
  const options = dropdown.querySelectorAll(`${OPTION_SELECTOR}[role="option"]`)
  options.forEach((option) => {
    option.setAttribute(
      'aria-selected',
      option === selectedButton ? 'true' : 'false',
    )
  })
}

/**
 * @param {MouseEvent} event
 */
const handleOptionClick = (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const optionButton = target.closest(OPTION_SELECTOR)
  if (!(optionButton instanceof HTMLButtonElement)) return
  if (optionButton.disabled) return

  const component = optionButton.closest('product-card-variant-buttons')
  if (!(component instanceof HTMLElement)) return

  const form = optionButton.closest('form')
  if (!(form instanceof HTMLFormElement)) return

  const variantId = optionButton.dataset.variantId
  if (!variantId) return

  const variantInput = form.querySelector('input[name="id"]')
  if (variantInput instanceof HTMLInputElement) {
    variantInput.value = variantId
    variantInput.removeAttribute('disabled')
  }

  const dropdown = optionButton.closest(DROPDOWN_SELECTOR)
  if (dropdown) {
    updateSelectedState(dropdown, optionButton)
    if (dropdown instanceof HTMLDetailsElement) {
      dropdown.open = false
    }
  }

  if (component.dataset.hasBundle === 'true') {
    const dialogComponent = getBundleDialogComponent(component)
    if (dialogComponent && typeof dialogComponent.showDialog === 'function') {
      dialogComponent.showDialog()
    }
    return
  }

  if (typeof form.requestSubmit === 'function') {
    form.requestSubmit()
  } else {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
  }
}

/**
 * @param {SubmitEvent} event
 */
const handleFormSubmit = (event) => {
  const form = event.target
  if (!(form instanceof HTMLFormElement)) return

  const component = form.closest('product-card-variant-buttons')
  if (!(component instanceof HTMLElement)) return

  if (component.dataset.hasBundle === 'true') {
    closeBundleDialog(component)
  }

  setLoadingState(component, true)
}

/**
 * @param {Event} event
 */
const handleCartUpdate = (event) => {
  const detail = /** @type {CartUpdateDetail | undefined} */ (
    getEventDetail(event)
  )
  const productId = detail?.data?.productId
  if (!productId) return
  const normalizedProductId = String(productId)

  document
    .querySelectorAll(
      `product-card-variant-buttons[data-product-id="${normalizedProductId}"]`,
    )
    .forEach((component) => {
      if (component instanceof HTMLElement) {
        setLoadingState(component, false)
        closeBundleDialog(component)
      }
    })
}

/**
 * @param {Event} event
 */
const handleCartError = (event) => {
  const detail = /** @type {CartErrorDetail | undefined} */ (
    getEventDetail(event)
  )
  const sourceId = detail?.sourceId
  if (!sourceId) return

  const form = document.getElementById(sourceId)
  const component = form?.closest('product-card-variant-buttons')
  if (component instanceof HTMLElement) {
    setLoadingState(component, false)
  }
}

document.addEventListener('click', handleOptionClick)
document.addEventListener('submit', handleFormSubmit)
document.addEventListener('cart:update', handleCartUpdate)
document.addEventListener('cart:error', handleCartError)
