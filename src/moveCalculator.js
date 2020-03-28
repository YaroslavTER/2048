const calculateMoveDown = itemList => calculateMove(itemList, 'left', 'top', moveDown);
const calculateMoveUp = itemList => calculateMove(itemList, 'left', 'top', moveUp);
const calculateMoveRight = itemList => calculateMove(itemList, 'top', 'left', moveRight);
const calculateMoveLeft = itemList => calculateMove(itemList, 'top', 'left', moveLeft);
const size = {
  grid: 3,
  cell: 100
};

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

export {
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  size
};