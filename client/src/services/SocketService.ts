import { Socket, io } from 'socket.io-client'

class SocketService {
  public socket: Socket | null = null

  public connect(url: string) {
    return new Promise((resolve, reject) => {
      this.socket = io(url)
      this.socket.on('connect', () => {
        resolve(this.socket as Socket)
      })
      this.socket.on('connect_error', err => {
        console.log('Error', err)
        reject(err)
      })
    })
  }
}

export default new SocketService()
