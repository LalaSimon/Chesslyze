import { useTypedDispatch } from '@redux/store'
import { Dispatch, SetStateAction, useEffect } from 'react'

import { TableHeader } from './TableHeader'
import { TableBody } from './TableBody'
import { OpeningName } from './OpeningName'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'
import { lichessApiHandler } from '@api/lichesApiHandler'
import { setOpeningList } from '@redux/slices/Analysis/openingInfo'

type OpeningTableType = {
  fen: string
  openingList: OpeningFenEvalType[]
  setMovesList?: Dispatch<SetStateAction<OpeningFenEvalType[]>>
}

export const OpeningTable = ({ fen, openingList, setMovesList }: OpeningTableType) => {
  const dispatch = useTypedDispatch()

  useEffect(() => {
    const getMoves = async () => {
      const data = await lichessApiHandler.getMoves(fen)
      if (setMovesList) setMovesList(data)
      dispatch(setOpeningList(data))
    }
    getMoves()
  }, [fen, dispatch, setMovesList])

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
