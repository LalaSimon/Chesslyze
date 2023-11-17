import { setMovesEval } from '../../../redux/slices/movesEval'
import { setOpening } from '../../../redux/slices/opening'
import { AppDispatch } from '../../../redux/store'

export const fetchMovesEval = async (fen: string, dispatch: AppDispatch) => {
  return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
    .then(res => res.json())
    .then(data => dispatch(setMovesEval(data.moves)))
}
export const fetchOpening = async (fen: string, dispatch: AppDispatch) => {
  return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
    .then(res => res.json())
    .then(data => {
      !data ? null : dispatch(setOpening(data.opening.name))
    })
}
