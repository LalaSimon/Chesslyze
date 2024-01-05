import { Chessboard } from 'react-chessboard'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { Chess } from 'chess.js'
import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'

type MoveListProps = {
  setGame: Dispatch<SetStateAction<Chess>>
  roomID: string | undefined
}

export const MoveList = ({ setGame, roomID }: MoveListProps) => {
  const dispatch = useTypedDispatch()
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
  const [smallBoardFen, setSmallBoardFen] = useState<string>('')
  const { openingList } = useTypedSelector(state => state.openingInfo)
  const { myOrientation } = useTypedSelector(state => state.orientation)

  // const handleSetGame = async (fen: string) => {
  //   dispatch(setFen(fen))
  //   setGame(new Chess(fen))
  //   updateMovesList(fen, openingList, setOpeningList)
  //   await fetchOpening(fen, dispatch)
  //   socket.emit('set_game', {
  //     fen,
  //     roomID,
  //   })
  // }

  // const updateMovesList = (
  //   fen: string,
  //   moveList: MoveObject[],
  //   setMoveList: ActionCreatorWithPayload<MoveObject[][]>
  // ) => {
  //   const copiedMoves = []
  //   let foundFen: boolean = false

  //   for (const moves of moveList) {
  //     const copiedMoveList = []
  //     for (const move of moves) {
  //       copiedMoveList.push(move)
  //       if (move.fen === fen) {
  //         foundFen = true
  //         break
  //       }
  //     }
  //     copiedMoves.push(copiedMoveList)
  //     if (foundFen) {
  //       break
  //     }
  //   }
  //   dispatch(setMoveList(copiedMoves))
  // }

  // socket.on('get_game', fen => {
  //   dispatch(setFen(fen))
  //   setGame(new Chess(fen))
  //   updateMovesList(fen, moveList, setMoveList)
  // })

  // socket.on('get_list_moves', moveList => setMoveList(moveList))

  return (
    <section className="relative mb-auto flex min-w-[285px] flex-col gap-2">
      <h2 className="text-center">Move list</h2>

      <div className="flex h-[250px] w-full flex-col justify-start gap-6 overflow-hidden pl-10 hover:overflow-y-auto">
        {/* {moveList.map((move, index) => (
          <div className="flex w-full items-center gap-6" key={index}>
            <span>{index + 1}.</span>

            <div className="flex w-full gap-6">
              {move.map((moveObject, index) => (
                <div
                  onMouseEnter={() => {
                    setSmallBoardFen(moveObject.fen)
                    setRenderSmallBoard(true)
                  }}
                  onMouseLeave={() => {
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
        ))} */}
        {renderSmallBoard && (
          <div className="pointer-events-none absolute left-[105%] top-[25%]">
            <Chessboard
              boardOrientation={myOrientation as BoardOrientation}
              boardWidth={170}
              position={smallBoardFen}
            />
          </div>
        )}
      </div>
    </section>
  )
}
