/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { Arrow, BoardOrientation } from 'react-chessboard/dist/chessboard/types'

import { useTypedSelector } from '@redux/store'
import { fetchLichessInfo } from '@shared/utils/LichesAPI'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import { splitMovesToArrows } from '@shared/utils/splitMovesToArrows'

type ChessboardComponentProps = {
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
  setMovesList: Dispatch<SetStateAction<OpeningFenEvalType[]>>
}

type MoveType = {
  from: string
  to: string
  promotion: string
}

export const OpeningChessboard = ({ game, setGame, setMovesList }: ChessboardComponentProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [myOrientation, setMyOrientation] = useState<BoardOrientation>('white')

  const { undoredoFen } = useTypedSelector(state => state.fen)

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
      const data = await fetchLichessInfo(game.fen())
      setMovesList(data.moves)
      const arr: Arrow[] = []
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
