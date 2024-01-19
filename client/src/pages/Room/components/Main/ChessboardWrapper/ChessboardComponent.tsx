<<<<<<< HEAD
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
=======
/* eslint-disable react-hooks/exhaustive-deps */
import { Chessboard } from 'react-chessboard'
import { Square, Chess } from 'chess.js'
import { SetStateAction, Dispatch, useState, useEffect } from 'react'
import { MoveObject } from '../../../../../shared/types/MoveObject'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setFen } from '../../../../../redux/slices/fen'
import { addToMoveCounter, setMoveList } from '../../../../../redux/slices/moveList'
import { fetchMovesEval, fetchOpening } from '../../../../../shared/utils/LichesAPI'
import GameService from '../../../../../services/GameService'
import SocketService from '../../../../../services/SocketService'
import { Arrow } from 'react-chessboard/dist/chessboard/types'

type ChessboardComponentProps = {
  game: Chess
>>>>>>> main
  roomID: string
  setGame: Dispatch<SetStateAction<Chess>>
}

<<<<<<< HEAD
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
=======
type MoveType = {
  from: string
  to: string
  promotion: string
}

export const ChessboardComponent = ({ game, roomID, setGame }: ChessboardComponentProps) => {
  const [highlightedSquares, setHighlightedSquares] = useState<string[]>([])
  const [arrows, setArrows] = useState<Arrow[]>([])
  const { myOrientation } = useTypedSelector(state => state.orientation)
  const { moveCounter } = useTypedSelector(state => state.moveList)
  const dispatch = useTypedDispatch()

  // every move trigger this function

  const onDrop = async (sourceSquare: Square, targetSquare: Square) => {
    const move: MoveType = {
>>>>>>> main
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q',
    }
<<<<<<< HEAD
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
      dispatch(setMovesEval(jsonData.moves))
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
=======

    // if checking bellow is checking if move is legall and if its true he run function with move

    if (game.move(move) && SocketService.socket) {
      const sanNotationMove = game.history().pop() as string
      const moveObject: MoveObject = {
        move: sanNotationMove,
        fen: game.fen(),
        moveNumber: moveCounter,
      }
      GameService.gameUpdate(SocketService.socket, moveObject, roomID)
      setGame(new Chess(game.fen()))
      dispatch(addToMoveCounter())
      dispatch(setFen(game.fen()))
      dispatch(setMoveList(moveObject))
      fetchMovesEval(game.fen(), dispatch)
      fetchOpening(game.fen(), dispatch)
    }
  }
  // drowing arrows function
  const arrowDrow = (arrowsData: Arrow[]) => {
    if (arrowsData.length === 0 && arrowsData !== arrows) {
      setArrows([])
      if (SocketService.socket) GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    } else {
      if (arrowsData.flat().join() === arrows.flat().join()) return
      setArrows(arrowsData)
      if (SocketService.socket) GameService.drawArrow(SocketService.socket, arrowsData, roomID)
    }
  }
  //
  const highlightSquare = (square: string) => {
    if (SocketService.socket) {
      GameService.highlightSquare(SocketService.socket, square, roomID)
      !highlightedSquares.includes(square)
        ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
        : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }
  }

  const clearAnalyze = () => {
    if (SocketService.socket) {
      GameService.clearAnalyze(SocketService.socket, roomID)
      setArrows([])
      setHighlightedSquares([])
    }
  }

  useEffect(() => {
    const handleArrowsDrowUpdate = (arrowsData: Arrow[]) => {
      setArrows(arrowsData)
    }

    const handleAnalyzeClearUpdate = () => {
      setArrows([])
      setHighlightedSquares([])
    }

    const handleHiglightSquareUpdate = (square: string) => {
      !highlightedSquares.includes(square)
        ? setHighlightedSquares(prevHighlightedSquares => [...prevHighlightedSquares, square])
        : setHighlightedSquares(prevHighlightedSquares => prevHighlightedSquares.filter(s => s !== square))
    }

    const handleGameUpdate = async (data: MoveObject) => {
      if (game.move(data.move)) {
        setGame(new Chess(game.fen()))
        dispatch(addToMoveCounter())
        dispatch(setFen(game.fen()))
        dispatch(setMoveList(data))
        fetchMovesEval(game.fen(), dispatch)
        fetchOpening(game.fen(), dispatch)
      }
    }

    if (SocketService.socket) GameService.onGameUpdate(SocketService.socket)
    SocketService.socket?.on('move_made', handleGameUpdate)
    if (SocketService.socket) GameService.onHighlightSquareUpdate(SocketService.socket)
    SocketService.socket?.on('get_highlight_square', handleHiglightSquareUpdate)
    if (SocketService.socket) GameService.onClearAnalyze(SocketService.socket)
    SocketService.socket?.on('analyze_cleared', handleAnalyzeClearUpdate)
    if (SocketService.socket) GameService.onDrawArrowUpdate(SocketService.socket)
    SocketService.socket?.on('arrows_drawn', handleArrowsDrowUpdate)

    return () => {
      if (SocketService.socket) {
        SocketService.socket.off('move_made', handleGameUpdate)
        SocketService.socket.off('get_highlight_square', handleHiglightSquareUpdate)
        SocketService.socket.off('analyze_cleared', handleAnalyzeClearUpdate)
        SocketService.socket.off('arrows_drawn', handleArrowsDrowUpdate)
      }
    }
  }, [dispatch, game, setGame, highlightSquare])

  return (
    <div onClick={clearAnalyze}>
      <Chessboard
        onSquareRightClick={s => highlightSquare(s)}
>>>>>>> main
        customArrows={arrows}
        onArrowsChange={arrowDrow}
        onPieceDrop={onDrop}
        position={game.fen()}
<<<<<<< HEAD
        boardOrientation={boardOrientation}
=======
        boardOrientation={myOrientation}
>>>>>>> main
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
