import './style.scss';
import { 
  renderItemList, 
  updateRenderredItemList,
  removeBoxList
} from './render';
import {
  handleKeyDown
} from './handleKeyDown';

let itemList = [
  {
    number: 2,
    key: 1,
    margin: {
      top: 200,
      left: 0
    }
  },
  {
    number: 2,
    key: 2,
    margin: {
      top: 200,
      left: 100
    }
  },
  {
    number: 2,
    key: 3,
    margin: {
      top: 200,
      left: 200
    },
  },
  {
    number: 2,
    key: 4,
    margin: {
      top: 200,
      left: 300
    }
  },
  {
    number: 2,
    key: 5,
    margin: {
      top: 100,
      left: 200
    }
  },
  {
    number: 2,
    key: 6,
    margin: {
      top: 0,
      left: 200
    }
  }
];

renderItemList(itemList);

document.addEventListener('keydown', ({keyCode, which}) => {
  const keycode = keyCode ? keyCode : which,
    length = itemList;

  if(length) {
    itemList = handleKeyDown(keycode, itemList);
    console.log(itemList);
    updateRenderredItemList(itemList);
    //colision detection
    itemList = removeBoxList(itemList);
  }
});