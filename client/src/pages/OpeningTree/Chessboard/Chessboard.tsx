/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState } from 'react'
import { Arrow } from 'react-chessboard/dist/chessboard/types'

import { useTypedDispatch, useTypedSelector } from '@redux/store'
import { setFen } from '@redux/slices/Analysis/fen'
import { setMoveList } from '@redux/slices/Analysis/moveList'
import { fetchMovesEval, fetchOpening } from '@shared/utils/LichesAPI'

type ChessboardComponentProps = {
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
}

type MoveType = {
  from: string
  to: string
  promotion: string
}

export const OpeningChessboard = ({ game, setGame }: ChessboardComponentProps) => {
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
    if (!undoredoFen && game.move(move) && game.history({ verbose: true })) {
      const moves = game.history({ verbose: true })
      const moveObject = moves[0]
      setGame(new Chess(moveObject.after))
      dispatch(setFen(moveObject.after))
      dispatch(setMoveList(moveObject))
      await fetchMovesEval(moveObject.after, dispatch)
      await fetchOpening(moveObject.after, dispatch)
    }
  }
  // drowing arrows function
  const arrowDrow = (arrowsData: Arrow[]) => {
    if (arrowsData.length === 0 && arrowsData !== arrows) {
      setArrows([])
    } else {
      setArrows(arrowsData)
    }
  }
  // allowing to higlightSquares and unHiglight them
  const highlightSquare = (square: string) => {
    !highlightedSquares.includes(square)
      ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
      : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
  }

  //clearing both highlights and arrows
  const clearAnalyze = () => {
    setArrows([])
    setHighlightedSquares([])
  }

  return (
    <div onClick={clearAnalyze}>
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
