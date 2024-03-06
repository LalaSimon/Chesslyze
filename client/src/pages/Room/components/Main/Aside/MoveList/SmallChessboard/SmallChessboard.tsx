import { useTypedSelector } from '@redux/store'
import { Chessboard } from 'react-chessboard'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'

type SmallChessboardProps = {
  renderSmallBoard: boolean
  smallBoardFen: string
}

export const SmallChessboard = ({ renderSmallBoard, smallBoardFen }: SmallChessboardProps) => {
  const { myOrientation } = useTypedSelector(state => state.orientation)
  return (
    <div className={`pointer-events-none ${renderSmallBoard ? 'opacity-100' : 'opacity-0'} hidden xl:block`}>
      <Chessboard
        boardOrientation={myOrientation as BoardOrientation}
        boardWidth={170}
        position={smallBoardFen}
      />
    </div>
  )
}
