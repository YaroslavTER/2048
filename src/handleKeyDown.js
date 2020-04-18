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

const handleKeyDown = (keycode, itemList) => {
  switch(keycode) {
    case(40):
      return calculateMoveDown(itemList);
    case(39):
      return calculateMoveRight(itemList);
    case(38):
      return calculateMoveUp(itemList);
    case(37):
      return calculateMoveLeft(itemList);
  }
}

const isValidKey = (inputKey) => {
  const validKeyList = Object.values(validKeySet);
  return validKeyList.some(key => key === inputKey);
}

const dontHaveAnyMoves = (itemList) =>
  !compareItemLists(itemList, calculateMoveDown(itemList))
  || !compareItemLists(itemList, calculateMoveRight(itemList))
  || !compareItemLists(itemList, calculateMoveUp(itemList))
  || !compareItemLists(itemList, calculateMoveLeft(itemList));

const compareItemLists = (aItemList, bItemList) => {
  const {aLength} = aItemList,
    {bLength} = bItemList;

  for(let i = 0; i < aLength; i++) {
    for(let j = 0; j < bLength; j++) {
      if(!areItemsEqual(aItemList[i], bItemList[i])) {
        return false;
      }
    }
  }

  return true;
}

const areItemsEqual = (
  {key: aKey, number: aNumber, margin: {top: aTop, aLeft}}, 
  {key: bKey, number: bNumber, margin: {top: bTop, bLeft}}
) => aKey === bKey 
  && aNumber === bNumber
  && aTop === bTop
  && aLeft === bLeft;

export {
  handleKeyDown,
  isValidKey,
  dontHaveAnyMoves
}