import './style.scss';
import { addButtonHandler } from './render';
import { startGame } from './startGame';
import io from 'socket.io-client';

const socket = io();

startGame();
addButtonHandler('new-game', startGame);
