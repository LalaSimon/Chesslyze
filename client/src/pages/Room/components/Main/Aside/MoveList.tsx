import { Chessboard } from 'react-chessboard'
import { useState } from 'react'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { useTypedSelector } from '../../../../../redux/store'

export const MoveList = () => {
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
  const [smallBoardFen, setSmallBoardFen] = useState<string>('')
  const { myOrientation } = useTypedSelector(state => state.orientation)
  const { moveList, moveCounter } = useTypedSelector(state => state.moveList)

  return (
    <section className="relative mb-auto flex min-w-[285px] flex-col gap-2">
      <h2 className="text-center">Move list</h2>
      <div className="flex w-full flex-wrap">
        {moveList.map((move, index) => {
          return (
            <span
              key={index}
              onMouseEnter={() => {
                setSmallBoardFen(move.fen)
                setRenderSmallBoard(true)
              }}
              onMouseLeave={() => {
                setRenderSmallBoard(false)
              }}
              className={`w-1/2 p-2 text-center ${
                move.moveNumber % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black'
              } ${move.moveNumber === moveCounter - 1 ? 'border border-red-600' : null}`}>
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
