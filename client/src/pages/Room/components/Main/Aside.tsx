import { MoveList } from './Aside/MoveList'
import { OpeningTable } from './Aside/OpeningTable'

export const Aside = () => {
  return (
    <aside className="flex h-full w-full items-center justify-center gap-4 lg:w-1/3 lg:flex-col">
      <MoveList />
      <OpeningTable />
    </aside>
  )
}
