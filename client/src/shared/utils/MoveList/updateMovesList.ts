import { MoveObject } from '../../types/MoveObject'
import { Dispatch, SetStateAction } from 'react'

interface UpdateMovesList {
  fen: string
  moveList: [MoveObject][]
  setMoveList: Dispatch<SetStateAction<[MoveObject][]>>
}

export const updateMovesList = ({ fen, moveList, setMoveList }: UpdateMovesList) => {
  const copiedMoves = []
  let foundFen: boolean = false

  for (const moves of moveList) {
    const copiedMoveList = []
    for (const move of moves) {
      copiedMoveList.push(move)
      if (move.fen === fen) {
        foundFen = true
        break
      }
    }
    copiedMoves.push(copiedMoveList)
    if (foundFen) {
      break
    }
  }
  setMoveList(copiedMoves as [MoveObject][])
}
