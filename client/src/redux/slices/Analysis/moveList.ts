import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoveObject } from '@shared/types/MoveObject'

type MoveListState<T> = {
  moveList: T[]
  moveCounter: number
}

const moveListSlice = createSlice({
  name: 'moveList',
  initialState: {
    moveList: [],
    moveCounter: -1,
  } as MoveListState<MoveObject>,

  reducers: {
    setMoveList: (state, action: PayloadAction<MoveObject>) => {
      let moveCounter = state.moveCounter
      const moveList = state.moveList

      moveCounter++
      const updatedMoveList = [...moveList, action.payload]
      return { moveList: updatedMoveList, moveCounter }
    },
    clearMoveList: () => {
      return { moveList: [], whiteMoves: [], blackMoves: [], moveCounter: -1 }
    },
  },
})

export const { setMoveList, clearMoveList } = moveListSlice.actions
export default moveListSlice.reducer
