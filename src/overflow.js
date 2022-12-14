const allElements = Array.from(document.getElementsByTagName("*"));
const docWidth = document.documentElement.offsetWidth;

const isParentSkippable = (element) => {
  let parent = element;

  while (parent !== null) {
    let rect = parent.getBoundingClientRect();
    let overflowX = window.getComputedStyle(element).getPropertyValue('overflow-x');

    if (overflowX === 'hidden' || (rect.width < 2 && rect.height < 2)) {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
};

const tooWideElements = [];

const isWithinTooWideParent = (element) => {
  return tooWideElements.find((el) => {
    return el.contains(element);
  });
};

for (const element of allElements) {
    let rect = element.getBoundingClientRect();
    if ((rect.width > 1 && rect.height > 1) && (rect.right > docWidth || rect.left < 0 && isParentSkippable(element) === false) && isWithinTooWideParent(element) === undefined) {
        tooWideElements.push(element);
        element.style.setProperty('border-top', '4px solid #c30', 'important');
    }
}

if (tooWideElements.length > 0) {
  console.log('Elements too wide', tooWideElements);
}
