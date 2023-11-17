import { createSlice } from '@reduxjs/toolkit'
import type { MovesEval } from '../../shared/types/MovesEval'
interface movesEvalState {
  movesEval: MovesEval[]
}

export const movesEvalSlice = createSlice({
  name: 'movesEval',
  initialState: {
    movesEval: [],
  } as movesEvalState,

  reducers: {
    setMovesEval: (state, action) => {
      return { ...state, movesEval: action.payload }
    },
    clearMoves: state => {
      return { ...state, movesEval: [] }
    },
  },
})

export const { setMovesEval, clearMoves } = movesEvalSlice.actions
export default movesEvalSlice.reducer
