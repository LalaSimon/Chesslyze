import { createSlice } from '@reduxjs/toolkit'

type OrientationState = {
  myOrientation: 'white' | 'black'
  opponentOrientation: 'white' | 'black'
}

export const orientationSlice = createSlice({
  name: 'orientation',

  initialState: {
    myOrientation: 'white',
    opponentOrientation: 'white',
  } as OrientationState,

  reducers: {
    setMyOrientation: (state, action) => {
      return { ...state, myOrientation: action.payload }
    },
    setOpponentOrientation: (state, action) => {
      return { ...state, opponentOrientation: action.payload }
    },
  },
})

export const { setMyOrientation } = orientationSlice.actions
export const { setOpponentOrientation } = orientationSlice.actions
export default orientationSlice.reducer
