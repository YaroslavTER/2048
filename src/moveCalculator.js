const size = {
  grid: 3,
  cell: 100,
  calculateMoveListLength: 4
};
const calculateMoveDown = itemList => calculateMove(itemList, 'left', 'top', moveDown);
const calculateMoveRight = itemList => calculateMove(itemList, 'top', 'left', moveRight);
const calculateMoveUp = itemList =>
  calculateMoveInDirection(itemList, 'top', 'left', moveUp);
const calculateMoveLeft = itemList => 
  calculateMoveInDirection(itemList, 'top', 'left', moveLeft);

const calculateMoveInDirection = (
  itemList, 
  pivotMarginName,
  moveMarginName,
  moveCallback
) => calculateMove(
  itemList, 
  pivotMarginName, 
  moveMarginName, 
  subList => moveCallback(subList, pivotMarginName, moveMarginName)
);

const calculateMove = (itemList, pivotMarginName, moveMarginName, moveCallback) => {
  let {cell, calculateMoveListLength} = size;
  return [...new Array(calculateMoveListLength)]
    .reduce((accumulator, currentValue, i) => {
      let subList = itemList
        .filter(item => item.margin[pivotMarginName] === i * cell)
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
}

const moveDown = subList => moveWithDecreaseCounter(subList, 'left', 'top');
const moveRight = subList => 
  decreaseCounterCalculations(subList, 'top', 'left');
//moveWithDecreaseCounter(subList, 'top', 'left');
const moveUp = (subList, pivotMarginName, moveMarginName) => 
  increaseCounterCalculations(subList, pivotMarginName, moveMarginName);
const moveLeft = (subList, pivotMarginName, moveMarginName) => 
  increaseCounterCalculations(subList, pivotMarginName, moveMarginName);

const increaseCounterCalculations = (subList, pivotMarginName, moveMarginName) => {
  const resultSubList = moveWithIncreaseCounter(subList, pivotMarginName, moveMarginName);
  return joinWithIncreaseCounter(resultSubList, pivotMarginName, moveMarginName);
}

const decreaseCounterCalculations = (subList, pivotMarginName, moveMarginName) => {
  const resultSubList = moveWithDecreaseCounter(subList, pivotMarginName, moveMarginName);
  return joinWithDecreaseCounter(resultSubList, pivotMarginName, moveMarginName);
}

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

const joinWithIncreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  const { cell } = size;
  let joinedList = [];

  for(let i = 0; i < subList.length; i++) {
    let {
        number, 
        margin: {
          [pivotMarginName]: pivotMargin, 
          [moveMarginName]: moveMargin
        }
      } = subList[i],
      {number: nextNumber} = subList[i + 1] || {};
    const resultMoveMargin = calculateResultMargin(
      joinedList, 
      cell, 
      {
        name: moveMarginName, 
        value: moveMargin
      }
    );

    if(nextNumber === number) {
      joinedList.push({
        ...subList[i],
        number: number * 2,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      },
      {
        ...subList[i + 1],
        number: nextNumber,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      });
      i++;
    } else {
      joinedList.push({
        ...subList[i],
        number: number,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      });
    }
  }
  return joinedList;
}

const joinWithDecreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  const { cell } = size;
  let joinedList = [];

  for(let i = subList.length - 1; i >= 0; i--) {
    let {
        number, 
        margin: {
          [pivotMarginName]: pivotMargin, 
          [moveMarginName]: moveMargin
        }
      } = subList[i],
      {number: nextNumber} = subList[i - 1] || {};
    const resultMoveMargin = calculateResultMargin1(
      joinedList, 
      cell, 
      {
        name: moveMarginName, 
        value: moveMargin
      }
    );

    if(nextNumber === number) {
      joinedList.unshift({
        ...subList[i],
        number: number * 2,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      },
      {
        ...subList[i - 1],
        number: nextNumber,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      });
      i--;
    } else {
      joinedList.unshift({
        ...subList[i],
        number: number,
        margin: {
          [moveMarginName]: resultMoveMargin,
          [pivotMarginName]: pivotMargin
        }
      });
    }
  }
  return joinedList;
}

const calculateResultMargin = (joinedList, cell, {name, value}) => {
  const length = joinedList.length;

  if(length > 0 && value - joinedList[length - 1].margin[name] > cell) {
    return value > 0 ? value - cell : value;
  } else {
    return value;
  }
}

const calculateResultMargin1 = (joinedList, cell, {name, value}) => {
  const length = joinedList.length;

  if(length > 0 && value - joinedList[0].margin[name] > cell) {
    return value > 0 ? value - cell : value;
  } else {
    return value;
  }
}
export {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  size
};