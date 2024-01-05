import { createSlice } from '@reduxjs/toolkit'
import type { openingFenEvalType } from '../../shared/types/openingFenEval'

type openingListType = {
  openingList: openingFenEvalType[]
}

export const openingListSlice = createSlice({
  name: 'movesEval',
  initialState: {
    openingList: [],
  } as openingListType,

  reducers: {
    setOpeningList: (state, action) => {
      return { ...state, openingList: action.payload }
    },
    clearMoves: state => {
      return { ...state, openingList: [] }
    },
  },
})

export const { setOpeningList, clearMoves } = openingListSlice.actions
export default openingListSlice.reducer
