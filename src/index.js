import './style.scss';
import { 
  renderItemList, 
  updateRenderredItemList,
  removeBoxList,
  generateBoxList,
  randomInRange
} from './render';
import {
  handleKeyDown,
  isValidKey,
  dontHaveAnyMoves
} from './handleKeyDown';
import {
  someOfMarginsChanged,
  isItemListFull,
} from './moveCalculator';

let itemList = generateBoxList([], randomInRange(1, 2));

renderItemList(itemList);

document.addEventListener('keydown', eventHandler, true);

function eventHandler({keyCode, which}) {
  const keycode = keyCode ? keyCode : which;
    
  if(isValidKey(keycode)) {
    const {length} = itemList;
    let prevList = [],
      someOfMarginsChangedValue;

    if(length) {
      prevList = itemList;
      itemList = handleKeyDown(keycode, itemList);
      someOfMarginsChangedValue = someOfMarginsChanged(itemList, prevList);
      if(someOfMarginsChangedValue) {
        itemList = generateBoxList(itemList, 1);
      } else if(!someOfMarginsChangedValue && isItemListFull(itemList)) {
        console.log(itemList.filter(({needToRemove}) => needToRemove));
        if(dontHaveAnyMoves(itemList)) {
          console.log('game over');
          document.removeEventListener('keydown', eventHandler);
        }
      }
      updateRenderredItemList(itemList, prevList);
      setTimeout(function() {
        itemList = removeBoxList(itemList);
      }, 95);
    }
  }
}