const docWidth = document.documentElement.offsetWidth;
const tooWideElements = [];
const body = document.body;
const root = document.documentElement;
const pageHeight = Math.max(
  body.scrollHeight,
  body.offsetHeight,
  root.clientHeight,
  root.scrollHeight,
  root.offsetHeight,
);
const pageWidth = Math.max(
  body.scrollWidth,
  body.offsetWidth,
  root.clientWidth,
  root.scrollWidth,
  root.offsetWidth,
);

const pageSize = {
  height: pageHeight,
  width: pageWidth
};

const getHighestZindex = () => {
  const elms = document.getElementsByTagName('*');
  const len = elms.length;
  const zIndexes = [];
  let zIndex;

  for (let i = 0; i < len; i += 1) {
    zIndex = window.getComputedStyle(elms[i]).getPropertyValue('z-index');

    if (zIndex !== null && zIndex !== 'auto') {
      zIndexes.push(Number(zIndex));
    }
  }

  if (zIndexes.length === 0) {
    return 0;
  }

  return Math.max(...zIndexes);
};

const highestZindex = getHighestZindex();

const isAnyPartOfElementRenderedOnPage = (element) => {
  const rect = element.getBoundingClientRect();

  if (rect.height === 0 && rect.width === 0) {
    return false;
  }

  const verticalInView = rect.top <= pageSize.height && rect.top + rect.height >= 0;
  const horizontalInView = rect.left <= pageSize.width && rect.left + rect.width >= 0;

  return verticalInView && horizontalInView;
};

const traverse = (_childNodes) => {
  const elements = Array.from(_childNodes);

  for (const element of elements) {
    if (element.nodeType !== 1) {
      continue;
    }

    let rect = element.getBoundingClientRect();
    let overflowX = window.getComputedStyle(element).getPropertyValue('overflow-x');

    if (overflowX === 'hidden' || (rect.width < 2 && rect.height < 2) || isAnyPartOfElementRenderedOnPage(element) === false) {
      continue;
    }

    if (rect.right > docWidth || rect.left < 0) {
      tooWideElements.push(element);

      continue;
    }

    if (element.childNodes.length > 0) {
      traverse(element.childNodes);
    }
  }
};

const markAsTooWide = (element) => {
  element.style.setProperty('border-top', '4px solid #c30', 'important');
  element.style.setProperty('z-index', String(highestZindex + 1), 'important');
};

traverse(body.childNodes);

tooWideElements.forEach(markAsTooWide);

console.log('[tooWideElements]', tooWideElements.length, tooWideElements);
