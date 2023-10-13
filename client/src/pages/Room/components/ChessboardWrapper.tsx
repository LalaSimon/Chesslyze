import { Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'
import { Dispatch, SetStateAction } from 'react'
import { type MoveObject } from '../../../shared/types/MoveObject'
interface ChessboardWrapperProps {
  roomID?: string
  game: Chess
  orientation: BoardOrientation
  setFen: Dispatch<SetStateAction<string>>
  setMoveList: Dispatch<SetStateAction<[MoveObject][]>>
  moveList: [MoveObject][]
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardWrapper = ({
  roomID,
  game,
  orientation,
  setFen,
  setMoveList,
  moveList,
  setGame,
}: ChessboardWrapperProps) => {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h1>You are in room nr {roomID}</h1>
      <ChessboardComponent
        setGame={setGame}
        game={game}
        boardOrientation={orientation}
        roomID={roomID!}
        setFen={setFen}
        setMoveList={setMoveList}
        moveList={moveList}
      />

      <ChessboardButtons setFen={setFen} setGame={setGame} roomID={roomID} setMoveList={setMoveList} />
    </section>
  )
}
