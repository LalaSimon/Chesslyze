import { Chess } from 'chess.js'
import { Dispatch, SetStateAction } from 'react'
import { MoveList } from './Aside/MoveList'
import { OpeningTable } from './Aside/OpeningTable'
import { OpeningName } from './Aside/OpeningName'

type AsideProps = {
  roomID?: string
  setGame: Dispatch<SetStateAction<Chess>>
}

export const Aside = ({ setGame, roomID }: AsideProps) => {
  return (
    <aside className="mb-auto ml-10 mt-10 flex flex-col items-center gap-4">
      <MoveList setGame={setGame} roomID={roomID} />
      <OpeningName />
      <OpeningTable />
    </aside>
  )
}
