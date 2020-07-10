import './styles/style.scss';
import io from 'socket.io-client';
import Navigo from 'navigo';
import {
  setNumberOfUsers,
  addButtonHandler,
  hideStartModalWindow,
  showStartModalWindow,
  showStartModalWindowContainerOnly,
  isMobileDevice,
  showConnectionWindow,
  hideConnectionWindow,
  hideGameOverWindow,
  showCompetitorWinWindow,
  drawNumberOfConnectedUsers,
  drawWinCompetitorName,
  renderCompetitorList,
  clearCompetitorList,
} from './render';
import { addModalEventListener } from './startModalWindow';
import { getMaxZIndex } from './moveCalculator';
import { playerStatus, updateCompetitorStatus } from './playerStatus';
import { startGame, eventHandler } from './startGame';

const socket = io(),
  router = new Navigo(null, true, '#'),
  goBack = document.getElementsByClassName('go-back')[0];
let competitorSet = {};

goBack.addEventListener('click', () => {
  router.navigate(`/`);
});

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

socket.on('score', ({ name, points, color, id }) => {
  const { playing: status } = playerStatus;
  competitorSet[id] = { points, name, color, status };
  renderCompetitorList(competitorSet);
});

socket.on('refresh', () => {
  socket.emit('score', 0);
});

socket.on('win', (id) => {
  const { name } = competitorSet[id];
  competitorSet[id] = updateCompetitorStatus(competitorSet, id, 'win');

  renderCompetitorList(competitorSet);
  hideGameOverWindow();
  showCompetitorWinWindow(getMaxZIndex());
  drawWinCompetitorName(name);
  socket.emit('removeEventHandler');
});

socket.on('gameOver', (id) => {
  competitorSet[id] = updateCompetitorStatus(competitorSet, id, 'loose');
  renderCompetitorList(competitorSet);
});

socket.on('usersLimit', (numberOfUsers) => {
  setNumberOfUsers(numberOfUsers);
});

router
  .on({
    '/': () => {
      if (!isMobileDevice()) {
        document.getElementsByClassName(
          'input-name'
        )[0].value = window.localStorage.getItem('name');
        router.navigate(`/`);
        socket.emit('gameOver');
        socket.emit('leaveRoom');
        document.removeEventListener('keydown', eventHandler);
        showStartModalWindow();
        clearCompetitorList();
        competitorSet = {};
      } else {
        showStartModalWindowContainerOnly();
      }
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
