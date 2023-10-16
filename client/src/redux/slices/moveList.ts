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
    clearMoveList: state => {
      return { ...state, moveList: [] }
    },
  },
})

export const { setMoveList, clearMoveList } = moveListSlice.actions
export default moveListSlice.reducer
