import type { openingFenEvalType } from '../../../../../../shared/types/openingFenEval'
import { TableBodyRow } from './TableBodyRow'
type TableBodyProps = {
  openingList: openingFenEvalType[]
}

export const TableBody = ({ openingList }: TableBodyProps) => {
  return (
    <tbody>
      <TableBodyRow openingList={openingList} />
    </tbody>
  )
}
