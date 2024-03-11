/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { Arrow, BoardOrientation } from 'react-chessboard/dist/chessboard/types'

import { useTypedDispatch, useTypedSelector } from '@redux/store'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import { splitMovesToArrows } from '@shared/utils/splitMovesToArrows'
import { lichessApiHandler } from '@api/lichesApiHandler'
import { setOpeningPageMoveList, setOpeningPageOpeningName } from '@redux/slices/Openings/OpeningPage'

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
  const dispatch = useTypedDispatch()
  const { undoredoFen } = useTypedSelector(state => state.fen)

  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [myOrientation, setMyOrientation] = useState<BoardOrientation>('white')

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
      const arr: Arrow[] = []
      const data = await lichessApiHandler.getLichessInfo(game.fen())

      setGame(new Chess(moveObject.after))
      dispatch(setOpeningPageMoveList(data.moves))
      dispatch(setOpeningPageOpeningName(data.opening.name))
      data.moves.map((move: OpeningFenEvalType, index: number) => {
        index < 3 ? arr.push(splitMovesToArrows(move.uci) as Arrow) : null
      })
      setArrows(arr)
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

  //listener for f shortcut

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'f') {
        setMyOrientation(myOrientation === 'white' ? 'black' : 'white')
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [myOrientation])

  return (
    <div onClick={clearAnalyze}>
      <Chessboard
        onSquareRightClick={s => highlightSquare(s)}
        areArrowsAllowed={false}
        customArrows={arrows}
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
