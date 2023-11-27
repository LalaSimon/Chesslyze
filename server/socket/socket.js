const analyze = require('./analyze')
const disconnect = require('./disconnect')
const chess = require('./chess')
const { Server } = require('socket.io')

const socket = server => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', socket => {
    socket.on('join_room', room => socket.join(room))
    chess(socket)
    analyze(socket)
    disconnect(socket)
  })
}

module = module.exports = socket
