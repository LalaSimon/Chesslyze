import { createSlice } from '@reduxjs/toolkit'
import { Arrow } from 'react-chessboard/dist/chessboard/types'

type AnalizeSliceType = {
  squares: string[]
  arrows: Arrow[]
}

export const AnalizeSlice = createSlice({
  name: 'AnalizeSlice',
  initialState: {
    squares: [],
    arrows: [],
  } as AnalizeSliceType,

  reducers: {
    setArrows: (state, action) => {
      return { ...state, arrows: action.payload }
    },
    setSquares: (state, action) => {
      return { ...state, squares: action.payload }
    },
    clearArrows: state => {
      return { ...state, arrows: [] }
    },
    clearSquares: state => {
      return { ...state, squares: [] }
    },
    clearAnalyze: state => {
      return { ...state, squares: [], arrows: [] }
    },
  },
})

export const { setArrows, setSquares, clearArrows, clearAnalyze, clearSquares } = AnalizeSlice.actions
export default AnalizeSlice.reducer
