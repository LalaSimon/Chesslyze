/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { MoveObject } from '../../../../../shared/types/MoveObject'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setFen } from '../../../../../redux/slices/fen'
import { addToMoveCounter, setMoveList } from '../../../../../redux/slices/moveList'
import { fetchMovesEval, fetchOpening } from '../../../../../shared/utils/LichesAPI'
import GameService from '../../../../../services/GameService'
import SocketService from '../../../../../services/SocketService'
import { Arrow } from 'react-chessboard/dist/chessboard/types'

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
  const { moveCounter } = useTypedSelector(state => state.moveList)
  const dispatch = useTypedDispatch()

  const onDrop = async (sourceSquare: Square, targetSquare: Square) => {
    const move: MoveType = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }

    // if checking bellow is checking if move is legall and if its true he run function with move

    if (game.move(move) && SocketService.socket) {
      const sanNotationMove = game.history().pop() as string
      const moveObject: MoveObject = {
        move: sanNotationMove,
        fen: game.fen(),
        moveNumber: moveCounter,
      }
      GameService.gameUpdate(SocketService.socket, moveObject, roomID)
      setGame(new Chess(game.fen()))
      dispatch(addToMoveCounter())
      dispatch(setFen(game.fen()))
      dispatch(setMoveList(moveObject))
      fetchMovesEval(game.fen(), dispatch)
      fetchOpening(game.fen(), dispatch)
    }
  }

  const arrowDrow = (arrowsData: Arrow[]) => {
    if (arrowsData.length === 0 && arrowsData !== arrows) {
      setArrows([])
      if (SocketService.socket) GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    } else {
      if (arrowsData.flat().join() === arrows.flat().join()) return
      setArrows(arrowsData)
      if (SocketService.socket) GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    }
  }

  const highlightSquare = (square: string) => {
    if (SocketService.socket) {
      GameService.highlightSquare(SocketService.socket, square, roomID)
      !highlightedSquares.includes(square)
        ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
        : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }
  }

  const clearHighlightedSquares = () => {
    if (SocketService.socket) {
      GameService.clearAnalyze(SocketService.socket, roomID)
      setArrows([])
      setHighlightedSquares([])
    }
  }

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
      if (game.move(data.move)) {
        setGame(new Chess(game.fen()))
        dispatch(addToMoveCounter())
        dispatch(setFen(game.fen()))
        dispatch(setMoveList(data))
        fetchMovesEval(game.fen(), dispatch)
        fetchOpening(game.fen(), dispatch)
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
    <div onClick={clearHighlightedSquares}>
      <Chessboard
        onSquareRightClick={s => highlightSquare(s)}
        customArrows={arrows}
        onArrowsChange={arrowDrow}
        onPieceDrop={onDrop}
        position={game.fen()}
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
