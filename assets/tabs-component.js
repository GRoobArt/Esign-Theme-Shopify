import { Component } from '@theme/component'

class TabSummaryElement extends HTMLElement {
  connectedCallback() {
    this.setAttribute('part', 'summary')
  }
}

class TabContentElement extends HTMLElement {
  connectedCallback() {
    this.setAttribute('part', 'panel')
  }
}

class TabsComponent extends Component {
  /** @type {TabSummaryElement[]} */
  #tabs = []

  /** @type {TabContentElement[]} */
  #panels = []

  /** @type {AbortController} */
  #controller = new AbortController()

  connectedCallback() {
    super.connectedCallback()
    this.#setup()
  }

  updatedCallback() {
    super.updatedCallback()
    this.#teardown()
    this.#setup()
  }

  disconnectedCallback() {
    this.#teardown(true)
    super.disconnectedCallback()
  }

  #setup() {
    const tabs = Array.from(this.querySelectorAll('tab-summary'))
    const panels = Array.from(this.querySelectorAll('tab-content'))

    if (!tabs.length || tabs.length !== panels.length) {
      this.removeAttribute('data-tabs-ready')
      return
    }

    const { list, panelsWrapper } = this.#ensureStructure()

    tabs.forEach((tab) => list.append(tab))
    panels.forEach((panel) => panelsWrapper.append(panel))

    this.#tabs = tabs
    this.#panels = panels

    const { signal } = this.#controller

    this.#tabs.forEach((tab, index) => {
      const panel = this.#panels[index]
      if (!panel) return

      const tabId = this.#ensureTabId(tab, index)
      const panelId = this.#ensurePanelId(panel, tabId)

      tab.setAttribute('role', 'tab')
      tab.setAttribute('aria-controls', panelId)
      tab.setAttribute('tabindex', '-1')

      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('aria-labelledby', tabId)
      if (!panel.hasAttribute('tabindex')) {
        panel.setAttribute('tabindex', '0')
      }

      tab.addEventListener(
        'click',
        () => this.#activate(index, { focus: false }),
        { signal }
      )
      tab.addEventListener(
        'keydown',
        (event) => this.#handleKeyDown(event, index),
        { signal }
      )
    })

    this.setAttribute('data-tabs-ready', 'true')
    this.#activate(this.#getInitialIndex(), { focus: false })
  }

  #teardown(removeReadyAttribute = false) {
    this.#controller.abort()
    this.#controller = new AbortController()

    if (removeReadyAttribute) {
      this.removeAttribute('data-tabs-ready')
    }
  }

  #ensureStructure() {
    let list = this.querySelector(':scope > .tabs__list')
    if (!list) {
      list = document.createElement('div')
      list.className = 'tabs__list'
      this.insertBefore(list, this.firstChild)
    }

    let panels = this.querySelector(':scope > .tabs__panels')
    if (!panels) {
      panels = document.createElement('div')
      panels.className = 'tabs__panels'
      this.append(panels)
    }

    return { list, panelsWrapper: panels }
  }

  #ensureTabId(tab, index) {
    if (tab.id) return tab.id

    const generatedId = `${this.id || 'Tabs'}-summary-${index}`
    tab.id = generatedId
    return generatedId
  }

  #ensurePanelId(panel, tabId) {
    if (panel.id) return panel.id

    const generatedId = `${tabId}-panel`
    panel.id = generatedId
    return generatedId
  }

  #getInitialIndex() {
    const requested = this.#tabs.findIndex(
      (tab) => tab.dataset.active === 'true'
    )
    return requested >= 0 ? requested : 0
  }

  #activate(index, { focus = true } = {}) {
    if (!this.#tabs.length) return

    const total = this.#tabs.length
    const normalizedIndex = ((index % total) + total) % total

    this.#tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === normalizedIndex
      tab.setAttribute('aria-selected', selected ? 'true' : 'false')
      tab.setAttribute('tabindex', selected ? '0' : '-1')
      tab.classList.toggle('is-active', selected)

      if (selected && focus) {
        tab.focus()
      }
    })

    this.#panels.forEach((panel, panelIndex) => {
      const selected = panelIndex === normalizedIndex
      panel.hidden = !selected
      panel.classList.toggle('is-active', selected)
    })
  }

  #handleKeyDown(event, index) {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        this.#activate(index + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        this.#activate(index - 1)
        break
      case 'Home':
        event.preventDefault()
        this.#activate(0)
        break
      case 'End':
        event.preventDefault()
        this.#activate(this.#tabs.length - 1)
        break
      default:
        break
    }
  }
}

if (!customElements.get('tab-summary')) {
  customElements.define('tab-summary', TabSummaryElement)
}

if (!customElements.get('tab-content')) {
  customElements.define('tab-content', TabContentElement)
}

if (!customElements.get('tabs-component')) {
  customElements.define('tabs-component', TabsComponent)
}
