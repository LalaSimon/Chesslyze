import { createSlice } from '@reduxjs/toolkit'

interface FenState {
  fen: string
  undoredoFen: string
}

export const fenSlice = createSlice({
  name: 'fen',
  initialState: {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    undoredoFen: '',
  } as FenState,

  reducers: {
    setFen: (state, action) => {
      return { ...state, fen: action.payload }
    },
    clearFen: state => {
      return { ...state, fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', undoredoFen: '' }
    },
    setUndoRedoFen: (state, action) => {
      return { ...state, undoredoFen: action.payload }
    },
  },
})

export const { setFen, clearFen, setUndoRedoFen } = fenSlice.actions
export default fenSlice.reducer
