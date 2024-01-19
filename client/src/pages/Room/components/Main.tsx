import { useState } from 'react'
import { Chess } from 'chess.js'
<<<<<<< HEAD
import { Orientation } from './Orientation'
import { ChessboardWrapper } from './ChessboardWrapper'
import { Aside } from './Aside'
=======
import { Orientation } from './Main/Orientation'
import { ChessboardWrapper } from './Main/ChessboardWrapper'
import { Aside } from './Main/Aside'
>>>>>>> main

type MainProps = {
  roomID: string
}

export const Main = ({ roomID }: MainProps) => {
  const [game, setGame] = useState(new Chess())

  return (
<<<<<<< HEAD
    <main className="flex items-center justify-center gap-2">
=======
    <main className="flex h-full w-full flex-col items-center justify-center gap-2 px-2 py-4 lg:flex-row">
>>>>>>> main
      <Orientation roomID={roomID} />

      <ChessboardWrapper roomID={roomID} game={game} setGame={setGame} />

<<<<<<< HEAD
      <Aside game={game} setGame={setGame} roomID={roomID} />
=======
      <Aside />
>>>>>>> main
    </main>
  )
}
