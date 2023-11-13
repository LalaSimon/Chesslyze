import { createSlice } from '@reduxjs/toolkit'

interface OpeningState {
  opening: string
}

export const OpeningSlice = createSlice({
  name: 'opening',
  initialState: {
    opening: '',
  } as OpeningState,

  reducers: {
    setOpening: (state, action) => {
      return { ...state, opening: action.payload }
    },
  },
})

export const { setOpening } = OpeningSlice.actions
export default OpeningSlice.reducer
