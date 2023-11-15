import { createSlice } from '@reduxjs/toolkit'

interface MoveEvalType {
  uci: string
  san: string
  game: null
  white: number
  black: number
  averageRating: number
  draws: number
}

interface movesEvalState {
  movesEval: MoveEvalType[]
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
