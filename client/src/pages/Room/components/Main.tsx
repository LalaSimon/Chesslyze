import { useState } from 'react'
import { Chess } from 'chess.js'
import { Orientation } from './Orientation'
import { ChessboardWrapper } from './ChessboardWrapper'
import { MoveList } from './MoveList'

interface MainProps {
  roomID: string
}

export const Main = ({ roomID }: MainProps) => {
  const [game, setGame] = useState(new Chess())

  return (
    <main className="flex h-full items-center justify-center gap-2">
      <Orientation roomID={roomID} />

      <ChessboardWrapper roomID={roomID} game={game} setGame={setGame} />

      <MoveList game={game} setGame={setGame} roomID={roomID} />
    </main>
  )
}
