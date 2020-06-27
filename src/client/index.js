import './styles/style.scss';
import io from 'socket.io-client';
import Navigo from 'navigo';
import {
  addButtonHandler,
  hideStartModalWindow,
  showStartModalWindow,
  showConnectionWindow,
  hideConnectionWindow,
  hideGameOverWindow,
  showCompetitorWinWindow,
  drawNumberOfConnectedUsers,
  drawWinCompetitorName,
  renderCompetitorList,
  clearCompetitorList,
  updateCompetitorOnGameOver,
  updateCompetitorOnWin,
} from './render';
import { addModalEventListener } from './startModalWindow';
import { getMaxZIndex } from './moveCalculator';
import { startGame, eventHandler } from './startGame';

const socket = io(),
  router = new Navigo(null, true, '#');
let competitorSet = {};

socket.on('usersConnected', (numberOfUsers) => {
  drawNumberOfConnectedUsers(numberOfUsers);
});

socket.on('roomIsFull', () => {
  hideConnectionWindow();
  startGame(socket, competitorSet);
  addButtonHandler('new-game', () => {
    startGame(socket, competitorSet);
  });
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

router
  .on({
    '/': () => {
      router.navigate(`/`);
      socket.emit('gameOver');
      socket.emit('leaveRoom');
      document.removeEventListener('keydown', eventHandler);
      showStartModalWindow();
      clearCompetitorList();
      competitorSet = {};
    },
    '/:room': () => {
      hideStartModalWindow();
      socket.connect();
    },
  })
  .resolve();

addModalEventListener(socket, router, 0, () => {
  showConnectionWindow(getMaxZIndex());
});
