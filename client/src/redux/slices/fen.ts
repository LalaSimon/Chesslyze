import { createSlice } from '@reduxjs/toolkit'

interface FenState {
  fen: string
}

export const fenSlice = createSlice({
  name: 'fen',
  initialState: {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  } as FenState,

  reducers: {
    setFen: (state, action) => {
      return { ...state, fen: action.payload }
    },
    clearFen: state => {
      return { ...state, fen: '' }
    },
  },
})

export const { setFen, clearFen } = fenSlice.actions
export default fenSlice.reducer
