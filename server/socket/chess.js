const chess = socket => {
  socket.on('make_a_move', data => socket.broadcast.to(data.roomID).emit('move_made', data.moveObject))

  socket.on('set_game', data => socket.broadcast.to(data.roomID).emit('get_game', data.fen))
}
module = module.exports = chess
