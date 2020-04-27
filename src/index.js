import './style.scss';
import { startGame } from './startGame';

document
  .getElementsByClassName('new-game')[0]
  .addEventListener('click', function () {
    startGame();
  });
