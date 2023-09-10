import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams, Link } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import Button from '../components/Buttons'

interface Move {
  from: string
  to: string
  promotion?: string
}
const Room = () => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [game, setGame] = useState(new Chess())
  const [arrows, setArrows] = useState<Square[][]>([])
  const { roomID } = useParams()
  const socket = io('http://localhost:8080')

  useEffect(() => {
    socket.emit('join_room', roomID)
  })
  socket.on('move_made', move => {
    makeAMove({
      from: move.from,
      to: move.to,
      promotion: 'q',
    })
  })

  socket.on('arrows_drawn', arrowsData => {
    setArrows(arrowsData)
  })

  const leaveRoom = () => {
    socket.emit('leave_room', roomID)
  }

  const makeAMove = (move: Move) => {
    game.move(move)
    setGame(new Chess(game.fen()))
  }
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }
    makeAMove(move)
    socket.emit('make_a_move', {
      moveData: {
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      },
      roomID,
    })
    return true
  }
  const arrowDrow = (arrowsData: Square[][]) => {
    if (arrowsData.length === 0 && arrowsData !== arrows) {
      setArrows([])
      socket.emit('draw_arrows', {
        arrowsData,
        roomID,
      })
    } else {
      if (arrowsData.flat().join() === arrows.flat().join()) return
      setArrows(arrowsData)
      socket.emit('draw_arrows', {
        arrowsData,
        roomID,
      })
    }
  }
  const highlightSquare = (square: string) => {
    if (!highlightedSquares.includes(square)) {
      setHighlightedSquares([...highlightedSquares, square])
      socket.emit('send_highlight_square', {
        square,
        roomID,
      })
    } else {
      setHighlightedSquares(highlightedSquares.filter(s => s !== square))
      socket.emit('send_highlight_square', {
        square,
        roomID,
      })
    }
  }
  socket.on('get_highlight_square', square => {
    if (!highlightedSquares.includes(square)) {
      setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
    } else {
      setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }
  })
  const clearHighlightedSquares = () => {
    socket.emit('clear_highlight_squares', { highlightSquare, roomID })
  }
  socket.on('send_clear_highlight_squares', () => {
    setHighlightedSquares([])
  })
  return (
    <>
      <div className="flex flex-col">
        <Link onClick={leaveRoom} to="/">
          Back to home
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1>Welcome on room {roomID}</h1>
        <div>
          <Chessboard
            onSquareClick={clearHighlightedSquares}
            onSquareRightClick={highlightSquare}
            customArrows={arrows}
            onArrowsChange={arrowDrow}
            onPieceDrop={onDrop}
            position={game.fen()}
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
        <div className="flex gap-5">
          <Button text="Undo" />
          <Button text="Redo" />
        </div>
      </div>
    </>
  )
}

export default Room
