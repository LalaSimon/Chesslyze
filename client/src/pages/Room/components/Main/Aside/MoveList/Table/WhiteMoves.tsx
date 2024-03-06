import { useTypedSelector } from '@redux/store'
import { TableProps } from './Table'

export const WhiteMoves = ({ setRenderSmallBoard, setSmallBoardFen }: TableProps) => {
  const { moveList } = useTypedSelector(state => state.moveList)

  return (
    <tr className="flex w-full flex-col gap-1 text-center">
      <th>White</th>
      {moveList.map((move, index) =>
        move.color === 'w' ? (
          <th
            key={index}
            onMouseEnter={() => {
              setSmallBoardFen(move.after)
              setRenderSmallBoard(true)
            }}
            onMouseLeave={() => {
              setRenderSmallBoard(false)
            }}
            className="h-10 w-full border bg-white text-center">
            {move.san}
          </th>
        ) : null
      )}
    </tr>
  )
}
