import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { OpeningName } from './OpeningName'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import { lichessApiHandler } from '@api/lichesApiHandler'
import { useQuery } from 'react-query'

type OpeningTableType = {
  fen: string
  openingList: OpeningFenEvalType[]
  openingName: string
}

export const OpeningTable = ({ fen, openingName, openingList }: OpeningTableType) => {
  const { isLoading, data } = useQuery(['getMoves'], async () => await lichessApiHandler.getLichessInfo(fen))

  if (isLoading) return <span className="text-center">loading - please wait...</span>

  if (!data) return <span className="text-center">No records found</span>

  if (data && data.moves.length > 0) {
    return (
      <div className="flex h-1/2 w-full flex-col items-center justify-start">
        <OpeningName openingName={openingName} />
        <table className="mt-2 w-full border-collapse overflow-hidden border text-center hover:overflow-auto">
          <TableHeader />
          <TableBody openingList={openingList.length === 0 ? data.moves : openingList} />
        </table>
      </div>
    )
  }
}
