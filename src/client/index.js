import './styles/style.scss';
import {
  addButtonHandler,
  showConnectionWindow,
  hideConnectionWindow,
  hideGameOverWindow,
  showCompetitorWinWindow,
  drawNumberOfConnectedUsers,
  drawWinCompetitorName,
  renderCompetitorList,
  updateCompetitorOnGameOver,
  updateCompetitorOnWin,
} from './render';
import { addModalEventListener } from './startModalWindow';
import { getMaxZIndex } from './moveCalculator';
import { startGame } from './startGame';
import io from 'socket.io-client';

const socket = io();
let competitorSet = {};

socket.on('usersConnected', (numberOfUsers) => {
  drawNumberOfConnectedUsers(numberOfUsers);
});

socket.on('roomIsFull', () => {
  hideConnectionWindow();
  startGame(socket, competitorSet);
  addButtonHandler('new-game', startGame);
});

socket.on('score', ({ name, points }) => {
  competitorSet[name] = points;
  renderCompetitorList(competitorSet);
});

socket.on('refresh', () => {
  socket.emit('score', 0);
});

socket.on('win', (name) => {
  updateCompetitorOnWin(name);
  hideGameOverWindow();
  showCompetitorWinWindow(getMaxZIndex());
  drawWinCompetitorName(name);
  socket.emit('removeEventHandler');
});

socket.on('gameOver', (name) => {
  updateCompetitorOnGameOver(name);
});

addModalEventListener(socket, 0, () => {
  showConnectionWindow(getMaxZIndex());
});
