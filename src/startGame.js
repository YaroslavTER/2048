import {
  renderItemList,
  updateRenderredItemList,
  markDomElementsForRemove,
  removeBoxList,
  generateBoxList,
  randomInRange,
  renderScore,
  renderBestScore,
} from './render';
import { handleKeyDown, isValidKey, dontHaveAnyMoves } from './handleKeyDown';
import {
  someOfMarginsChanged,
  isItemListFull,
  getScore,
  resetScore,
} from './moveCalculator';

let itemList = [],
  bestScore = 0,
  prevTime = 0;

startGame();

function startGame() {
  resetScore();
  renderScore(0);
  itemList = generateBoxList([], randomInRange(1, 2));
  document.removeEventListener('keydown', eventHandler, true);
  renderItemList(itemList);
  document.addEventListener('keydown', eventHandler, true);
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
      let prevList = [],
        score;

      if (length) {
        prevList = itemList;
        itemList = handleKeyDown(keycode, itemList);
        score = scoreHandler(score);
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
    itemList = generateBoxList(itemList, 1);
  } else if (itemList.length >= 16) {
    if (!someOfMarginsChangedValue && isItemListFull(itemList)) {
      if (dontHaveAnyMoves(itemList)) {
        document.removeEventListener('keydown', eventHandler);
      }
    }
  }
  return itemList;
};

export { startGame };
