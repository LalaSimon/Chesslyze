import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { MoveObject } from '../../../../../shared/types/MoveObject'
import { io } from 'socket.io-client'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setFen } from '../../../../../redux/slices/fen'
import { setMoveList } from '../../../../../redux/slices/moveList'
import { setOpening } from '../../../../../redux/slices/opening'
import { setMovesEval } from '../../../../../redux/slices/movesEval'

interface ChessboardComponentProps {
  game: Chess
  boardOrientation: BoardOrientation
  roomID: string
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardComponent = ({
  game,
  boardOrientation,
  roomID,
  setGame,
}: ChessboardComponentProps) => {
  const dispatch = useTypedDispatch()
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Square[][]>([])
  const { moveList } = useTypedSelector(state => state.moveList)
  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const onDrop = async (sourceSquare: Square, targetSquare: Square) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }
    if (game.move(move)) {
      const sanNotationMove = game.history().pop() as string
      const movesCopy = [...moveList.map(move => [...move])]
      const moveObject: MoveObject = {
        move: sanNotationMove,
        fen: game.fen(),
      }

      if (movesCopy.length === 0) {
        movesCopy.push([moveObject])
      } else if (movesCopy[movesCopy.length - 1].length != 1) {
        movesCopy.push([moveObject])
      } else {
        movesCopy[movesCopy.length - 1].push(moveObject)
      }

      dispatch(setFen(game.fen()))
      dispatch(setMoveList([...movesCopy]))
      const response = await fetch(`https://explorer.lichess.ovh/masters?fen=${game.fen()}`)
      const jsonData = await response.json()
      if (!jsonData.moves.white && !jsonData.moves.black && !jsonData.moves.draws) {
        dispatch(setMovesEval(jsonData.moves))
      } else dispatch(setMovesEval(''))
      dispatch(setOpening(jsonData.opening.name))

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
      dispatch(setMoveList(data.moveList))
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
