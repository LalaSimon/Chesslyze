import { Button } from '../../../../../shared/components/Button'
import { Dispatch, SetStateAction } from 'react'
import { Chess } from 'chess.js'
import { io } from 'socket.io-client'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { clearFen } from '../../../../../redux/slices/fen'
import { clearMoveList } from '../../../../../redux/slices/moveList'
import { setOpeningName } from '../../../../../redux/slices/openingName'
import { fetchMovesEval } from '../../../../../shared/utils/LichesAPI'

type ChessboardButtonsProps = {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const ChessboardButtons = ({ setGame, roomID }: ChessboardButtonsProps) => {
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })
  const { fen } = useTypedSelector(state => state.fen)
  const dispatch = useTypedDispatch()

  socket.emit('join_room', roomID)

  const clearBoard = async () => {
    dispatch(clearFen())
    dispatch(clearMoveList())
    dispatch(setOpeningName(''))
    await fetchMovesEval('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', dispatch)
    setGame(new Chess())
    socket.emit('clear_board', { roomID })
    socket.disconnect()
  }

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen)
      alert('skopiowano FEN')
    } catch (err) {
      console.error(err)
    }
  }

  socket.on('board_cleared', async () => {
    try {
      await fetchMovesEval('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', dispatch)
      dispatch(clearMoveList())
      dispatch(clearFen())
      setGame(new Chess())
      dispatch(setOpeningName(''))
    } catch (error) {
      console.log('Wystąpił błąd:', error)
    }
  })
  return (
    <section className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
      <Button callback={copyFen} btnText="Copy fen" />
    </section>
  )
}
