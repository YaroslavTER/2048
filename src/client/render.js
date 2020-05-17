import { size } from './moveCalculator';
import { getKey } from './keyGenerator';
import { animate, getMargin, linear } from './animation';

const windowClassName = {
  gameOver: 'game-over-window',
  youWin: 'you-win-window',
};

const generateBoxList = (itemList, numberOfItems) => {
  const list = JSON.parse(JSON.stringify(itemList));
  for (let i = 0; i < numberOfItems; i++) {
    list.push(generateBox(list));
  }
  return list;
};

const generateBox = (itemList) => {
  let top, left;

  do {
    top = randomMarginInRange();
    left = randomMarginInRange();
  } while (areMarginsColide(top, left, itemList));

  return {
    number: randomInRange(1, 2) * 2,
    key: getKey(),
    margin: {
      top,
      left,
    },
  };
};

const randomMarginInRange = () => {
  const { grid, cell } = size;
  return randomInRange(0, grid) * cell;
};

const randomInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const areMarginsColide = (inputTop, inputLeft, itemList) =>
  itemList.some(
    ({ margin: { top, left } }) => top === inputTop && left === inputLeft
  );

const renderItemList = (itemList) => {
  const container = document.getElementsByClassName('container')[0];
  let zIndexCounter = 0;

  clearChildElements(container);
  itemList.forEach((item) => createBox(item, container, zIndexCounter++));
};

const clearChildElements = (domElement) => {
  if (domElement) {
    while (domElement.firstChild) {
      domElement.removeChild(domElement.lastChild);
    }
  }
};

const createBox = ({ number, key, margin }, container, zIndex) => {
  const box = document.createElement('div');
  box.innerText = number;
  box.setAttribute('class', `box ${getColorSelector(number)}`);
  box.setAttribute('data-key', key);
  appendChildStyle(box, getBoxStyle(getBoxSelector(key), margin, zIndex));
  container.appendChild(box);
};

const getColorSelector = (number) => {
  if (number <= 2048) {
    return `value-${number}`;
  } else {
    return `value-hight`;
  }
};

const appendChildStyle = (createdElement, styleText) => {
  let css = document.createElement('style'),
    style = styleText;

  css.type = 'text/css';

  if (css.styleSheet) {
    css.styleSheet.cssText = style;
  } else {
    css.appendChild(document.createTextNode(style));
  }

  createdElement.appendChild(css);
};

const updateRenderredItemList = (itemList, prevList) => {
  let zIndexCounter = 0;

  itemList.forEach((item) => {
    const { key: currentItemKey } = item;
    const prevItem = prevList.filter(({ key }) => key === currentItemKey)[0];
    const { margin: prevMargin } = prevItem || { margin: {} };
    updateBox(item, prevMargin, zIndexCounter++);
    if (!prevItem) {
      setTimeout(function () {
        const container = document.getElementsByClassName('container')[0];
        createBox(item, container, zIndexCounter++);
      }, 0);
    }
  });
};

const updateBox = ({ number, key, margin }, prevMargin, zIndex) => {
  const boxSelector = getBoxSelector(key),
    box = document.querySelector(boxSelector);
  moveBoxAnimation(box, boxSelector, number, margin, prevMargin, zIndex, 0.1);
};

const moveBoxAnimation = (
  box,
  boxSelector,
  number,
  { top, left },
  { top: prevTop, left: prevLeft },
  zIndex,
  msDuration
) => {
  animate(
    linear,
    (progress) => {
      if (box) {
        clearChildElements(box);
        box.innerText = number;

        appendChildStyle(
          box,
          getBoxStyle(
            boxSelector,
            {
              top: getMargin(progress, prevTop, top),
              left: getMargin(progress, prevLeft, left),
            },
            zIndex
          )
        );
      }
    },
    () => {
      if (box && box !== null) {
        box.classList.add(getColorSelector(number));
      }
    },
    msDuration * 1000
  );
};

const markDomElementsForRemove = (itemList) => {
  itemList.forEach(({ key, needToRemove }) => {
    if (needToRemove) {
      const box = document.querySelector(getBoxSelector(key));
      box.classList.add('need-to-remove');
    }
  });
};

const removeBoxList = (itemList) => {
  removeMarkedDomElements();
  return itemList.filter((item) => {
    const { needToRemove } = item;
    if (needToRemove) {
      bounceBox(itemList, item);
    } else {
      return item;
    }
  });
};

const removeMarkedDomElements = () =>
  Array.from(document.getElementsByClassName('need-to-remove')).forEach((box) =>
    box.remove()
  );

const bounceBox = (itemList, { margin: { top, left } }) => {
  const { key } = itemList.filter(
      ({ margin: { top: currentTop, left: currentLeft }, needToRemove }) =>
        currentTop === top && currentLeft === left && !needToRemove
    )[0],
    box = document.querySelector(getBoxSelector(key)),
    bounceClassName = 'bounce';

  box.classList.remove(bounceClassName);
  void box.offsetWidth;
  box.classList.add(bounceClassName);
};

const getBoxSelector = (key) => `.box[data-key="${key}"]`;

const getBoxStyle = (boxSelector, { top, left }, zIndex) =>
  `${boxSelector} { 
    margin-top: ${top}px;
    margin-left: ${left}px;
    z-index: ${zIndex};
    animation: createBox .25s;
  }`;

const renderScore = (score) => renderNumber(score, '.score .number');

const renderBestScore = (score) => renderNumber(score, '.best .number');

const renderNumber = (number, selector) => {
  const domElement = document.querySelector(selector);
  domElement.innerText = number;
};

const addButtonHandler = (className, callback) =>
  document
    .getElementsByClassName(className)[0]
    .addEventListener('click', () => callback());

const showGameOverWindow = (zIndex) =>
  showWindow(zIndex, windowClassName.gameOver);

const hideGameOverWindow = () => hideWindow(windowClassName.gameOver);

const showYouWinWindow = (zIndex) => showWindow(zIndex, windowClassName.youWin);

const hideYouWinWindow = () => hideWindow(windowClassName.youWin);

const showWindow = (zIndex, className) => {
  const window = document.getElementsByClassName(className)[0];
  if (window) {
    window.classList.remove('hidden');
    window.style.zIndex = zIndex;
  }
};

const hideWindow = (className) => {
  const gameOverWindow = document.getElementsByClassName(className)[0],
    hideClassName = 'hidden';
  if (!gameOverWindow.classList.contains(hideClassName)) {
    gameOverWindow.classList.add(hideClassName);
  }
};

export {
  renderItemList,
  updateRenderredItemList,
  markDomElementsForRemove,
  removeBoxList,
  generateBoxList,
  randomInRange,
  renderScore,
  renderBestScore,
  addButtonHandler,
  showGameOverWindow,
  hideGameOverWindow,
  showYouWinWindow,
  hideYouWinWindow,
};