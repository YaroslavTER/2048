import './styles/style.scss';
import { addButtonHandler } from './render';
import { startGame } from './startGame';

startGame();
addButtonHandler('new-game', startGame);
