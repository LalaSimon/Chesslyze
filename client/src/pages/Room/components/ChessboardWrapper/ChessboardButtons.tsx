import { Button } from '../../../../shared/components/Button'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Chess } from 'chess.js'
import { MoveObject } from '../../../../shared/types/MoveObject'
import { io } from 'socket.io-client'
interface ChessboardButtonsProps {
  setFen: Dispatch<SetStateAction<string>>
  setMoveList: Dispatch<SetStateAction<[MoveObject][]>>
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const ChessboardButtons = ({ setFen, setGame, setMoveList, roomID }: ChessboardButtonsProps) => {
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const clearBoard = () => {
    setFen('')
    setGame(new Chess())
    setMoveList([])
    socket.emit('clear_board', { roomID })
  }

  socket.on('board_cleared', () => {
    setGame(new Chess())
    setMoveList([])
    setFen('')
  })

  return (
    <section className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
    </section>
  )
}
