const express = require('express');
const app = express();
const socket = require('socket.io');
const cors = require('cors');
const namespaces = require('./data/namespaces');
const Room = require('./classes/Room');
const PORT = process.env.PORT || 8000;

app.use(express.static(__dirname + '/public'));
app.use(cors);

const server = app.listen(PORT);
const io = socket(server);

app.get('/change-ns', (req, res) => {
  namespaces[0].addRoom(new Room(0, 'Deleted articles', 0));
  io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
  res.json(namespaces[0]);
});

io.on('connection', (socket) => {
  socket.emit('welcome', 'Welcome to the server!');

  socket.on('clientConnect', () => {
    socket.emit('nsList', namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    socket.on('joinRoom', async (roomObj, ack) => {
      const thisNs = namespaces[roomObj.namespaceId];
      const thisRoomObj = thisNs.rooms.find(
        (room) => room.roomTitle === roomObj.roomTitle
      );
      const thisRoomsHistory = thisRoomObj?.history;
      let i = 0;

      socket.rooms.forEach((room) => {
        if (i !== 0) {
          socket.leave(room);
        }

        i++;
      });
      socket.join(roomObj.roomTitle);

      const sockets = await io
        .of(namespace.endpoint)
        .in(roomObj.roomTitle)
        .fetchSockets();
      const socketCount = sockets.length;

      ack({
        numUsers: socketCount,
        thisRoomsHistory,
      });
    });

    socket.on('newMessageToRoom', (messageObj) => {
      const rooms = socket.rooms;
      const currentRoom = [...rooms][1];

      io.of(namespace.endpoint)
        .in(currentRoom)
        .emit('messageToRoom', messageObj);

      const thisNs = namespaces[messageObj.selectedNsId];
      const thisRoom = thisNs.rooms.find(
        (room) => room.roomTitle === currentRoom
      );

      thisRoom.addMessage(messageObj);
    });
  });
});
