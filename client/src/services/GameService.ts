import { NavigateFunction } from 'react-router-dom'
import { Socket } from 'socket.io-client'

class GameService {
  public socket: Socket | null = null
  public async joinRoom(socket: Socket, roomID: string, navigate: NavigateFunction) {
    return new Promise(resolve => {
      socket.emit('join_room', roomID)
      socket.on('room_joined', msg => {
        resolve(msg)
      })
      navigate(`/${roomID}`)
    })
  }
}

export default new GameService()
