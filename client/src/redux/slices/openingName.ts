import { createSlice } from '@reduxjs/toolkit'

interface OpeningNameState {
  openingName: string
}

export const OpeningNameSlice = createSlice({
  name: 'openingName',
  initialState: {
    openingName: '',
  } as OpeningNameState,

  reducers: {
    setOpeningName: (state, action) => {
      return { ...state, openingName: action.payload }
    },
  },
})

export const { setOpeningName } = OpeningNameSlice.actions
export default OpeningNameSlice.reducer
