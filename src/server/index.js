const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const Bundler = require('parcel-bundler');
const bundler = new Bundler(__dirname + '/../client/index.html');
let roomNumber = 0;

app.use(bundler.middleware());

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('create', ({ room, name }) => {
    console.log(roomNumber);
    if (room === '') {
      const currentRoom = io.of('/').adapter.rooms[roomNumber];
      if (currentRoom && currentRoom.length > 1) {
        roomNumber++;
      }
      room = roomNumber;
    }
    socket.join(room);
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

http.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});

/* 
- create random room if user didn't generated or input any 
  (send request on create button that will add user to the room)
- fill the room with limited number of users during some time
  (for now let it be 30 seconds)
- if the room is full, generate the new one and connect the users to it
  as in the previous step
*/
