
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  darkMode: boolean
  searchCity: string
  suggestions: string[]
  showSuggestions: boolean
}

const initialState: UiState = {
  darkMode: false,
  searchCity: '',
  suggestions: [],
  showSuggestions: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setSearchCity: (state, action: PayloadAction<string>) => {
      state.searchCity = action.payload
    },
    setSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload
    },
    clearSearchCity: (state) => {
      state.searchCity = ''
    },
  },
})

export const { 
  toggleDarkMode, 
  setSearchCity, 
  setSuggestions, 
  setShowSuggestions, 
  clearSearchCity 
} = uiSlice.actions

export default uiSlice.reducer
