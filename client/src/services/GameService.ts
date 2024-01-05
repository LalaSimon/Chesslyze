import { NavigateFunction } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { Arrow, BoardOrientation } from 'react-chessboard/dist/chessboard/types'

class GameService {
  public socket: Socket | null = null

  public async joinRoom(socket: Socket, roomID: string, navigate: NavigateFunction) {
    return new Promise(resolve => {
      navigate(`/${roomID}`)
      socket.emit('join_room', roomID)
      socket.on('room_joined', msg => {
        resolve(msg)
      })
    })
  }

  public async gameUpdate(socket: Socket, moveObject: object, roomID: string) {
    socket.emit('make_a_move', {
      moveObject,
      roomID,
    })
  }

  public onGameUpdate(socket: Socket) {
    socket.on('move_made', data => data)
  }

  public async highlightSquare(socket: Socket, square: string, roomID: string) {
    socket.emit('send_highlight_square', {
      square,
      roomID,
    })
  }

  public onHighlightSquareUpdate(socket: Socket) {
    socket.on('get_highlight_square', data => data)
  }

  public clearAnalyze(socket: Socket, roomID: string) {
    socket.emit('clear_analyze', { roomID })
  }

  public onClearAnalyze(socket: Socket) {
    socket.on('analyze_cleared', () => true)
  }

  public drawArrow(socket: Socket, arrowsData: Arrow[], roomID: string) {
    socket.emit('draw_arrows', {
      arrowsData,
      roomID,
    })
  }
  public onDrawArrowUpdate(socket: Socket) {
    socket.on('arrows_drawn', data => data)
  }

  public changeOrientation(socket: Socket, orientation: BoardOrientation, roomID: string) {
    socket.emit('changeOrientation', {
      orientation,
      roomID,
    })
  }
  public onChangeOrientationUpdate(socket: Socket) {
    socket.on('onChangeOrientationUpdate', orientation => orientation)
  }

  public otherPlayerChangeOrientation(socket: Socket, orientation: BoardOrientation, roomID: string) {
    socket.emit('otherPlayerChangeOrientation', {
      orientation,
      roomID,
    })
  }
  public onOtherPlayerChangeOrientationUpdate(socket: Socket) {
    socket.on('onOtherPlayerChangeOrientationUpdate', orientation => orientation)
  }

  public fenChange(socket: Socket, fen: string, roomID: string) {
    socket.emit('fenChange', {
      roomID,
      fen,
    })
  }
  public onFenChangeUpdate(socket: Socket) {
    socket.on('onFenChangeUpdate', fen => fen)
  }
}
export default new GameService()
