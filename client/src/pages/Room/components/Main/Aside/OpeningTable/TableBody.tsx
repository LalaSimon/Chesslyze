import type { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import { TableBodyRow } from './TableBodyRow'

type TableBodyProps = {
  openingList: OpeningFenEvalType[]
}

export const TableBody = ({ openingList }: TableBodyProps) => {
  return (
    <tbody>
      <TableBodyRow openingList={openingList} />
    </tbody>
  )
}
