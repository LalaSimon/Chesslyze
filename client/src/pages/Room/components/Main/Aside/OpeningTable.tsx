import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { fetchMovesEval } from '../../../../../shared/utils/LichesAPI'
import { useEffect } from 'react'
import { TableHeader } from './OpeningTable/TableHeader'
import { TableBody } from './OpeningTable/TableBody'

export const OpeningTable = () => {
  const { fen } = useTypedSelector(state => state.fen)
  const { movesEval } = useTypedSelector(state => state.movesEval)
  const dispatch = useTypedDispatch()

  useEffect(() => {
    fetchMovesEval(fen, dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return !movesEval ? (
    <span>loading - please wait...</span>
  ) : movesEval.length === 0 ? (
    <span>No records found</span>
  ) : (
    <table className="w-full border-collapse overflow-hidden border text-center hover:overflow-auto">
      <TableHeader />
      <TableBody movesEval={movesEval} />
    </table>
  )
}
