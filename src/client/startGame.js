import {
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
} from './render';
import { handleKeyDown, isValidKey, dontHaveAnyMoves } from './handleKeyDown';
import {
  someOfMarginsChanged,
  getScore,
  resetScore,
  isItemListFull,
  getMaxZIndex,
  isWin,
} from './moveCalculator';

let itemList = [],
  bestScore = 0,
  prevTime = 0,
  score = 0;

addButtonHandler('keep-going', hideYouWinWindow);

function startGame() {
  const eventName = 'keydown';

  resetScore();
  renderScore(0);
  hideYouWinWindow();
  hideGameOverWindow();
  itemList = generateBoxList([], randomInRange(1, 2));
  document.removeEventListener(eventName, eventHandler);
  renderItemList(itemList);
  document.addEventListener(eventName, eventHandler);
}

function eventHandler(event) {
  const { keyCode, which } = event,
    keycode = keyCode ? keyCode : which,
    currentTime = Date.now();
  let diff = currentTime - prevTime;

  if (isValidKey(keycode)) {
    event.preventDefault();

    if (diff > 65) {
      const { length } = itemList;
      let prevList = [];

      if (length) {
        prevList = itemList;
        itemList = handleKeyDown(keycode, itemList);
        if (isWin(itemList)) {
          showYouWinWindow(getMaxZIndex());
        }
        itemList = gameOverHandler(itemList, prevList);
        updateRenderredItemList(itemList, prevList);
        markDomElementsForRemove(itemList);
        setTimeout(function () {
          itemList = removeBoxList(itemList);
        }, 95);
      }
    }
  }

  prevTime = currentTime;
}

const scoreHandler = (score) => {
  score = getScore();
  renderScore(score);
  if (score > bestScore) {
    bestScore = score;
    renderBestScore(bestScore);
  }
  return score;
};

const gameOverHandler = (itemList, prevList) => {
  let someOfMarginsChangedValue = someOfMarginsChanged(itemList, prevList);
  if (someOfMarginsChangedValue) {
    score = scoreHandler(score);
    itemList = generateBoxList(itemList, 1);
  } else if (isItemListFull(itemList)) {
    if (!someOfMarginsChangedValue) {
      if (dontHaveAnyMoves(itemList)) {
        document.removeEventListener('keydown', eventHandler);
        showGameOverWindow(getMaxZIndex());
      }
    }
  }
  return itemList;
};

export { startGame };
