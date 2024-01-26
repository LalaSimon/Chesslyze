import { Dispatch, SetStateAction } from 'react'
import { WhiteMoves } from './WhiteMoves'
import { BlackMoves } from './BlackMoves'

export type TableProps = {
  setSmallBoardFen: Dispatch<SetStateAction<string>>
  setRenderSmallBoard: Dispatch<SetStateAction<boolean>>
}

export const Table = ({ setSmallBoardFen, setRenderSmallBoard }: TableProps) => {
  return (
    <table className="flex h-[450px] w-full flex-col items-center justify-start gap-2 overflow-y-auto overflow-x-hidden border">
      <caption>Move list</caption>

      <tbody className="flex w-full gap-1">
        <WhiteMoves setRenderSmallBoard={setRenderSmallBoard} setSmallBoardFen={setSmallBoardFen} />
        <BlackMoves setRenderSmallBoard={setRenderSmallBoard} setSmallBoardFen={setSmallBoardFen} />
      </tbody>
    </table>
  )
}
