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
    <section className="flex h-[400px] w-[200px] flex-col items-center gap-2 overflow-y-auto overflow-x-hidden lg:justify-center">
      <div className={`pointer-events-none ${renderSmallBoard ? 'opacity-100' : 'opacity-0'}`}>
        <Chessboard
          boardOrientation={myOrientation as BoardOrientation}
          boardWidth={170}
          position={smallBoardFen}
        />
      </div>
      <h2>Move list</h2>

      <div className="flex flex-wrap">
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
              className={`w-[100px] text-center ${
                move.moveNumber % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black'
              } ${move.moveNumber === moveCounter - 1 ? 'border border-red-600' : null}`}>
              {move.move}
            </span>
          )
        })}
      </div>
    </section>
  )
}
