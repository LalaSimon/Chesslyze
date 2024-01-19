<<<<<<< HEAD
import { Chess } from 'chess.js'
import { Dispatch, SetStateAction } from 'react'
import { MoveList } from './Aside/MoveList'
import { OpeningTable } from './Aside/OpeningTable'
import { OpeningName } from './Aside/Opening'

interface AsideProps {
  roomID?: string
  game: Chess
  setGame: Dispatch<SetStateAction<Chess>>
}

export const Aside = ({ game, setGame, roomID }: AsideProps) => {
  return (
    <aside className="mb-auto ml-10 mt-10 flex flex-col items-center gap-4">
      <MoveList game={game} setGame={setGame} roomID={roomID} />
      <OpeningName />
=======
import { MoveList } from './Aside/MoveList'
import { OpeningTable } from './Aside/OpeningTable'

export const Aside = () => {
  return (
    <aside className="flex h-full w-full items-center justify-start gap-4 lg:w-1/3 lg:flex-col">
      <MoveList />
>>>>>>> main
      <OpeningTable />
    </aside>
  )
}
