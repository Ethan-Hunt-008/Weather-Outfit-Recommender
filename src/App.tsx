
import { useState, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store'
import WeatherDashboard from './components/WeatherDashboard/WeatherDashboard'
import './App.scss'

function App() {
  return (
    <Provider store={store}>
      <WeatherDashboard />
    </Provider>
  )
}

export default App
