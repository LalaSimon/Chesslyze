import { Chess, Square } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'

interface ChessboardWrapperProps {
  roomID?: string
  clearHighlightedSquares: () => void
  highlightSquare: (square: string) => void
  arrows: Square[][]
  arrowDrow: (arrows: Square[][]) => void
  onDrop: (sourceSquare: Square, targetSquare: Square) => boolean
  game: Chess
  orientation: BoardOrientation
  highlightedSquares: string[]
  clearBoard: () => void
}

export const ChessboardWrapper = ({
  roomID,
  clearHighlightedSquares,
  highlightSquare,
  arrows,
  arrowDrow,
  onDrop,
  game,
  orientation,
  highlightedSquares,
  clearBoard,
}: ChessboardWrapperProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h1>You are in room nr {roomID}</h1>

      <ChessboardComponent
        clearHighlightedSquares={clearHighlightedSquares}
        highlightSquare={highlightSquare}
        arrows={arrows}
        arrowDrow={arrowDrow}
        onDrop={onDrop}
        game={game}
        boardOrientation={orientation}
        highlightedSquares={highlightedSquares}
      />

      <ChessboardButtons clearBoard={clearBoard} />
    </section>
  )
}
