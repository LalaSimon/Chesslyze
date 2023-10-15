import { Button } from '../../../../shared/components/Button'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Chess } from 'chess.js'
import { MoveObject } from '../../../../shared/types/MoveObject'
import { io } from 'socket.io-client'
import { useTypedDispatch } from '../../../../redux/store'
import { clearFen } from '../../../../redux/slices/fen'
interface ChessboardButtonsProps {
  setMoveList: Dispatch<SetStateAction<[MoveObject][]>>
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const ChessboardButtons = ({ setGame, setMoveList, roomID }: ChessboardButtonsProps) => {
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })
  const dispatch = useTypedDispatch()

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const clearBoard = () => {
    dispatch(clearFen())
    setGame(new Chess())
    setMoveList([])
    socket.emit('clear_board', { roomID })
  }

  socket.on('board_cleared', () => {
    setGame(new Chess())
    setMoveList([])
    dispatch(clearFen())
  })

  return (
    <section className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
    </section>
  )
}
