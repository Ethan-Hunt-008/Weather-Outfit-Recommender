
import { configureStore } from '@reduxjs/toolkit'
import weatherSlice from './slices/weatherSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    weather: weatherSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
