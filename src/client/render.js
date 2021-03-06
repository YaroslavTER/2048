import { size } from './moveCalculator';
import { getKey } from './keyGenerator';
import { animate, getMargin, linear } from './animation';
import { playerStatus } from './playerStatus';

const windowClassName = {
    gameOver: 'game-over',
    youWin: 'you-win',
    competitorWin: 'competitor-win',
    connection: 'connection',
  },
  hideClassName = 'hidden',
  nameColorList = [
    '#a75610',
    '#b96921',
    '#b12394',
    '#cad41a',
    '#73d731',
    '#1d3bbd',
    '#35b877',
    '#792fb3',
    '#b2691c',
    '#412f6d',
    '#3f4971',
    '#6797fd',
    '#72b4c0',
    '#8826e1',
    '#722cf8',
    '#3cb8f2',
    '#f866cc',
    '#46cf09',
    '#b8394e',
    '#ac90c2',
    '#2354fb',
    '#c25506',
    '#87fabf',
    '#c9a15e',
  ];

let usersLimit;

const setNumberOfUsers = (inputNumberOfUsers) =>
  (usersLimit = inputNumberOfUsers);

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
  return domElement;
};

const createBox = ({ number, key, margin }, container, zIndex) => {
  const box = createDiv(number, [
    { name: 'class', value: `box ${getColorSelector(number)}` },
    { name: 'data-key', value: key },
  ]);
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
  Array.from(document.getElementsByClassName(className)).forEach((button) =>
    button.addEventListener('click', () => callback())
  );

const showGameOverWindow = (zIndex) =>
  showWindow(zIndex, windowClassName.gameOver);

const hideGameOverWindow = () => hideWindow(windowClassName.gameOver);

const showYouWinWindow = (zIndex) => showWindow(zIndex, windowClassName.youWin);

const hideYouWinWindow = () => hideWindow(windowClassName.youWin);

const showCompetitorWinWindow = (zIndex) =>
  showWindow(zIndex, windowClassName.competitorWin);

const hideCompetitorWinWindow = () => hideWindow(windowClassName.competitorWin);

const showConnectionWindow = (zIndex) =>
  showWindow(zIndex, windowClassName.connection);

const hideConnectionWindow = () => hideWindow(windowClassName.connection);

const showWindow = (zIndex, className) => {
  const window = document.getElementsByClassName(className)[0];
  if (window) {
    window.classList.remove(hideClassName);
    window.style.zIndex = zIndex;
  }
};

const hideWindow = (className) => {
  const gameOverWindow = document.getElementsByClassName(className)[0];
  if (!gameOverWindow.classList.contains(hideClassName)) {
    gameOverWindow.classList.add(hideClassName);
  }
};

const getValuesFromStartModalWindow = () => ({
  name: document.getElementsByClassName('input-name')[0].value,
  room: document.getElementsByClassName('input-room')[0].value,
});

const showStartModalWindow = () => isStartModalWindowHidden(false);

const showStartModalWindowContainerOnly = () => {
  document
    .getElementsByClassName('start-modal-window')[0]
    .classList.add(hideClassName);
  document
    .getElementsByClassName('modal-window-container')[0]
    .classList.remove(hideClassName);
  document
    .getElementsByClassName('modal-window-container-info')[0]
    .classList.remove(hideClassName);
};

const hideStartModalWindow = () => isStartModalWindowHidden(true);

const isMobileDevice = () => window.innerWidth <= 494;

const isStartModalWindowHidden = (isHidden) => {
  const modalConatinerMethod = isHidden ? 'add' : 'remove',
    scrollLockMethod = isHidden ? 'remove' : 'add';

  document
    .getElementsByClassName('modal-window-container')[0]
    .classList[modalConatinerMethod](hideClassName);
  document
    .getElementsByTagName('body')[0]
    .classList[scrollLockMethod]('scroll-lock');
};

const renderCompetitorList = (competitorSet) => {
  const keyList = Object.keys(competitorSet),
    competitorList = resetCompetitorList();

  keyList.forEach((key) => {
    const { points, name, color, id, status } = competitorSet[key],
      colorClassName = `${id}-${color}`.replace('#', ''),
      competitorDom = createCompetitor(
        name,
        points,
        colorClassName,
        getPlayerStatusClassName(status)
      );

    appendChildStyle(
      competitorDom,
      `.${colorClassName} {
        color: ${color}
      }`
    );
    competitorList.appendChild(competitorDom);
  });
};

const getPlayerStatusClassName = (status) => {
  const { win, loose } = playerStatus;
  let className = '';

  switch (status) {
    case win:
      className = 'win-for-competitor';
      break;
    case loose:
      className = 'game-over-for-competitor';
      break;
  }

  return className;
};

const getRandomColor = () =>
  nameColorList[randomInRange(0, nameColorList.length - 1)];

const clearCompetitorList = () => (resetCompetitorList().innerText = 'Clear');

const resetCompetitorList = () =>
  clearChildElements(document.getElementsByClassName('competitor-list')[0]);

const createCompetitor = (name, points, colorClassName, statusClassName) => {
  const competitor = createDiv(null, [
      { name: 'class', value: 'competitor' },
      { name: 'class', value: name },
    ]),
    nameBox = createDiv(`${name} : `, [
      { name: 'class', value: 'name' },
      { name: 'class', value: colorClassName },
    ]),
    poinsBoxClassList = [{ name: 'class', value: 'score' }];
  let pointsBox;

  if (statusClassName !== '') {
    poinsBoxClassList.push({ name: 'class', value: statusClassName });
  }

  pointsBox = createDiv(points, poinsBoxClassList);

  competitor.appendChild(nameBox);
  competitor.appendChild(pointsBox);

  return competitor;
};

const createDiv = (innerText, attributeList) => {
  const box = document.createElement('div');
  box.innerText = innerText;
  let concatedClassName = '';

  attributeList.forEach(({ name, value }) => {
    if (name === 'class') {
      concatedClassName += concatedClassName === '' ? value : ` ${value}`;
    } else {
      box.setAttribute(name, value);
    }
  });
  box.setAttribute('class', concatedClassName);
  return box;
};

const drawNumberOfConnectedUsers = (numberOfUsers) =>
  setTextToElement(
    'number-of-users',
    `Connected ${numberOfUsers}/${usersLimit}`
  );

const drawWinCompetitorName = (name) =>
  setTextToElement('competitor-name', `${name} has won!`);

const setTextToElement = (className, text) => {
  const numberOfUsersDom = document.getElementsByClassName(className)[0];
  numberOfUsersDom.innerText = text;
};

export {
  setNumberOfUsers,
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
  showCompetitorWinWindow,
  hideCompetitorWinWindow,
  showConnectionWindow,
  hideConnectionWindow,
  getValuesFromStartModalWindow,
  showStartModalWindow,
  showStartModalWindowContainerOnly,
  hideStartModalWindow,
  isMobileDevice,
  renderCompetitorList,
  getRandomColor,
  clearCompetitorList,
  drawNumberOfConnectedUsers,
  drawWinCompetitorName,
};
