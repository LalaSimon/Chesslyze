import { useTypedSelector } from '@redux/store'
import { MoveList } from './MoveList/MoveList'
import { OpeningTable } from './OpeningTable/OpeningTable'

export const Aside = () => {
  const { fen } = useTypedSelector(state => state.fen)
  const { openingList } = useTypedSelector(state => state.openingInfo)

  return (
    <aside className="flex h-full w-full items-center justify-start gap-4 xl:w-1/3 xl:flex-col">
      <MoveList />
      <OpeningTable fen={fen} openingList={openingList} />
    </aside>
  )
}
