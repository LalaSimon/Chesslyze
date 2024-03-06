import { useTypedDispatch, useTypedSelector } from '@redux/store'
import { fetchMovesEval } from '@shared/utils/LichesAPI'
import { useEffect } from 'react'
import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { OpeningName } from './OpeningName'

export const OpeningTable = () => {
  const { fen } = useTypedSelector(state => state.fen)
  const { openingList } = useTypedSelector(state => state.openingInfo)
  const dispatch = useTypedDispatch()

  useEffect(() => {
    fetchMovesEval(fen, dispatch)
  }, [fen, dispatch])

  if (!openingList) return <span className="text-center">loading - please wait...</span>

  if (openingList.length === 0) return <span className="text-center">No records found</span>

  if (openingList.length > 0)
    return (
      <div className="flex h-1/2 w-full flex-col items-center justify-start">
        <OpeningName />
        <table className="mt-2 w-full border-collapse overflow-hidden border text-center hover:overflow-auto">
          <TableHeader />
          <TableBody openingList={openingList} />
        </table>
      </div>
    )
}
