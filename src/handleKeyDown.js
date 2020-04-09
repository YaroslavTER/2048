import {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft
} from './moveCalculator';

const validKeySet = {
  down: 40,
  right: 39,
  up: 38,
  left: 37
}

const handleKeyDown = (keycode, inputItemList) => {
  if(isValidKey(keycode)) {
    switch(keycode) {
      case(40):
        return calculateMoveDown(inputItemList);
      case(39):
        return calculateMoveRight(inputItemList);
      case(38):
        return calculateMoveUp(inputItemList);
      case(37):
        return calculateMoveLeft(inputItemList);
    }
  }
}

const isValidKey = (inputKey) => {
  const validKeyList = Object.values(validKeySet);
  return validKeyList.some(key => key === inputKey);
}

export {
  handleKeyDown
}