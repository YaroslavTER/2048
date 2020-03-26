const boxList = Array.from(document.getElementsByClassName('box')),//generate boxList with two items
//with random positions
      size = {
        grid: 4,
        cell: 100
      };
let prevTimeList = [...new Array(boxList.length)].map(() => 0),
  itemList = [
    {
      number: 2,
      margin: {
        top: 0,
        left: 0
      }
    },
    {
      number: 2,
      margin: {
        top: 400,
        left: 0
      }
    }
  ];

document.addEventListener('keydown', function({keyCode, which}) {
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

function calculateMoveDown(inputItemList) {
  let itemList = deepClone(inputItemList);
  const resultItemList = [...new Array(itemList.length)]
    .reduce((accumulator, currentValue, i) => {
      let subList = itemList
        .filter(item => item.margin.left === i * size.cell)
        .sort(({margin: { top: topA } }, {margin: { top: topB }}) => topA - topB);
      
      return accumulator.concat(moveDown(subList));
    }, []);
  console.log(resultItemList);
  /* for(let i = 0; i < itemList.length; i++) {
    let subList = itemList
      .filter(item => item.margin.left === i * size.cell)
      .sort(({margin: { top: topA } }, {margin: { top: topB }}) => topA - topB);
  } */
}

function moveDown(inputSubList) {
  let resultList = [],
    { grid: counter, cell} = size;

  for(let i = inputSubList.length - 1; i >= 0; i--) {
    let {number, key, margin: {left}} = inputSubList[i];
    resultList.unshift({
      number, 
      key,
      margin: { 
        top: counter * cell,
        left
      }
    });
    counter--;
  }

  return resultList;
}

calculateMoveDown([
  {
    number: 2,
    key: 2,
    margin: {
      top: 200,
      left: 0
    },
  },
  {
    number: 2,
    key: 1,
    margin: {
      top: 0,
      left: 0
    }
  },
  {
    number: 2,
    key: 3,
    margin: {
      top: 300,
      left: 0
    },
  },
  {
    number: 4,
    key: 4,
    margin: {
      top: 100,
      left: 0
    }
  }
]);

/*
{
  number: 2,
  key: 1,
  margin: {
    top: 0,
    left: 0
  }
},
{
  number: 2,
  key: 3,
  margin: {
    top: 300,
    left: 0
  },
},
{
  number: 4,
  key: 2,
  margin: {
    top: 400,
    left: 0
  }
}

press key donw

{
  number: 4,
  key: 3,
  margin: {
    top: 300,
    left: 0
  },
},
{
  number: 4,
  key: 2,
  margin: {
    top: 400,
    left: 0
  }
}
*/

function deepClone(list) {
  return JSON.parse(JSON.stringify(list));
}
