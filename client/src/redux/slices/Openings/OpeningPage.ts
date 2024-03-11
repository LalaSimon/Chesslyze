import { createSlice } from '@reduxjs/toolkit'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'

type openingPageType = {
  openingList: OpeningFenEvalType[]
  openingName: string
}

export const openingPageSlice = createSlice({
  name: 'openingPage',
  initialState: {
    openingList: [],
    openingName: '',
  } as openingPageType,

  reducers: {
    setOpeningPageMoveList: (state, action) => {
      return { ...state, openingList: action.payload }
    },
    setOpeningPageOpeningName: (state, action) => {
      return { ...state, openingName: action.payload }
    },
  },
})

export const { setOpeningPageMoveList, setOpeningPageOpeningName } = openingPageSlice.actions
export default openingPageSlice.reducer
