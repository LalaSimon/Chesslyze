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
  const { moveList, moveCounter } = useTypedSelector(state => state.moveList)

  return (
    <section className="relative mb-auto flex min-w-[285px] flex-col gap-2">
      <h2 className="text-center">Move list</h2>
      <div className="flex w-full flex-wrap">
        {moveList.map(move => {
          return (
            <span
              className={`w-1/2 border p-2 text-center ${
                move.moveNumber % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black'
              }`}>
              {move.move}
            </span>
          )
        })}
      </div>

      <div className="flex h-[250px] w-full flex-col justify-start gap-6 overflow-hidden pl-10 hover:overflow-y-auto">
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
