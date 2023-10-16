import { Chessboard } from 'react-chessboard'
import { type MoveObject } from '../../../shared/types/MoveObject'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Chess } from 'chess.js'
import { io } from 'socket.io-client'
import { useTypedDispatch, useTypedSelector } from '../../../redux/store'
import { setFen } from '../../../redux/slices/fen'
import { setMoveList } from '../../../redux/slices/moveList'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
interface MoveListProps {
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const MoveList = ({ game, setGame, roomID }: MoveListProps) => {
  const dispatch = useTypedDispatch()
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
  const { fen } = useTypedSelector(state => state.fen)
  const { moveList } = useTypedSelector(state => state.moveList)
  const { orientation } = useTypedSelector(state => state.orientation)

  const socket = io('http://localhost:3000', {
    transports: ['websocket'],
  })

  useEffect(() => {
    socket.emit('join_room', roomID)
    return () => {
      socket.disconnect()
    }
  }, [roomID, socket])

  const handleSetGame = (fen: string) => {
    dispatch(setFen(fen))
    setGame(new Chess(fen))
    updateMovesList(fen, moveList, setMoveList)
    socket.emit('set_game', {
      fen,
      roomID,
    })
  }

  const updateMovesList = (
    fen: string,
    moveList: [MoveObject][],
    setMoveList: ActionCreatorWithPayload<MoveObject[][]>
  ) => {
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
    dispatch(setMoveList(copiedMoves))
  }

  socket.on('get_game', fen => {
    dispatch(setFen(fen))
    setGame(new Chess(fen))
    updateMovesList(fen, moveList, setMoveList)
  })

  socket.on('get_list_moves', moveList => setMoveList(moveList))

  return (
    <section className="relative ml-10 flex min-w-[285px] flex-col gap-2 border">
      <h2 className="text-center">Move list</h2>

      <div className="flex h-[600px] w-full flex-col justify-start gap-6 overflow-scroll pl-10">
        {moveList.map((move, index) => (
          <div className="flex w-full items-center gap-6" key={index}>
            <span>{index + 1}.</span>

            <div className="flex w-full gap-6">
              {move.map((moveObject, index) => (
                <div
                  onMouseEnter={() => {
                    dispatch(setFen(moveObject.fen))
                    setRenderSmallBoard(true)
                  }}
                  onMouseLeave={() => {
                    dispatch(setFen(game.fen()))
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
            <Chessboard boardOrientation={orientation as BoardOrientation} boardWidth={250} position={fen} />
          </div>
        )}
      </div>
    </section>
  )
}
