import { createSlice } from '@reduxjs/toolkit'
import type { OpeningFenEvalType } from '../../shared/types/OpeningFenEvalType'

type openingInfoType = {
  openingList: OpeningFenEvalType[]
  openingName: string
}

export const openignInfoSlice = createSlice({
  name: 'openignInfo',
  initialState: {
    openingList: [],
    openingName: '',
  } as openingInfoType,

  reducers: {
    setOpeningList: (state, action) => {
      return { ...state, openingList: action.payload }
    },
    setOpeningName: (state, action) => {
      return { ...state, openingName: action.payload }
    },
  },
})

export const { setOpeningList, setOpeningName } = openignInfoSlice.actions
export default openignInfoSlice.reducer
