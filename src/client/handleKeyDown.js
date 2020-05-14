import {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  someOfMarginsChanged,
} from './moveCalculator';

const validKeySet = {
  down: 40,
  right: 39,
  up: 38,
  left: 37,
};

const handleKeyDown = (keycode, itemList) => {
  switch (keycode) {
    case 40:
      return calculateMoveDown(itemList);
    case 39:
      return calculateMoveRight(itemList);
    case 38:
      return calculateMoveUp(itemList);
    case 37:
      return calculateMoveLeft(itemList);
  }
};

const isValidKey = (inputKey) => {
  const validKeyList = Object.values(validKeySet);
  return validKeyList.some((key) => key === inputKey);
};

const dontHaveAnyMoves = (itemList) =>
  !someOfMarginsChanged(itemList, calculateMoveDown(itemList)) &&
  !someOfMarginsChanged(itemList, calculateMoveRight(itemList)) &&
  !someOfMarginsChanged(itemList, calculateMoveUp(itemList)) &&
  !someOfMarginsChanged(itemList, calculateMoveLeft(itemList));

export { handleKeyDown, isValidKey, dontHaveAnyMoves };
