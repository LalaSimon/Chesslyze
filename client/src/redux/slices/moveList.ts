import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoveObject } from '../../shared/types/MoveObject'

type MoveListState<T> = {
  moveList: T[]
  whiteMoves: T[]
  blackMoves: T[]
}

const moveListSlice = createSlice({
  name: 'moveList',

  initialState: {
    moveList: [],
    whiteMoves: [],
    blackMoves: [],
  } as MoveListState<MoveObject>,

  reducers: {
    setMoveList: (state, action: PayloadAction<MoveObject>) => {
      const { moveList, whiteMoves, blackMoves } = state
      const { moveNumber } = action.payload
      const updatedMoveList = [...moveList, action.payload]

      if (moveNumber % 2 === 1) {
        return { moveList: updatedMoveList, whiteMoves: [...whiteMoves, action.payload], blackMoves }
      } else {
        return { moveList: updatedMoveList, whiteMoves, blackMoves: [...blackMoves, action.payload] }
      }
    },
    clearMoveList: () => {
      return { moveList: [], whiteMoves: [], blackMoves: [] }
    },
  },
})

export const { setMoveList, clearMoveList } = moveListSlice.actions
export default moveListSlice.reducer
