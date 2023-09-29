import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams, Link } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import Button from '../components/Buttons'

interface MoveObject {
  move: string
  fen: string
}
const Room = () => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [moveList, setMoveList] = useState<[MoveObject][]>([])
  const [game, setGame] = useState(new Chess())
  const [arrows, setArrows] = useState<Square[][]>([])
  const [fen, setFen] = useState<string>('')
  const { roomID } = useParams()
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const leaveRoom = () => {
    socket.emit('leave_room', roomID)
  }

  socket.on('arrows_drawn', arrowsData => {
    setArrows(arrowsData)
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
  socket.on('get_highlight_square', square => {
    if (!highlightedSquares.includes(square)) {
      setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
    } else {
      setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }
  })
  socket.on('get_list_moves', moveList => {
    setMoveList(moveList)
  })
  socket.on('send_clear_highlight_squares', () => {
    setHighlightedSquares([])
  })
  socket.on('arrows_cleared', () => {
    setArrows([])
  })
  socket.on('analyze_cleared', () => {
    setArrows([])
    setHighlightedSquares([])
  })

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
  const clearHighlightedSquares = () => {
    setArrows([])
    setHighlightedSquares([])
    socket.emit('clear_analyze', { roomID })
  }
  const handleSetGame = (fen: string) => {
    setFen(fen)
    setGame(new Chess(fen))
  }
  const showOldFen = (fen: string) => {
    setGame(new Chess(fen))
  }
  return (
    <>
      <div className="flex flex-col">
        <Link onClick={leaveRoom} to="/">
          Back to home
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <h1>Welcome on room {roomID}</h1>
        <div onClick={clearHighlightedSquares}>
          <Chessboard
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
        <div className="flex flex-col items-center justify-center gap-2">
          <h1>Move list</h1>
          <div className="flex flex-col items-start justify-center gap-2">
            {moveList.map((move, index) => (
              <div className="flex gap-5" key={index}>
                <span className="mr-[-15px]">{index + 1}.</span>
                {move.map((moveObject, index) => (
                  <div className="flex w-14 justify-center rounded-xl border py-1" key={index}>
                    <span
                      onMouseEnter={() => showOldFen(moveObject.fen)}
                      onMouseLeave={() => handleSetGame(fen)}
                      onClick={() => handleSetGame(moveObject.fen)}>
                      {moveObject.move}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Room
