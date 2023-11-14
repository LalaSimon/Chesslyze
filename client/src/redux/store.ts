import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import fenReducer from './slices/fen'
import orientationReducer from './slices/orientation'
import moveListReducer from './slices/moveList'
import openingReducer from './slices/opening'
import movesEvalReducer from './slices/movesEval'

const store = configureStore({
  reducer: {
    fen: fenReducer,
    orientation: orientationReducer,
    moveList: moveListReducer,
    opening: openingReducer,
    movesEval: movesEvalReducer,
  },
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export const useTypedDispatch = () => useDispatch<AppDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
