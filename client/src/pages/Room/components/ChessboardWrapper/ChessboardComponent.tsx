import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { MoveObject } from '../../../../shared/types/MoveObject'
import { io } from 'socket.io-client'
interface ChessboardComponentProps {
  game: Chess
  boardOrientation: BoardOrientation
  setFen: Dispatch<SetStateAction<string>>
  setMoveList: Dispatch<SetStateAction<[MoveObject][]>>
  moveList: [MoveObject][]
  roomID: string
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardComponent = ({
  game,
  boardOrientation,
  setFen,
  moveList,
  setMoveList,
  roomID,
  setGame,
}: ChessboardComponentProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Square[][]>([])
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const onDrop = (sourceSquare: Square, targetSquare: Square) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }
    if (game.move(move)) {
      const sanNotationMove = game.history().pop() as string
      const movesCopy = [...moveList]
      const moveObject: MoveObject = {
        move: sanNotationMove,
        fen: game.fen(),
      }
      if (movesCopy.length === 0) movesCopy.push([moveObject])
      else if (movesCopy[movesCopy.length - 1].length > 1) {
        movesCopy.push([moveObject])
      } else {
        movesCopy[movesCopy.length - 1].push(moveObject)
      }
      setFen(game.fen())
      setMoveList([...movesCopy])
      socket.emit('make_a_move', {
        moveList: movesCopy,
        move,
        roomID,
      })
      return true
    } else {
      return false
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
  const clearHighlightedSquares = () => {
    setArrows([])
    setHighlightedSquares([])
    socket.emit('clear_analyze', { roomID })
  }

  socket.on('send_clear_highlight_squares', () => setHighlightedSquares([]))
  socket.on('arrows_cleared', () => setArrows([]))
  socket.on('arrows_drawn', arrowsData => setArrows(arrowsData))

  socket.on('analyze_cleared', () => {
    setArrows([])
    setHighlightedSquares([])
  })

  socket.on('move_made', data => {
    if (game.move(data.move)) {
      setGame(game)
      setMoveList(data.moveList)
      return true
    } else {
      return false
    }
  })

  socket.on('get_highlight_square', square =>
    !highlightedSquares.includes(square)
      ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
      : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
  )
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
