const size = {
  grid: 3,
  cell: 100,
  calculateMoveListLength: 4
};
const calculateMoveDown = itemList => 
calculateMoveInDirection(itemList, 'top', 'left', moveDown);

const calculateMoveRight = itemList => 
  calculateMoveInDirection(itemList, 'top', 'left', moveRight);

const calculateMoveUp = itemList =>
  calculateMoveInDirection(itemList, 'left', 'top', moveUp);

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

const moveDown = (subList, pivotMarginName, moveMarginName) => 
  moveWithDecreaseCounter(subList, pivotMarginName, moveMarginName);

const moveRight = (subList, pivotMarginName, moveMarginName) => 
  decreaseCounterCalculations(subList, pivotMarginName, moveMarginName);

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
  let joinedList = [];

  for(let i = 0; i < subList.length; i++) {
    const {pair, nextIndex} = joinPair(
      i, 
      joinedList, 
      subList, 
      pivotMarginName, 
      moveMarginName, 
      true
    );
    joinedList.concat(pair);
    i = nextIndex;
  }
  return joinedList;
}

const joinWithDecreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let joinedList = [];

  for(let i = subList.length - 1; i >= 0; i--) {
    const {pair, nextIndex} = joinPair(
      i, 
      joinedList, 
      subList, 
      pivotMarginName, 
      moveMarginName, 
      false
    );
    joinedList.concat(pair);
    i = nextIndex;
  }
  return joinedList;
}

const joinPair = (i, joinedList, subList, pivotMarginName, moveMarginName, isIncreaseCounter) => {
  let {
      number, 
      margin: {
        [pivotMarginName]: pivotMargin, 
        [moveMarginName]: moveMargin
      }
    } = subList[i],
    nextIndex = isIncreaseCounter ? i + 1 : i - 1,
    {number: nextNumber} = subList[nextIndex] || {};
  const { cell } = size,
    resultMoveMargin = calculateResultMargin(
      joinedList, 
      cell, 
      {
        name: moveMarginName, 
        value: moveMargin
      },
      isIncreaseCounter
    );  

  if(nextNumber === number) {
    return {
      pair: [
        {
          ...subList[i],
          number: number * 2,
          margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin
          }
        },
        {
          ...subList[nextIndex],
          number: nextNumber,
          margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin
          }
        }
      ],
      nextIndex
    }
  } else {
    return {
      pair: [
        {
        ...subList[i],
        number: number,
        margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin
          }
        }
      ],
      nextIndex
    }
  }
};

const calculateResultMargin = (joinedList, cell, {name, value}, isIncreaseCounter) => {
  const length = joinedList.length;
  let moveMargin;

  if(isIncreaseCounter && length > 0) {
    moveMargin = joinedList[length - 1].margin[name]
  } else if (length > 0) {
    moveMargin = joinedList[0].margin[name];
  }
  
  if(value -  moveMargin > cell) {
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