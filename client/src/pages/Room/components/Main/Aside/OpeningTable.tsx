import { useTypedDispatch, useTypedSelector } from '../../../../../redux/store'
import { setMovesEval } from '../../../../../redux/slices/movesEval'
import { useEffect } from 'react'
import { TableHeader } from './OpeningTable/TableHeader'
import { TableBody } from './OpeningTable/TableBody'

export const OpeningTable = () => {
  const { fen } = useTypedSelector(state => state.fen)
  const { movesEval } = useTypedSelector(state => state.movesEval)
  const dispatch = useTypedDispatch()

  const fetchData = async () => {
    return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
      .then(res => res.json())
      .then(data => dispatch(setMovesEval(data.moves)))
  }
  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return !movesEval ? (
    <span>loading - please wait...</span>
  ) : (
    <table className="w-full border-collapse overflow-hidden border text-center hover:overflow-auto">
      {movesEval.length === 0 ? (
        <span>No records found</span>
      ) : (
        <>
          <TableHeader />
          <TableBody movesEval={movesEval} />
        </>
      )}
    </table>
  )
}
