import './style.scss';
import { 
  renderItemList, 
  updateRenderredItemList,
  removeBoxList,
  generateBoxList,
  randomInRange
} from './render';
import {
  handleKeyDown
} from './handleKeyDown';

let itemList = generateBoxList([], randomInRange(1, 2));

renderItemList(itemList);

document.addEventListener('keydown', ({keyCode, which}) => {
  const keycode = keyCode ? keyCode : which,
    {length} = itemList;

  if(length) {
    itemList = handleKeyDown(keycode, itemList);
    updateRenderredItemList(itemList);
    itemList = removeBoxList(itemList);
  }
});