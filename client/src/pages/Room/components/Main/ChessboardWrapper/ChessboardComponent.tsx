/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { MoveObject } from '../../../../../shared/types/MoveObject'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setFen } from '../../../../../redux/slices/fen'
import { setMoveList } from '../../../../../redux/slices/moveList'
import { setOpening } from '../../../../../redux/slices/opening'
import { setMovesEval } from '../../../../../redux/slices/movesEval'
import { fetchMovesEval, fetchOpening } from '../../../../../shared/utils/LichesAPI'
import GameService from '../../../../../services/GameService'
import SocketService from '../../../../../services/SocketService'
import { Arrow } from 'react-chessboard/dist/chessboard/types'

type ChessboardComponentProps = {
  game: Chess
  roomID: string
  setGame: Dispatch<SetStateAction<Chess>>
}

type TMove = {
  from: string
  to: string
  promotion: string
}

type TMoveData = {
  move: TMove
  moveList: MoveObject[][]
}

export const ChessboardComponent = ({ game, roomID, setGame }: ChessboardComponentProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const { moveList } = useTypedSelector(state => state.moveList)
  const myOrientation = useTypedSelector(state => state.orientation.myOrientation)
  const dispatch = useTypedDispatch()

  const onDrop = async (sourceSquare: Square, targetSquare: Square): Promise<boolean> => {
    const move: TMove = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }

    if (game.move(move)) {
      const sanNotationMove = game.history().pop() as string
      const movesCopy = [...moveList.map(move => [...move])]
      const moveObject: MoveObject = {
        move: sanNotationMove,
        fen: game.fen(),
      }

      if (movesCopy.length === 0) {
        movesCopy.push([moveObject])
      } else if (movesCopy[movesCopy.length - 1].length != 1) {
        movesCopy.push([moveObject])
      } else {
        movesCopy[movesCopy.length - 1].push(moveObject)
      }
      if (SocketService.socket) GameService.gameUpdate(SocketService.socket!, moveList, move, roomID)

      dispatch(setFen(game.fen()))
      dispatch(setMoveList([...movesCopy]))

      const response = await fetch(`https://explorer.lichess.ovh/masters?fen=${game.fen()}`).then(res =>
        res.json()
      )

      if (!response.moves.white && !response.moves.black && !response.moves.draws) {
        dispatch(setMovesEval(response.moves))
      } else dispatch(setMovesEval(''))
      dispatch(setOpening(response.opening.name))

      return true
    } else {
      return false
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
    if (SocketService.socket) GameService.highlightSquare(SocketService.socket, square, roomID)
    !highlightedSquares.includes(square)
      ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
      : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
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

    const handleGameUpdate = async (data: TMoveData) => {
      if (game.move(data.move)) {
        setGame(game)
        dispatch(setMoveList(data.moveList))
        dispatch(setFen(game.fen()))
        await fetchOpening(game.fen(), dispatch)
        await fetchMovesEval(game.fen(), dispatch)
        return true
      } else {
        return false
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
