import { useState } from 'react'

import { SmallChessboard } from './SmallChessboard/SmallChessboard'
import { Table } from './Table/Table'

export const MoveList = () => {
  const [renderSmallBoard, setRenderSmallBoard] = useState<boolean>(false)
  const [smallBoardFen, setSmallBoardFen] = useState<string>('')

  return (
    <section className="flex h-1/2 w-full flex-col items-center gap-2">
      <SmallChessboard renderSmallBoard={renderSmallBoard} smallBoardFen={smallBoardFen} />
      <Table setRenderSmallBoard={setRenderSmallBoard} setSmallBoardFen={setSmallBoardFen} />
    </section>
  )
}
