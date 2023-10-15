import { createSlice } from '@reduxjs/toolkit'

interface OrientationState {
  orientation: 'white' | 'black'
}

export const orientationSlice = createSlice({
  name: 'orientation',

  initialState: {
    orientation: 'white',
  } as OrientationState,

  reducers: {
    setOrientation: (state, action) => {
      return { ...state, orientation: action.payload }
    },
  },
})

export const { setOrientation } = orientationSlice.actions
export default orientationSlice.reducer
