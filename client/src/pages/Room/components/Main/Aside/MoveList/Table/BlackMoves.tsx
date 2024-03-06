import { useTypedSelector } from '@redux/store'
import { TableProps } from './Table'

export const BlackMoves = ({ setRenderSmallBoard, setSmallBoardFen }: TableProps) => {
  const { moveList } = useTypedSelector(state => state.moveList)

  return (
    <tr className="flex w-full flex-col gap-1 text-center">
      <th>Black</th>
      {moveList.map((move, index) =>
        move.color === 'b' ? (
          <th
            key={index}
            onMouseEnter={() => {
              setSmallBoardFen(move.after)
              setRenderSmallBoard(true)
            }}
            onMouseLeave={() => {
              setRenderSmallBoard(false)
            }}
            className="h-10 w-full border bg-black text-center text-white">
            <span>{move.san}</span>
          </th>
        ) : null
      )}
    </tr>
  )
}
