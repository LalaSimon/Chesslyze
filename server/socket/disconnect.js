const disconnect = socket => {
  socket.on('leave_room', room => {
    socket.leave(room)
  })

  socket.on('disconnect', room => {
    socket.leave(room)
    socket.disconnect()
  })
}
module = module.exports = disconnect
