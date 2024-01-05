import { setOpeningList } from '../../redux/slices/openingList'
import { setOpeningName } from '../../redux/slices/openingName'
import { AppDispatch } from '../../redux/store'

export const fetchMovesEval = async (fen: string, dispatch: AppDispatch) => {
  return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
    .then(res => res.json())
    .then(data => dispatch(setOpeningList(data.moves)))
}
export const fetchOpening = async (fen: string, dispatch: AppDispatch) => {
  return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`)
    .then(res => res.json())
    .then(data => {
      !data ? null : dispatch(setOpeningName(data.opening.name))
    })
}
export const fetchLichessInfo = async (fen: string) => {
  return await fetch(`https://explorer.lichess.ovh/masters?fen=${fen}`).then(res => res.json())
}
