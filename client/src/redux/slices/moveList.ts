import { createSlice } from '@reduxjs/toolkit'
import { MoveObject } from '../../shared/types/MoveObject'

interface MoveListState {
  moveList: [MoveObject][]
}

const moveListSlice = createSlice({
  name: 'moveList',

  initialState: {
    moveList: [],
  } as MoveListState,

  reducers: {
    setMoveList: (state, action) => {
      return { ...state, moveList: action.payload }
    },
  },
})

export const { setMoveList } = moveListSlice.actions
export default moveListSlice.reducer
