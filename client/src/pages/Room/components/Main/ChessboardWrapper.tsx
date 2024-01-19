import { Chess } from 'chess.js'
<<<<<<< HEAD
import { BoardOrientation } from 'react-chessboard/dist/chessboard/types'
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'
import { Dispatch, SetStateAction } from 'react'
import { useTypedSelector } from '../../../../redux/store'

interface ChessboardWrapperProps {
  roomID?: string
=======
import { ChessboardComponent } from './ChessboardWrapper/ChessboardComponent'
import { ChessboardButtons } from './ChessboardWrapper/ChessboardButtons'
import { Dispatch, SetStateAction } from 'react'
import { ChessboardFenInput } from './ChessboardWrapper/ChessboardFenInput'

type ChessboardWrapperProps = {
  roomID: string
>>>>>>> main
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
}

export const ChessboardWrapper = ({ roomID, game, setGame }: ChessboardWrapperProps) => {
<<<<<<< HEAD
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
=======
  return (
    <section className="flex w-2/4 flex-col items-center justify-center gap-4">
      <ChessboardComponent setGame={setGame} game={game} roomID={roomID!} />
      <ChessboardButtons setGame={setGame} roomID={roomID} />
      <ChessboardFenInput roomID={roomID} setGame={setGame} />
>>>>>>> main
    </section>
  )
}
