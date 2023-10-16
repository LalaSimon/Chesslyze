import { Button } from '../../../../shared/components/Button'
import { Dispatch, SetStateAction } from 'react'
import { Chess } from 'chess.js'
import { io } from 'socket.io-client'
import { useTypedDispatch } from '../../../../redux/store'
import { clearFen } from '../../../../redux/slices/fen'
import { clearMoveList } from '../../../../redux/slices/moveList'
interface ChessboardButtonsProps {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const ChessboardButtons = ({ setGame, roomID }: ChessboardButtonsProps) => {
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })
  const dispatch = useTypedDispatch()

  socket.emit('join_room', roomID)

  const clearBoard = () => {
    dispatch(clearFen())
    dispatch(clearMoveList())
    setGame(new Chess())
    socket.emit('clear_board', { roomID })
    socket.disconnect()
  }

  socket.on('board_cleared', () => {
    dispatch(clearMoveList())
    dispatch(clearFen())
    setGame(new Chess())
  })

  return (
    <section className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
    </section>
  )
}
