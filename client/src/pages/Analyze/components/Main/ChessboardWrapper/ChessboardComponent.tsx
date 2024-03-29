/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { Arrow, BoardPosition } from 'react-chessboard/dist/chessboard/types'
import { lichessApiHandler } from '../../../../../api/lichesApiHandler'
import { MoveObject } from '@shared/types/MoveObject'
import { useTypedDispatch, useTypedSelector } from '@redux/store'
import { setFen, setUndoRedoFen } from '@redux/slices/Analysis/fen'
import { setMoveList } from '@redux/slices/Analysis/moveList'
import GameService from '@services/GameService'
import SocketService from '@services/SocketService'
import { setOpeningList, setOpeningName } from '@redux/slices/Analysis/openingInfo'

type ChessboardComponentProps = {
  game: Chess
  roomID: string
  setGame: Dispatch<SetStateAction<Chess>>
}

type MoveType = {
  from: string
  to: string
  promotion: string
}

export const ChessboardComponent = ({ game, roomID, setGame }: ChessboardComponentProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const { myOrientation } = useTypedSelector(state => state.orientation)
  const { undoredoFen } = useTypedSelector(state => state.fen)
  const dispatch = useTypedDispatch()

  // every move trigger this function

  const onDrop = async (sourceSquare: Square, targetSquare: Square) => {
    const move: MoveType = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }

    // checking bellow if move is legall and if its true he run function with move
    if (!undoredoFen && SocketService.socket && game.move(move) && game.history({ verbose: true })) {
      const moves = game.history({ verbose: true })
      const moveObject = moves[0]
      const lichessInfo = await lichessApiHandler.getLichessInfo(moveObject.after)

      GameService.gameUpdate(SocketService.socket, moveObject, roomID)
      setGame(new Chess(moveObject.after))
      dispatch(setFen(moveObject.after))
      dispatch(setMoveList(moveObject))
      dispatch(setOpeningList(lichessInfo.moves))
      dispatch(setOpeningName(lichessInfo.opening.name))
    }
  }
  // drowing arrows function
  const arrowDrow = (arrowsData: Arrow[]) => {
    if (arrowsData.length === 0 && arrowsData !== arrows && SocketService.socket) {
      setArrows([])
      GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    } else if (SocketService.socket) {
      setArrows(arrowsData)
      GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    }
  }
  // allowing to higlightSquares and unHiglight them
  const highlightSquare = (square: string) => {
    if (SocketService.socket) {
      GameService.highlightSquare(SocketService.socket, square, roomID)
      !highlightedSquares.includes(square)
        ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
        : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }
  }

  //clearing both highlights and arrows
  const clearAnalyze = () => {
    if (SocketService.socket) {
      GameService.clearAnalyze(SocketService.socket, roomID)
      setArrows([])
      setHighlightedSquares([])
    }
  }

  const positionChecker = () => {
    if (undoredoFen === game.fen()) {
      dispatch(setUndoRedoFen(''))
      return game.fen() as BoardPosition
    }
    if (!undoredoFen) return game.fen() as BoardPosition
    if (undoredoFen) return undoredoFen
  }

  //Handling whole sockets listeners
  useEffect(() => {
    const handleArrowsDrowUpdate = (arrowsData: Arrow[]) => {
      setArrows(arrowsData)
    }

    const handleAnalyzeClearUpdate = () => {
      setArrows([])
      setHighlightedSquares([])
    }

    const handleHiglightSquareUpdate = (square: string) => {
      !highlightedSquares.includes(square)
        ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
        : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }

    const handleGameUpdate = async (data: MoveObject) => {
      if (game.move(data.san)) {
        const lichessInfo = await lichessApiHandler.getLichessInfo(data.after)
        setGame(new Chess(data.after))
        dispatch(setFen(data.after))
        dispatch(setMoveList(data))
        dispatch(setOpeningList(lichessInfo.moves))
        dispatch(setOpeningName(lichessInfo.opening.name))
      }
    }

    if (SocketService.socket) GameService.onGameUpdate(SocketService.socket)
    SocketService.socket?.on('move_made', handleGameUpdate)
    if (SocketService.socket) GameService.onHighlightSquareUpdate(SocketService.socket)
    SocketService.socket?.on('get_highlight_square', handleHiglightSquareUpdate)
    if (SocketService.socket) GameService.onClearAnalyze(SocketService.socket)
    SocketService.socket?.on('analyze_cleared', handleAnalyzeClearUpdate)
    if (SocketService.socket) GameService.onDrawArrowUpdate(SocketService.socket)
    SocketService.socket?.on('arrows_drawn', handleArrowsDrowUpdate)

    return () => {
      if (SocketService.socket) {
        SocketService.socket.off('move_made', handleGameUpdate)
        SocketService.socket.off('get_highlight_square', handleHiglightSquareUpdate)
        SocketService.socket.off('analyze_cleared', handleAnalyzeClearUpdate)
        SocketService.socket.off('arrows_drawn', handleArrowsDrowUpdate)
      }
    }
  }, [dispatch, game, setGame, highlightSquare])

  return (
    <div onClick={clearAnalyze}>
      <Chessboard
        onSquareRightClick={s => highlightSquare(s)}
        customArrows={arrows}
        onArrowsChange={arrowDrow}
        onPieceDrop={onDrop}
        position={positionChecker()}
        boardOrientation={myOrientation}
        boardWidth={570}
        customSquareStyles={{
          ...highlightedSquares.reduce(
            (styles: Record<string, React.CSSProperties>, square) => {
              styles[square] = {
                backgroundColor: 'rgb(255, 100, 100)',
              }
              return styles
            },
            {} as Record<string, React.CSSProperties>
          ),
        }}
      />
    </div>
  )
}
