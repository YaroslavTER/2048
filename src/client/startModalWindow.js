import {
  getValuesFromStartModalWindow,
  hideStartModalWindow,
  getRandomColor,
} from './render';
import { generateRoom } from './roomGenerator';

const color = getRandomColor();

let modalWindow = document.getElementsByClassName('start-modal-window')[0],
  generateRoomButton = document.getElementsByClassName('generate-room')[0];

generateRoomButton.addEventListener('click', () => {
  document.getElementsByClassName('input-room')[0].value = generateRoom();
});

const addModalEventListener = (socket, router, score, showConnectionWindow) => {
  modalWindow.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, room } = getValuesFromStartModalWindow();

    socket.emit('create', { room, name, color });
    socket.emit('score', score);
    socket.emit('refresh');
    window.localStorage.setItem('name', name);
    router.navigate(`/${getRoomUrl(room)}`);
    hideStartModalWindow();
    showConnectionWindow();
  });
};

const getRoomUrl = (room) => (room === '' ? 'public' : `private-${room}`);

export { addModalEventListener };
