import { MoveList } from './MoveList/MoveList'
import { OpeningTable } from './OpeningTable/OpeningTable'

export const Aside = () => {
  return (
    <aside className="flex h-full w-full items-center justify-start gap-4 xl:w-1/3 xl:flex-col">
      <MoveList />
      <OpeningTable />
    </aside>
  )
}
