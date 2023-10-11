import { useEffect, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { Chess, Square } from 'chess.js'
import { Button } from '../../../shared/components/Button'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Socket } from 'socket.io-client'
import { Orientation } from './Orientation'
import { ChessWrap } from './ChessWrap'

interface MoveObject {
  move: string
  fen: string
}
interface MainProps {
  roomID?: string
  socket: Socket
}
export const Main = ({ roomID, socket }: MainProps) => {
  const [moveList, setMoveList] = useState<[MoveObject][]>([])
  const [game, setGame] = useState(new Chess())
  const [fen, setFen] = useState<string>('')
  const [orientation, setOrientation] = useState<BoardOrientation>('white')
  const [otherPlayerOrientation, setOtherPlayerOrientation] = useState<BoardOrientation>('white')
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Square[][]>([])

  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  socket.on('get_list_moves', moveList => {
    setMoveList(moveList)
  })

  const clearBoard = () => {
    setFen('')
    setGame(new Chess())
    setMoveList([])
    socket.emit('clear_board', { roomID })
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

  socket.on('get_other_player_orientation', orientation => {
    setOtherPlayerOrientation(orientation)
  })
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

  socket.on('send_clear_highlight_squares', () => setHighlightedSquares([]))

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

  return (
    <main className="flex h-[100vh] items-center justify-center gap-2">
      <Orientation
        setOrientation={setOrientation}
        socket={socket}
        roomID={roomID}
        setOtherPlayerOrientation={setOtherPlayerOrientation}
        otherPlayerOrientation={otherPlayerOrientation}
        orientation={orientation}
      />

      <div className="flex flex-col items-center justify-center gap-4">
        <ChessWrap
          setFen={setFen}
          socket={socket}
          roomID={roomID}
          orientation={orientation}
          moveList={moveList}
          setMoveList={setMoveList}
          game={game}
          arrows={arrows}
          setArrows={setArrows}
          highlightedSquares={highlightedSquares}
          setHighlightedSquares={setHighlightedSquares}
        />
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
    </main>
  )
}
