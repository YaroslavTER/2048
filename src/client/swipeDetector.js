let xDown = null,
  yDown = null;

const setSwipeEventsFor = (element) => {
  element.addEventListener('touchstart', handleTouchStart, false);
  element.addEventListener('touchmove', handleTouchMove, false);
};

function handleTouchStart(evt) {
  const { clientX, clientY } = evt.touchess[0];
  xDown = clientX;
  yDown = clientY;
}

function handleTouchMove(evt) {
  if (!xDown || !yDown) {
    return;
  }

  const { clientX, clientY } = evt.touches[0],
    xUp = clientX,
    yUp = clientY,
    xDiff = xDown - xUp,
    yDiff = yDown - yUp;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    /*most significant*/
    if (xDiff > 0) {
      /* left swipe */
    } else {
      /* right swipe */
    }
  } else {
    if (yDiff > 0) {
      /* up swipe */
    } else {
      /* down swipe */
    }
  }
  /* reset values */
  xDown = null;
  yDown = null;
}

export { setSwipeEventsFor };
