import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { Chess } from 'chess.js'

import { Button } from '@shared/components/Button'
import { useTypedDispatch, useTypedSelector } from '@redux/store'
import { clearFen, setUndoRedoFen } from '@redux/slices/Analysis/fen'
import { clearMoveList } from '@redux/slices/Analysis/moveList'
import { setOpeningName } from '@redux/slices/Analysis/openingInfo'
import { fetchMovesEval } from '@shared/utils/LichesAPI'
import SocketService from '@services/SocketService'
import GameService from '@services/GameService'

type ChessboardButtonsProps = {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string
}

export const ChessboardButtons = ({ setGame, roomID }: ChessboardButtonsProps) => {
  const { fen } = useTypedSelector(state => state.fen)
  const { moveCounter, moveList } = useTypedSelector(state => state.moveList)
  const showFenNumber = useRef<number>(0)
  const dispatch = useTypedDispatch()

  const clearBoard = async () => {
    if (SocketService.socket) {
      GameService.cleanBoard(SocketService.socket, roomID)
      showFenNumber.current = 0
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

  const handleUndo = () => {
    if (!moveList[moveList.length - (2 - showFenNumber.current)] && SocketService.socket) {
      GameService.undoMove(SocketService.socket, roomID)
      dispatch(setUndoRedoFen(moveList[0].before))
      showFenNumber.current--
    } else if (SocketService.socket) {
      GameService.undoMove(SocketService.socket, roomID)
      dispatch(setUndoRedoFen(moveList[moveList.length - (2 - showFenNumber.current)].after))
      showFenNumber.current--
    }
  }

  const handleRedo = () => {
    if (SocketService.socket) {
      GameService.redoMove(SocketService.socket, roomID)
      dispatch(setUndoRedoFen(moveList[moveList.length + showFenNumber.current].after))
      showFenNumber.current++
    }
  }

  useEffect(() => {
    const clearBoardHandler = async () => {
      showFenNumber.current = 0
      setGame(new Chess())
      dispatch(clearFen())
      dispatch(clearMoveList())
      dispatch(setOpeningName(''))
      await fetchMovesEval('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', dispatch)
    }

    const undoMoveHandler = () => {
      if (!moveList[moveList.length - (2 - showFenNumber.current)]) {
        dispatch(setUndoRedoFen(moveList[0].before))
        showFenNumber.current--
      } else {
        dispatch(setUndoRedoFen(moveList[moveList.length - (2 - showFenNumber.current)].after))
        showFenNumber.current--
      }
    }

    const redoMoveHandler = () => {
      dispatch(setUndoRedoFen(moveList[moveList.length + showFenNumber.current].after))
      showFenNumber.current++
    }

    if (SocketService.socket) GameService.onCleanBoardUpdate(SocketService.socket)
    SocketService.socket?.on('onCleanBoardUpdate', clearBoardHandler)

    if (SocketService.socket) GameService.onUndoMoveUpdate(SocketService.socket)
    SocketService.socket?.on('onUndoMoveUpdate', undoMoveHandler)

    if (SocketService.socket) GameService.onRedoMoveUpdate(SocketService.socket)
    SocketService.socket?.on('onRedoMoveUpdate', redoMoveHandler)

    return () => {
      if (SocketService.socket) SocketService.socket.off('onCleanBoardUpdate', clearBoardHandler)
      if (SocketService.socket) SocketService.socket.off('onUndoMoveUpdate', undoMoveHandler)
      if (SocketService.socket) SocketService.socket.off('onRedoMoveUpdate', redoMoveHandler)
    }
  }, [dispatch, setGame, fen, moveList, showFenNumber])

  return (
    <section className="flex gap-5">
      <Button
        disabled={moveCounter === -1 || !moveList[moveList.length - (1 - showFenNumber.current)]}
        callback={handleUndo}
        btnText="Undo"
      />
      <Button disabled={showFenNumber.current === 0} callback={handleRedo} btnText="Redo" />
      <Button callback={clearBoard} btnText="Clear" />
      <Button callback={copyFen} btnText="Copy fen" />
    </section>
  )
}
