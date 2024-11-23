const elements = Array.from(document.getElementsByTagName('*'));
const zIndexes = [];
let highestZindex;

for (const element of elements) {
  highestZindex = window
    .getComputedStyle(element, null)
    .getPropertyValue('z-index');

  if (highestZindex !== undefined && highestZindex !== 'auto') {
    zIndexes.push(Number(highestZindex));
  }
}

if (zIndexes.length === 0) {
  highestZindex = 0;
} else {
  highestZindex = Math.max(...zIndexes);
}

for (const element of document.querySelectorAll('[alt]')) {
  const altText = element.getAttribute('alt');
  const rect = element.getBoundingClientRect();
  const label = document.createElement('div');

  let altTextContent;
  let backgroundColor = '#333';
  let foregroundColor = '#fff';

  if (altText === null) {
    altTextContent = '(Not defined at all)';
    backgroundColor = '#c30';
  } else if (typeof altText === 'string' && altText.trim().length === 0) {
    altTextContent = '(Defined, but it is empty)';
    backgroundColor = '#f5d505';
    foregroundColor = '#000';
  } else {
    altTextContent = altText;
  }

  label.textContent = `Alt: ${altTextContent}`;
  label.title = element.src || '';
  label.style.cssText = `
        box-shadow: 0 4px 4px rgba(8, 8, 8, 0.08), 0 1px 2px rgba(8, 8, 8, 0.2), inset 0 6px 12px rgba(255, 255, 255, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.2);
        position: absolute;
        background: ${backgroundColor};
        color: ${foregroundColor};
        padding: 3px 6px;
        font-size: 14px;
        border-radius: 3px;
        z-index: ${highestZindex};
        pointer-events: none;
        top: ${rect.top + window.scrollY}px;
        left: ${rect.left + window.scrollX}px;
        transform: translate(-50%, -100%);
      `;
  document.body.appendChild(label);
}
