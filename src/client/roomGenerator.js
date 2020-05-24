import { randomInRange } from './render';

const lowercase = 'lowercase',
  uppercase = 'uppercase',
  digits = 'digits',
  simbolsMinmax = {
    [lowercase]: {
      min: 65,
      max: 90,
    },
    [uppercase]: {
      min: 97,
      max: 122,
    },
    [digits]: {
      min: 48,
      max: 57,
    },
  },
  roomNameLength = 10;

const generateRoom = () =>
  [...Array(roomNameLength)]
    .map(() => String.fromCharCode(getRandomSymbol()))
    .join('');

const getRandomSymbol = () => {
  const { min, max } = simbolsMinmax[getRandomSymbolStyle()];
  return randomInRange(min, max);
};

const getRandomSymbolStyle = () => {
  switch (randomInRange(0, 2)) {
    case 0:
      return lowercase;
    case 1:
      return uppercase;
    case 2:
      return digits;
  }
};

export { generateRoom };
