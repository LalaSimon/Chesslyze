import { createSlice } from '@reduxjs/toolkit'
import { OpeningFenEvalType } from '@shared/types/OpeningFenEvalType'

type openingInfoType = {
  openingList: OpeningFenEvalType[]
  openingName: string
}

export const openingInfoSlice = createSlice({
  name: 'openingInfo',
  initialState: {
    openingList: [],
    openingName: '',
  } as openingInfoType,

  reducers: {
    setOpeningList: (state, action) => {
      return { ...state, openingList: action.payload }
    },
    clearOpeningList: state => {
      return { ...state, openingList: [] }
    },

    setOpeningName: (state, action) => {
      return { ...state, openingName: action.payload }
    },

    clearOpeningName: state => {
      return { ...state, openingName: '' }
    },
  },
})

export const { setOpeningList, setOpeningName, clearOpeningList, clearOpeningName } = openingInfoSlice.actions
export default openingInfoSlice.reducer
