const Express = require('express')
const app = new Express()
const http = require('http')
const server = http.createServer(app)
const port = 3000
const cors = require('cors')
const { Server } = require('socket.io')

const main = () => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })
  app.use(cors())
  app.get('/', (req, res) => {})
  io.on('connection', socket => {
    socket.on('join_room', room => {
      socket.join(room)
    })
    socket.on('make_a_move', data => {
      console.log(data)
      socket.broadcast.to(data.roomID).emit('move_made', data)
    })
    socket.on('draw_arrows', data => {
      socket.broadcast.to(data.roomID).emit('arrows_drawn', data.arrowsData)
    })
    socket.on('clear_analyze', data => {
      socket.broadcast.to(data.roomID).emit('analyze_cleared')
    })
    socket.on('send_highlight_square', data => {
      socket.broadcast.to(data.roomID).emit('get_highlight_square', data.square)
    })
    socket.on('send_list_moves', data => {
      socket.broadcast.to(data.roomID).emit('get_list_moves', data.listMoves)
    })
    socket.on('set_game', data => {
      socket.broadcast.to(data.roomID).emit('get_game', data.fen)
    })
    socket.on('leave_room', room => {
      socket.leave(room)
    })
    socket.on('disconnect', room => {
      socket.leave(room)
      socket.disconnect()
    })
  })
  server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}
main()
