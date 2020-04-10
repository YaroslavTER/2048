const moveBoxAnimation = (box, {top, left}, msDuration) => {
  animate({
    timing: linear,
    draw(progress) {
      setMargin(progress, {name: 'marginLeft', left}, box);
      setMargin(progress, {name: 'marginTop', top}, box);
    },
    duration: msDuration * 1000
  });
};

const animate = ({timing, draw, duration}) => {
  let start = performance.now();
  requestAnimationFrame(function animate(time) {
    let timeFraction = ( time - start ) / duration,
        progress;

    if(timeFraction > 1) {
      timeFraction = 1;
    }
    
    progress = timing(timeFraction);
    
    draw(progress);
    
    if(timeFraction < 1) {
      requestAnimationFrame(animate);
    }
  });
}

const linear = (timeFraction) => timeFraction;

const setMargin = (progress, {name, value}, box) => 
  box.style[name] = `${progress * value}px`;

export {
  moveBoxAnimation
};