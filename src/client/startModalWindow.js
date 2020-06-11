import { getValuesFromStartModalWindow, hideStartModalWindow } from './render';
import { generateRoom } from './roomGenerator';

const modalWindow = document.getElementsByClassName('start-modal-window')[0],
  generateRoomButton = document.getElementsByClassName('generate-room')[0];

generateRoomButton.addEventListener('click', () => {
  document.getElementsByClassName('input-room')[0].value = generateRoom();
});

const addModalEventListener = (socket, score) => {
  modalWindow.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, room } = getValuesFromStartModalWindow();

    socket.emit('create', { room, name });
    socket.emit('score', score);
    socket.emit('refresh');
    hideStartModalWindow();
  });
};

export { addModalEventListener };
