import { Chess } from 'chess.js'
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'
import { Dispatch, SetStateAction } from 'react'
import { useTypedSelector } from '../../../../redux/store'
import { ChessboardFenInput } from './ChessboardWrapper/ChessboardFenInput'

type ChessboardWrapperProps = {
  roomID?: string
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardWrapper = ({ roomID, game, setGame }: ChessboardWrapperProps) => {
  const { orientation } = useTypedSelector(state => state.orientation)

  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <h1>You are in room nr {roomID}</h1>
      <ChessboardComponent
        setGame={setGame}
        game={game}
        boardOrientation={orientation as BoardOrientation}
        roomID={roomID!}
      />

      <ChessboardButtons setGame={setGame} roomID={roomID} />
      <ChessboardFenInput setGame={setGame} />
    </section>
  )
}
