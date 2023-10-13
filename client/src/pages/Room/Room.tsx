import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useParams, Link } from 'react-router-dom'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import Button from '../../shared/components/Buttons'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'

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
  const [orientation, setOrientation] = useState<BoardOrientation>('white')
  const [otherPlayerOrientation, setOtherPlayerOrientation] = useState<BoardOrientation>('white')
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
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
  socket.on('board_cleared', () => {
    setGame(new Chess())
    setMoveList([])
    setFen('')
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
  socket.on('get_game', fen => {
    setFen(fen)
    setGame(new Chess(fen))
    updateMovesList(fen)
  })
  const clearBoard = () => {
    setFen('')
    setGame(new Chess())
    setMoveList([])
    socket.emit('clear_board', { roomID })
  }

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
    updateMovesList(fen)
    socket.emit('set_game', {
      fen,
      roomID,
    })
  }
  const updateMovesList = (fen: string) => {
    const copiedMoves = []
    let foundFen: boolean = false
    for (const moves of moveList) {
      const copiedMoveList = []
      for (const move of moves) {
        copiedMoveList.push(move)
        if (move.fen === fen) {
          foundFen = true
          break
        }
      }
      copiedMoves.push(copiedMoveList)
      if (foundFen) {
        break
      }
    }
    setMoveList(copiedMoves as [MoveObject][])
  }
  const handleOrietnation = () => {
    if (orientation === 'white') {
      setOrientation('black')
      socket.emit('other_player_orientation', {
        roomID,
        orientation: 'black',
      })
    } else {
      setOrientation('white')
      socket.emit('other_player_orientation', {
        roomID,
        orientation: 'white',
      })
    }
  }
  socket.on('get_other_player_orientation', orientation => {
    setOtherPlayerOrientation(orientation)
  })
  const changeOtherPlayerOrientation = () => {
    socket.emit('change_orientation', {
      roomID,
    })
    setOtherPlayerOrientation(otherPlayerOrientation === 'white' ? 'black' : 'white')
  }
  socket.on('orientation_changed', () => {
    handleOrietnation()
  })

  return (
    <>
      <div className="flex h-[100vh] items-center justify-center gap-2">
        <Link className="absolute left-0 top-0 ml-2" onClick={leaveRoom} to="/">
          Back to home
        </Link>
        <div className="mr-5 flex min-w-fit flex-col gap-5">
          <div className="text-center">
            <span>your orientation</span>
            <Button callback={handleOrietnation} text={orientation === 'white' ? 'white' : 'black'} />
          </div>
          <div className="text-center">
            <span>user orientation</span>
            <Button
              callback={changeOtherPlayerOrientation}
              text={otherPlayerOrientation === 'white' ? 'white' : 'black'}
            />
          </div>
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
              boardOrientation={orientation}
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
            <Button callback={clearBoard} text="Clear" />
          </div>
        </div>
        <div className="relative ml-10 flex min-w-[285px] flex-col gap-2 border">
          <h1 className="text-center">Move list</h1>
          <div className="flex h-[600px] w-full flex-col justify-start gap-6 overflow-scroll pl-10">
            {moveList.map((move, index) => (
              <div className="flex w-full items-center gap-6" key={index}>
                <span>{index + 1}.</span>
                <div className="flex w-full gap-6">
                  {move.map((moveObject, index) => (
                    <div
                      onMouseEnter={() => {
                        setFen(moveObject.fen)
                        setRenderSmallBoard(true)
                      }}
                      onMouseLeave={() => {
                        setFen(game.fen())
                        setRenderSmallBoard(false)
                      }}
                      onClick={() => handleSetGame(moveObject.fen)}
                      className="flex w-14 cursor-pointer justify-center rounded-xl border py-1 hover:bg-gray-200 active:bg-gray-400"
                      key={index}>
                      <span>{moveObject.move}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {renderSmallBoard && (
              <div className="pointer-events-none absolute left-[15px] top-[-300px]">
                <Chessboard boardOrientation={orientation} boardWidth={250} position={fen} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Room
