const boxList = Array.from(document.getElementsByClassName('box')),
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


/* 
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

down button

{
  number: 4,
  margin: {
    top: 400,
    left: 0
  }
}

-------------

{
  number: 4,
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

down button

{
  number: 4,
  margin: {
    top: 300,
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

-------------

{
  number: 4,
  margin: {
    top: 0,
    left: 0
  }
},
{
  number: 4,
  margin: {
    top: 300,
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

down button

{
  number: 4,
  margin: {
    top: 200,
    left: 0
  }
},
{
  number: 4,
  margin: {
    top: 0,
    left: 300
  }
},
{
  number: 2,
  margin: {
    top: 400,
    left: 0
  }
}

up button

{
  number: 4,
  margin: {
    top: 0,
    left: 0
  }
},
{
  number: 4,
  margin: {
    top: 200,
    left: 0
  }
},
{
  number: 2,
  margin: {
    top: 300,
    left: 0
  }
}

*/

document.addEventListener('keydown', function({keyCode, which}) {
  boxList.forEach((box, index) => {
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
      case(40):
        box.style.marginTop = shiftValue;//`shitValue` will be result of `colisionHandler` for the `box`
        break;
      case(39):
        box.style.marginLeft = shiftValue;
        break;
      case(38):
        box.style.marginTop = startValue;
        break;
      case(37):
        box.style.marginLeft = startValue;
        break;
    }

    prevTimeList[index] = currentTime;
  });
});

/* 
handle colision for each move: bottom, up, left, right
*/

function colisionHandler(inputItemList) {
  const length = inputItemList.length;
  let itemList = deepClone(inputItemList);

  for(let i = 0; i < length; i++) {
    for(let j = 0; j < length; j++) {
    }
  }
  return itemList;
}

function deepClone(list) {
  return JSON.parse(JSON.stringify(list));
}
