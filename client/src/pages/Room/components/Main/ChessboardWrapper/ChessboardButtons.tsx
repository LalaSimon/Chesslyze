import { Button } from '../../../../../shared/components/Button'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Chess } from 'chess.js'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { clearFen } from '../../../../../redux/slices/fen'
import { clearMoveList } from '../../../../../redux/slices/moveList'
import { setOpeningName } from '../../../../../redux/slices/openingInfo'
import { fetchMovesEval } from '../../../../../shared/utils/LichesAPI'
import SocketService from '../../../../../services/SocketService'
import GameService from '../../../../../services/GameService'

type ChessboardButtonsProps = {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string
}

export const ChessboardButtons = ({ setGame, roomID }: ChessboardButtonsProps) => {
  const { fen } = useTypedSelector(state => state.fen)
  const dispatch = useTypedDispatch()

  const clearBoard = async () => {
    if (SocketService.socket) {
      GameService.cleanBoard(SocketService.socket, roomID)
      dispatch(clearFen())
      dispatch(clearMoveList())
      dispatch(setOpeningName(''))
      await fetchMovesEval('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', dispatch)
      setGame(new Chess())
    }
  }

  const copyFen = async () => {
    try {
      await navigator.clipboard.writeText(fen)
      alert('skopiowano FEN')
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    const clearBoardHandler = async () => {
      setGame(new Chess())
      dispatch(clearFen())
      dispatch(clearMoveList())
      dispatch(setOpeningName(''))
      await fetchMovesEval('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', dispatch)
    }

    if (SocketService.socket) GameService.onCleanBoardUpdate(SocketService.socket)
    SocketService.socket?.on('onCleanBoardUpdate', clearBoardHandler)

    return () => {
      if (SocketService.socket) SocketService.socket.off('onCleanBoardUpdate', clearBoardHandler)
    }
  }, [dispatch, setGame, fen])

  return (
    <section className="flex gap-5">
      <Button btnText="Undo" />
      <Button btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
      <Button callback={copyFen} btnText="Copy fen" />
    </section>
  )
}
