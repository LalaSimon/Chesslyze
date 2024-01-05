const analyze = socket => {
  socket.on('send_list_moves', data =>
    socket.broadcast.to(data.roomID).emit('get_list_moves', data.listMoves)
  )

  socket.on('draw_arrows', data => socket.broadcast.to(data.roomID).emit('arrows_drawn', data.arrowsData))

  socket.on('send_highlight_square', data =>
    socket.broadcast.to(data.roomID).emit('get_highlight_square', data.square)
  )

  socket.on('changeOrientation', data =>
    socket.broadcast.to(data.roomID).emit('onChangeOrientationUpdate', data.orientation)
  )

  socket.on('otherPlayerChangeOrientation', data =>
    socket.broadcast.to(data.roomID).emit('onOtherPlayerChangeOrientationUpdate', data.orientation)
  )

  socket.on('clear_analyze', data => socket.broadcast.to(data.roomID).emit('analyze_cleared'))

  socket.on('cleanBoard', data => socket.broadcast.to(data.roomID).emit('onCleanBoardUpdate'))

  socket.on('fenChange', data => socket.broadcast.to(data.roomID).emit('onFenChangeUpdate', data.fen))
}
module = module.exports = analyze
