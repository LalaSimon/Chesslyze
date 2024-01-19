import { Chessboard } from 'react-chessboard'
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
    </section>
  )
}
