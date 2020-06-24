const app = require('express')(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  Bundler = require('parcel-bundler'),
  bundler = new Bundler(`${__dirname}/../client/index.html`),
  port = process.env.PORT || 3000,
  numberOfUsersInTheRoom = 2;
let roomNumber = 0;

app.use(bundler.middleware());

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('create', ({ room, name }) => {
    room = joinRoom(room, socket);
    console.log(`a room ${room} has been created`);
    console.log(`user name is ${name}`);

    socket.on('leaveRoom', () => {
      socket.disconnect();
      console.log(`user ${socket.id} has left room ${room}`);
    });

    socket.on('score', (points) => {
      socket.broadcast.to(room).emit('score', { name, points });
    });

    socket.on('win', () => {
      socket.broadcast.to(room).emit('win', name);
    });

    socket.on('gameOver', () => {
      socket.broadcast.to(room).emit('gameOver', name);
    });

    socket.on('removeEventHandler', () => {
      io.in(room).emit('removeEventHandler');
    });

    socket.on('refresh', () => {
      socket.broadcast.to(room).emit('refresh');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
});

const joinRoom = (room, socket) => {
  if (room === '') {
    let currentRoom = getCurrentRoom(roomNumber);
    if (currentRoom && currentRoom.length > numberOfUsersInTheRoom - 1) {
      roomNumber++;
    }

    room = roomNumber;
  }
  socket.join(room);
  currentRoom = getCurrentRoom(room);

  if (currentRoom) {
    if (currentRoom.length > numberOfUsersInTheRoom - 1) {
      io.in(room).emit('roomIsFull');
    }

    io.in(room).emit('usersConnected', currentRoom.length);
  }
  return room;
};

const getCurrentRoom = (roomName) => io.of('/').adapter.rooms[roomName];
