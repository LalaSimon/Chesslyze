import { NavigateFunction } from 'react-router-dom'
import { Socket } from 'socket.io-client'
import { MoveObject } from '../shared/types/MoveObject'
import { Square } from 'react-chessboard/dist/chessboard/types'

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

  public async gameUpdate(socket: Socket, movesCopy: MoveObject[][], move: object, roomID: string) {
    socket.emit('make_a_move', {
      moveList: movesCopy,
      move,
      roomID,
    })
  }

  public onGameUpdate(socket: Socket) {
    socket.on('move_made', data => {
      data
    })
  }

  public async highlightSquare(socket: Socket, square: string, roomID: string) {
    socket.emit('send_highlight_square', {
      square,
      roomID,
    })
  }

  public onHighlightSquareUpdate(socket: Socket) {
    socket.on('get_highlight_square', data => {
      data
    })
  }

  public clearHighlight(socket: Socket, roomID: string) {
    socket.emit('clear_analyze', { roomID })
  }

  public onClearHighlightUpdate(socket: Socket) {
    socket.on('analyze_cleared', () => {
      return true
    })
  }
  public drawArrow(socket: Socket, arrowsData: Square[][], roomID: string) {
    socket.emit('draw_arrows', {
      arrowsData,
      roomID,
    })
  }
  public onDrawArrowUpdate(socket: Socket) {
    socket.on('arrows_drawn', data => {
      data
    })
  }
}
export default new GameService()
