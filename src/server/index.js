var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const Bundler = require('parcel-bundler');
const bundler = new Bundler(__dirname + '/../client/index.html');
app.use(bundler.middleware());

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('create', function (room) {
    socket.join(room);
    console.log(`a room ${room} has been created`);

    socket.on('score', (points) => {
      socket.broadcast.to(room).emit('score', points);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});