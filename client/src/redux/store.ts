import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import fenReducer from './slices/Analysis/fen'
import orientationReducer from './slices/Analysis/orientation'
import moveListReducer from './slices/Analysis/moveList'
import openingInfoReducer from './slices/Analysis/openingInfo'
import analizeReducer from './slices/Analysis/analize'
import openingPageReducer from './slices/Openings/OpeningPage'

const store = configureStore({
  reducer: {
    fen: fenReducer,
    orientation: orientationReducer,
    moveList: moveListReducer,
    openingInfo: openingInfoReducer,
    analize: analizeReducer,
    openingPage: openingPageReducer,
  },
})

export default store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppStore = typeof store
export const useTypedDispatch = () => useDispatch<AppDispatch>()
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
