import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'

interface ChessboardComponentProps {
  clearHighlightedSquares: () => void
  highlightSquare: (square: string) => void
  arrows: Square[][]
  arrowDrow: (arrows: Square[][]) => void
  onDrop: (sourceSquare: Square, targetSquare: Square) => boolean
  game: Chess
  boardOrientation: BoardOrientation
  highlightedSquares: string[]
}

export const ChessboardComponent = ({
  clearHighlightedSquares,
  highlightSquare,
  arrows,
  arrowDrow,
  onDrop,
  game,
  boardOrientation,
  highlightedSquares,
}: ChessboardComponentProps) => {
  return (
    <div onClick={clearHighlightedSquares}>
      <Chessboard
        onSquareRightClick={highlightSquare}
        customArrows={arrows}
        onArrowsChange={arrowDrow}
        onPieceDrop={onDrop}
        position={game.fen()}
        boardOrientation={boardOrientation}
        boardWidth={650}
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
