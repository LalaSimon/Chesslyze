import { useTypedSelector } from '../../../../../../../redux/store'
import { TableProps } from './Table'

export const WhiteMoves = ({ setRenderSmallBoard, setSmallBoardFen }: TableProps) => {
  const { whiteMoves } = useTypedSelector(state => state.moveList)

  return (
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
  )
}
