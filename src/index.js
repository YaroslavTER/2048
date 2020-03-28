import './style.css';

const boxList = Array.from(document.getElementsByClassName('box')),//generate boxList with two items
//with random positions
      size = {
        grid: 3,
        cell: 100
      };
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

const calculateMoveDown = itemList => calculateMove(itemList, 'left', 'top', moveDown);
const calculateMoveUp = itemList => calculateMove(itemList, 'left', 'top', moveUp);
const calculateMoveRight = itemList => calculateMove(itemList, 'top', 'left', moveRight);
const calculateMoveLeft = itemList => calculateMove(itemList, 'top', 'left', moveLeft);

const calculateMove = (itemList, pivotMarginName, moveMarginName, moveCallback) => 
  [...new Array(itemList.length)]
    .reduce((accumulator, currentValue, i) => {
      let subList = itemList
        .filter(item => item.margin[pivotMarginName] === i * size.cell)
        .sort((
          {
            margin: { 
              [moveMarginName]: marginA 
            } 
          }, 
          {
            margin: {
              [moveMarginName]: marginB 
            }
          }
        ) => marginA - marginB);
      
      return accumulator.concat(moveCallback(subList));
    }, []);

const moveDown = subList => moveWithDecreaseCounter(subList, 'left', 'top');
const moveRight = subList => moveWithDecreaseCounter(subList, 'top', 'left');
const moveUp = subList => moveWithIncreaseCounter(subList, 'left', 'top');
const moveLeft = subList => moveWithIncreaseCounter(subList, 'top', 'left');

const moveWithIncreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let resultList = [],
    counter = 0,
    { cell } = size;

  for(let i = 0; i < subList.length; i++) {
    let {number, key, margin: {[pivotMarginName]: pivotMarginValue}} = subList[i];
    resultList.push({
      number, 
      key,
      margin: { 
        [moveMarginName]: counter * cell,
        [pivotMarginName]: pivotMarginValue
      }
    });
    counter++;
  }

  return resultList;
}

const moveWithDecreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let resultList = [],
    { grid: counter, cell } = size;

  for(let i = subList.length - 1; i >= 0; i--) {
    let {number, key, margin: {[pivotMarginName]: pivotMarginValue}} = subList[i];
    resultList.unshift({
      number, 
      key,
      margin: { 
        [moveMarginName]: counter * cell,
        [pivotMarginName]: pivotMarginValue
      }
    });
    counter--;
  }

  return resultList;
}

const moveDownResult = calculateMoveLeft([
  {
    number: 2,
    key: 2,
    margin: {
      top: 0,
      left: 0
    }
  },
  {
    number: 2,
    key: 1,
    margin: {
      top: 200,
      left: 0
    },
  },
  {
    number: 4,
    key: 3,
    margin: {
      top: 100,
      left: 0
    }
  },
  {
    number: 4,
    key: 4,
    margin: {
      top: 0,
      left: 200
    }
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

console.log(moveDownResult);

const deepClone = list => JSON.parse(JSON.stringify(list));
