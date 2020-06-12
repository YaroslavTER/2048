const app = require('express')(),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  Bundler = require('parcel-bundler'),
  bundler = new Bundler(__dirname + '/../client/index.html'),
  numberOfUsersInTheRoom = 2;
let roomNumber = 0;

app.use(bundler.middleware());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('create', ({ room, name }) => {
    console.log(roomNumber);
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
    console.log(`a room ${room} has been created`);
    console.log(`user name is ${name}`);

    socket.on('score', (points) => {
      socket.broadcast.to(room).emit('score', { name, points });
    });

    socket.on('win', () => {
      socket.broadcast.to(room).emit('win', name);
    });

    socket.on('gameOver', () => {
      socket.broadcast.to(room).emit('gameOver', name);
    });

    socket.on('refresh', () => {
      socket.broadcast.to(room).emit('refresh');
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
});

const getCurrentRoom = (roomName) => io.of('/').adapter.rooms[roomName];

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
