import { MoveList } from './Aside/MoveList'
import { OpeningTable } from './Aside/OpeningTable'
import { OpeningName } from './Aside/OpeningName'

export const Aside = () => {
  return (
    <aside className="mb-auto ml-10 mt-10 flex flex-col items-center gap-4">
      <MoveList />
      <OpeningName />
      <OpeningTable />
    </aside>
  )
}
