import http from 'http';
import { Server } from 'socket.io';

import { joinRoom, leaveRoom, syncMatch } from './events';

export default (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'development' ? '*' : process.env.FRONTEND_URL,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    socket.on('join_room', (data) => joinRoom(socket, data.room));
    socket.on('leave_room', (data) => leaveRoom(socket, data.room));
    socket.on('syncMatch', (data) => syncMatch(socket, data));
  });

  return io;
};