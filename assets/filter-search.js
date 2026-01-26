const SEARCH_INPUT_SELECTOR = '[data-filter-search-input]';

const getVisibleItemsCount = (items) => {
  let count = 0;
  for (const item of items) {
    if (!item.hidden) count += 1;
  }
  return count;
};

const filterResults = (input) => {
  const resultsList = input.closest('results-list');
  if (!resultsList) return;

  const grid = resultsList.querySelector('[ref="grid"]') || resultsList.querySelector('.product-grid');
  if (!grid) return;

  const query = input.value.trim().toLowerCase();
  const inputs = resultsList.querySelectorAll(SEARCH_INPUT_SELECTOR);
  for (const field of inputs) {
    if (field !== input) field.value = input.value;
  }
  const items = grid.querySelectorAll('[data-product-title]');

  for (const item of items) {
    const title = item.dataset.productTitle || '';
    const isMatch = query.length === 0 || title.includes(query);
    item.hidden = !isMatch;
  }

  const visibleCount = getVisibleItemsCount(items);
  const emptyState = resultsList.querySelector('[data-collection-empty-state]');
  if (emptyState) emptyState.hidden = visibleCount > 0;

  grid.hidden = visibleCount === 0;

  const resetButton = input.closest('[data-filter-search]')?.querySelector('[data-filter-search-reset]');
  if (resetButton) resetButton.hidden = query.length === 0;
};

const handleInput = (event) => {
  if (!(event.target instanceof HTMLInputElement)) return;
  if (!event.target.matches(SEARCH_INPUT_SELECTOR)) return;

  filterResults(event.target);
};

const handleReset = (event) => {
  const button = event.target.closest('[data-filter-search-reset]');
  if (!button) return;

  const wrapper = button.closest('[data-filter-search]');
  const input = wrapper?.querySelector(SEARCH_INPUT_SELECTOR);
  if (!input) return;

  input.value = '';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.focus();
};

const init = () => {
  document.querySelectorAll(SEARCH_INPUT_SELECTOR).forEach((input) => filterResults(input));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}

document.addEventListener('input', handleInput);
document.addEventListener('click', handleReset);
