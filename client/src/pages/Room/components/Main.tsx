import { useState } from 'react'
import { Chess } from 'chess.js'
import { Orientation } from './Main/Orientation'
import { ChessboardWrapper } from './Main/ChessboardWrapper'
import { Aside } from './Main/Aside'

type MainProps = {
  roomID: string
}

export const Main = ({ roomID }: MainProps) => {
  const [game, setGame] = useState(new Chess())

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-2 px-2 py-4 lg:flex-row">
      <Orientation roomID={roomID} />

      <ChessboardWrapper roomID={roomID} game={game} setGame={setGame} />

      <Aside />
    </main>
  )
}
