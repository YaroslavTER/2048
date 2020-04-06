import './style.css';
import {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  size
} from './moveCalculator.js';

const boxList = Array.from(document.getElementsByClassName('box'));//generate boxList with two items
//with random positions
let prevTimeList = [...new Array(boxList.length)].map(() => 0);
const itemList = [
  {
    number: 4,
    key: 1,
    margin: {
      top: 200,
      left: 0
    },
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
    number: 4,
    key: 4,
    margin: {
      top: 200,
      left: 300
    }
  }
];

document.addEventListener('keydown', ({keyCode, which}) => {
  const keycode = keyCode ? keyCode : which;

  const moveResult = handleKeyDown(keycode, itemList);
  console.log(moveResult);
  //handle moves

  //render list

  //clean list

  boxList.forEach((box, index) => {//change box list based on handleMove calculations
    //it means to update the box list on every move
    const /* keycode = keyCode ? keyCode : which, */
          startValue = '0px',
          shiftValue = `${size.cell * size.grid}px`,
          currentTime = Date.now(),
          animationClass = 'animation',
          delay = 500;
    let diff = 0;

    diff = currentTime - prevTimeList[index];

    if (diff > delay) {
      box.classList.add(animationClass);
    } else {
      box.classList.remove(animationClass);
    }

    /* switch(keycode) {
      case(40)://find item from the reuslt list of the calculateMoveDown by the key property
        box.style.marginTop = shiftValue;//value from handleMoveDown for particular box
        //`shitValue` will be result of handleMoveDown for the `box`
        break;
      case(39):
        box.style.marginLeft = shiftValue;//handleMoveRight
        break;
      case(38):
        box.style.marginTop = startValue;//handleMoveUp
        break;
      case(37):
        box.style.marginLeft = startValue;//handleMoveLeft
        break;
    } */

    prevTimeList[index] = currentTime;
  });
});

const handleKeyDown = (keycode, inputItemList) => {
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