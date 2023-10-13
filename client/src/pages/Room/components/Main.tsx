import { useEffect, useState } from 'react'
import { Chess, Square } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Orientation } from './Orientation'
import { ChessboardWrapper } from './ChessboardWrapper'
import { type MoveObject } from '../../../shared/types/MoveObject'
import { MoveList } from './MoveList'
import { io } from 'socket.io-client'

interface MainProps {
  roomID: string
}

export const Main = ({ roomID }: MainProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [moveList, setMoveList] = useState<[MoveObject][]>([])
  const [game, setGame] = useState(new Chess())
  const [arrows, setArrows] = useState<Square[][]>([])
  const [fen, setFen] = useState<string>('')
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
    <main className="flex h-full items-center justify-center gap-2">
      <Orientation
        otherPlayerOrientation={otherPlayerOrientation}
        orientation={orientation}
        changeOtherPlayerOrientation={changeOtherPlayerOrientation}
        handleOrietnation={handleOrietnation}
      />
      <ChessboardWrapper
        roomID={roomID}
        clearHighlightedSquares={clearHighlightedSquares}
        highlightSquare={highlightSquare}
        arrows={arrows}
        arrowDrow={arrowDrow}
        onDrop={onDrop}
        game={game}
        orientation={orientation}
        highlightedSquares={highlightedSquares}
        clearBoard={clearBoard}
      />
      <MoveList
        moveList={moveList}
        setFen={setFen}
        setRenderSmallBoard={setRenderSmallBoard}
        handleSetGame={handleSetGame}
        renderSmallBoard={renderSmallBoard}
        orientation={orientation}
        fen={fen}
        game={game}
      />
    </main>
  )
}
