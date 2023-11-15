import { useTypedDispatch, useTypedSelector } from '../../../redux/store'
import { setMovesEval } from '../../../redux/slices/movesEval'
import { useEffect } from 'react'

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
    <table className="w-full border-collapse border text-center">
      <thead>
        <tr>
          <th className="border p-1">Popularity</th>
          <th className="border p-1">Move</th>
          <th className="border p-1">White Won%</th>
          <th className="border p-1">Black Won%</th>
          <th className="border p-1">Draws%</th>
        </tr>
      </thead>
      <tbody>
        {movesEval.map((dataObj, index) => (
          <tr key={index} className="border p-1">
            <td>{index + 1}.</td>
            <td>{dataObj.san}</td>
            <td className="bg-white">
              {dataObj.white !== 0
                ? (((dataObj.black + dataObj.white + dataObj.draws) / dataObj.white) * 10).toFixed() + '%'
                : '0%'}
            </td>
            <td className="bg-black text-white">
              {dataObj.black !== 0
                ? (((dataObj.black + dataObj.white + dataObj.draws) / dataObj.black) * 10).toFixed() + '%'
                : '0%'}
            </td>
            <td className="bg-gray-500 text-white">
              {dataObj.draws !== 0
                ? (((dataObj.black + dataObj.white + dataObj.draws) / dataObj.draws) * 10).toFixed() + '%'
                : '0%'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
