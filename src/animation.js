const animate = ({timing, draw, duration}) => {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = ( time - start ) / duration,
        progress;

    if(timeFraction > 1) {
      timeFraction = 1;
    }

    if(timeFraction < 1) {
      requestAnimationFrame(animate);
      if(timeFraction < 0)
        return;
    }
    
    progress = timing(timeFraction);
    
    draw(progress);
  });
}

const getMargin = (progress, prevValue, value) => 
  prevValue + (value - prevValue) * progress;

const linear = (timeFraction) => timeFraction;

export {
  animate,
  getMargin,
  linear
};