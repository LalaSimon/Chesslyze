import { Chessboard } from 'react-chessboard'
<<<<<<< HEAD
import { type MoveObject } from '../../../../../shared/types/MoveObject'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Chess } from 'chess.js'
import { io } from 'socket.io-client'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setFen } from '../../../../../redux/slices/fen'
import { setMoveList } from '../../../../../redux/slices/moveList'
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
    <section className="relative mb-auto flex min-w-[285px] flex-col gap-2">
      <h2 className="text-center">Move list</h2>

      <div className="flex h-[250px] w-full flex-col justify-start gap-6 overflow-hidden pl-10 hover:overflow-y-auto">
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
          <div className="pointer-events-none absolute left-[105%] top-[25%]">
            <Chessboard boardOrientation={orientation as BoardOrientation} boardWidth={170} position={fen} />
          </div>
        )}
      </div>
=======
import { useState } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { useTypedSelector } from '../../../../../redux/store'

export const MoveList = () => {
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
  const [smallBoardFen, setSmallBoardFen] = useState<string>('')
  const { myOrientation } = useTypedSelector(state => state.orientation)
  const { blackMoves, whiteMoves } = useTypedSelector(state => state.moveList)

  return (
    <section className="flex h-1/2 w-full flex-col items-center gap-2  lg:justify-center">
      <div className={`pointer-events-none ${renderSmallBoard ? 'opacity-100' : 'opacity-0'}`}>
        <Chessboard
          boardOrientation={myOrientation as BoardOrientation}
          boardWidth={170}
          position={smallBoardFen}
        />
      </div>
      <table className="flex h-[450px] w-full flex-col items-center justify-start gap-2 overflow-y-auto overflow-x-hidden border">
        <caption>Move list</caption>
        <tbody className="flex w-full gap-1">
          <tr className="flex w-full flex-col gap-1 text-center">
            White
            {whiteMoves.map(move => (
              <th
                onMouseEnter={() => {
                  setSmallBoardFen(move.fen)
                  setRenderSmallBoard(true)
                }}
                onMouseLeave={() => {
                  setRenderSmallBoard(false)
                }}
                className="h-10 w-full border bg-white text-center">
                {move.move}
              </th>
            ))}
          </tr>
          <tr className="flex w-full flex-col gap-1 text-center">
            Black
            {blackMoves.map(move => (
              <th
                onMouseEnter={() => {
                  setSmallBoardFen(move.fen)
                  setRenderSmallBoard(true)
                }}
                onMouseLeave={() => {
                  setRenderSmallBoard(false)
                }}
                className="h-10 w-full bg-black text-center text-white">
                {move.move}
              </th>
            ))}
          </tr>
        </tbody>
      </table>
>>>>>>> main
    </section>
  )
}
