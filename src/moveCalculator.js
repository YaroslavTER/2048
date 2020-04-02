const calculateMoveDown = itemList => calculateMove(itemList, 'left', 'top', moveDown);
const calculateMoveUp = itemList => calculateMove(itemList, 'left', 'top', moveUp);
const calculateMoveRight = itemList => calculateMove(itemList, 'top', 'left', moveRight);
const calculateMoveLeft = itemList => calculateMove(itemList, 'top', 'left', moveLeft);
const size = {
  grid: 3,
  cell: 100,
  calculateMoveListLength: 4
};

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
const moveRight = subList => moveWithDecreaseCounter(subList, 'top', 'left');
const moveUp = subList => moveWithIncreaseCounter(subList, 'left', 'top');
const moveLeft = subList => {//pivotMarginName, moveMarginName
  const resultSubList = moveWithIncreaseCounter(subList, 'top', 'left'),
    { cell } = size;
  let joinedList = [];

  for(let i = 0; i < resultSubList.length; i++) {
    let {number, margin: {top, left}} = resultSubList[i],
      {number: nextNumber} = resultSubList[i + 1] || {};
    const resultLeftMargin = calculateResultMargin(
      joinedList, 
      cell, 
      {
        name: 'left', 
        value: left
      }
    );

    if(nextNumber === number) {
      joinedList.push({
        ...resultSubList[i],
        number: number * 2,
        margin: {
          left: resultLeftMargin,
          top
        }
      },
      {
        ...resultSubList[i + 1],
        number: nextNumber,
        margin: {
          left: resultLeftMargin,
          top
        }
      });
      i++;
    } else {
      joinedList.push({
        ...resultSubList[i],
        number: number,
        margin: {
          left: resultLeftMargin,
          top
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

export {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  size
};