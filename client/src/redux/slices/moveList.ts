import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MoveObject } from '../../shared/types/MoveObject'

type MoveListState<T> = {
  moveList: T[]
  whiteMoves: T[]
  blackMoves: T[]
  moveCounter: number
}

const moveListSlice = createSlice({
  name: 'moveList',
  initialState: {
    moveList: [],
    whiteMoves: [],
    blackMoves: [],
    moveCounter: 1,
  } as MoveListState<MoveObject>,

  reducers: {
    addToMoveCounter: state => {
      state.moveCounter += 1
    },

    setMoveList: (state, action: PayloadAction<MoveObject>) => {
      const { moveList, whiteMoves, blackMoves, moveCounter } = state
      const updatedMoveList = [...moveList, action.payload]

      if (moveCounter % 2 === 0) {
        return {
          moveList: updatedMoveList,
          whiteMoves: [...whiteMoves, action.payload],
          blackMoves,
          moveCounter,
        }
      } else {
        return {
          moveList: updatedMoveList,
          whiteMoves,
          blackMoves: [...blackMoves, action.payload],
          moveCounter,
        }
      }
    },
    clearMoveList: () => {
      return { moveList: [], whiteMoves: [], blackMoves: [], moveCounter: 1 }
    },
  },
})

export const { setMoveList, clearMoveList, addToMoveCounter } = moveListSlice.actions
export default moveListSlice.reducer
