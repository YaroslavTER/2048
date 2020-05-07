const size = {
  grid: 3,
  cell: 110,
  calculateMoveListLength: 4,
};
let score = 0;

const calculateMoveDown = (itemList) =>
  calculateMoveInDirection(itemList, 'left', 'top', moveDown);

const calculateMoveRight = (itemList) =>
  calculateMoveInDirection(itemList, 'top', 'left', moveRight);

const calculateMoveUp = (itemList) =>
  calculateMoveInDirection(itemList, 'left', 'top', moveUp);

const calculateMoveLeft = (itemList) =>
  calculateMoveInDirection(itemList, 'top', 'left', moveLeft);

const calculateMoveInDirection = (
  itemList,
  pivotMarginName,
  moveMarginName,
  moveCallback
) =>
  calculateMove(itemList, pivotMarginName, moveMarginName, (subList) =>
    moveCallback(subList, pivotMarginName, moveMarginName)
  );

const calculateMove = (
  itemList,
  pivotMarginName,
  moveMarginName,
  moveCallback
) => {
  let { cell, calculateMoveListLength } = size;
  return [...new Array(calculateMoveListLength)].reduce(
    (accumulator, currentValue, i) => {
      let subList = itemList
        .filter(
          ({ margin: { [pivotMarginName]: pivotMarginValue }, needToRemove }) =>
            pivotMarginValue === i * cell && !needToRemove
        )
        .sort(
          (
            { margin: { [moveMarginName]: marginA } },
            { margin: { [moveMarginName]: marginB } }
          ) => marginA - marginB
        );
      return accumulator.concat(moveCallback(subList));
    },
    []
  );
};

const moveDown = (subList, pivotMarginName, moveMarginName) =>
  decreaseCounterCalculations(subList, pivotMarginName, moveMarginName);

const moveRight = (subList, pivotMarginName, moveMarginName) =>
  decreaseCounterCalculations(subList, pivotMarginName, moveMarginName);

const moveUp = (subList, pivotMarginName, moveMarginName) =>
  increaseCounterCalculations(subList, pivotMarginName, moveMarginName);

const moveLeft = (subList, pivotMarginName, moveMarginName) =>
  increaseCounterCalculations(subList, pivotMarginName, moveMarginName);

const increaseCounterCalculations = (
  subList,
  pivotMarginName,
  moveMarginName
) =>
  counterCalculations(
    subList,
    pivotMarginName,
    moveMarginName,
    moveWithIncreaseCounter,
    joinWithIncreaseCounter
  );

const decreaseCounterCalculations = (
  subList,
  pivotMarginName,
  moveMarginName
) =>
  counterCalculations(
    subList,
    pivotMarginName,
    moveMarginName,
    moveWithDecreaseCounter,
    joinWithDecreaseCounter
  );

const counterCalculations = (
  subList,
  pivotMarginName,
  moveMarginName,
  moveCallback,
  joinCallback
) => {
  const resultSubList = moveCallback(subList, pivotMarginName, moveMarginName);
  return joinCallback(resultSubList, pivotMarginName, moveMarginName);
};

const moveWithIncreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let resultList = [],
    counter = 0,
    { cell } = size;

  for (let i = 0; i < subList.length; i++) {
    let {
      number,
      key,
      margin: { [pivotMarginName]: pivotMarginValue },
    } = subList[i];
    resultList.push({
      number,
      key,
      margin: {
        [moveMarginName]: counter * cell,
        [pivotMarginName]: pivotMarginValue,
      },
    });
    counter++;
  }

  return resultList;
};

const moveWithDecreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let resultList = [],
    { grid: counter, cell } = size;

  for (let i = subList.length - 1; i >= 0; i--) {
    let {
      number,
      key,
      margin: { [pivotMarginName]: pivotMarginValue },
    } = subList[i];
    resultList.unshift({
      number,
      key,
      margin: {
        [moveMarginName]: counter * cell,
        [pivotMarginName]: pivotMarginValue,
      },
    });
    counter--;
  }

  return resultList;
};

const joinWithIncreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let joinedList = [];

  for (let i = 0; i < subList.length; i++) {
    const { pair, nextIndex } = joinPair(
      i,
      joinedList,
      subList,
      pivotMarginName,
      moveMarginName,
      true
    );
    joinedList = joinedList.concat(pair);
    i = nextIndex;
  }
  return joinedList;
};

const joinWithDecreaseCounter = (subList, pivotMarginName, moveMarginName) => {
  let joinedList = [];

  for (let i = subList.length - 1; i >= 0; i--) {
    const { pair, nextIndex } = joinPair(
      i,
      joinedList,
      subList,
      pivotMarginName,
      moveMarginName,
      false
    );
    joinedList = joinedList.concat(pair);
    i = nextIndex;
  }
  return joinedList;
};

const joinPair = (
  i,
  joinedList,
  subList,
  pivotMarginName,
  moveMarginName,
  isIncreaseCounter
) => {
  let {
      number,
      margin: { [pivotMarginName]: pivotMargin, [moveMarginName]: moveMargin },
    } = subList[i],
    nextIndex = isIncreaseCounter ? i + 1 : i - 1,
    { number: nextNumber } = subList[nextIndex] || {},
    gainedScore;
  const { cell } = size,
    resultMoveMargin = calculateResultMargin(
      joinedList,
      cell,
      {
        name: moveMarginName,
        value: moveMargin,
      },
      isIncreaseCounter
    );

  if (nextNumber === number) {
    gainedScore = number * 2;
    score += gainedScore;

    return {
      pair: [
        {
          ...subList[nextIndex],
          number: nextNumber,
          needToRemove: true,
          margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin,
          },
        },
        {
          ...subList[i],
          number: gainedScore,
          margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin,
          },
        },
      ],
      nextIndex,
    };
  } else {
    return {
      pair: [
        {
          ...subList[i],
          number,
          margin: {
            [moveMarginName]: resultMoveMargin,
            [pivotMarginName]: pivotMargin,
          },
        },
      ],
      nextIndex: i,
    };
  }
};

const calculateResultMargin = (
  joinedList,
  cell,
  { name, value },
  isIncreaseCounter
) => {
  const length = joinedList.length;
  let moveMargin;

  if (length > 0) {
    moveMargin = joinedList[length - 1].margin[name];
  }

  if (isIncreaseCounter && value - moveMargin > cell) {
    return getMargin(value, cell);
  } else if (!isIncreaseCounter && moveMargin - value > cell) {
    return getMargin(moveMargin, cell);
  } else {
    return value;
  }
};

const getMargin = (value, cell) => (value > 0 ? value - cell : value);

const someOfMarginsChanged = (itemList, prevList) => {
  return itemList.some(({ key, margin: { top, left } }) => {
    const {
      margin: { top: prevTop, left: prevLeft },
    } = prevList.filter(({ key: prevKey }) => prevKey === key)[0];
    return top !== prevTop || left !== prevLeft;
  });
};

const getScore = () => score;

const resetScore = () => (score = 0);

const isItemListFull = (itemList) => getMaxNumberOfItems() === itemList.length;

const getMaxZIndex = () => getMaxNumberOfItems() + 1;

const getMaxNumberOfItems = () => Math.pow(size.grid + 1, 2);

const isWin = (itemList) => itemList.some(({ number }) => number === 2048);

export {
  size,
  calculateMoveDown,
  calculateMoveUp,
  calculateMoveRight,
  calculateMoveLeft,
  someOfMarginsChanged,
  getScore,
  resetScore,
  isItemListFull,
  getMaxZIndex,
  isWin,
};
