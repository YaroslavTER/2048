const getMargin = (progress, value) => progress * value;

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

export {
  animate,
  getMargin
};