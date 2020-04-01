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

document.addEventListener('keydown', ({keyCode, which}) => {
  //handle moves

  //render list

  boxList.forEach((box, index) => {//change box list based on handleMove calculations
    //it means to update the box list on every move
    const keycode = keyCode ? keyCode : which,
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

    switch(keycode) {
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
    }

    prevTimeList[index] = currentTime;
  });
});

/* 
handleMoveUp

filter items from the list with equal leftMargin

calculate next list
*/

const moveResult = calculateMoveLeft([
  /* {
    number: 2,
    key: 2,
    margin: {
      top: 0,
      left: 0
    }
  },
  {
    number: 4,
    key: 2,
    margin: {
      top: 0,
      left: 200
    }
  },
  {
    number: 4,
    key: 3,
    margin: {
      top: 100,
      left: 0
    }
  }, */
  {
    number: 4,
    key: 1,
    margin: {
      top: 200,
      left: 0
    },
  },
  {
    number: 4,
    key: 5,
    margin: {
      top: 200,
      left: 200
    }
  },
  {
    number: 4,
    key: 6,
    margin: {
      top: 200,
      left: 300
    }
  }
]);

console.log(moveResult);

const deepClone = list => JSON.parse(JSON.stringify(list));
