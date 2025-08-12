import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { searchWeather } from '../../store/slices/weatherSlice'
import { clearSearchCity } from '../../store/slices/uiSlice'
import Header from '../Header/Header'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import WeatherCard from '../WeatherCard/WeatherCard'
import OutfitSuggestion from '../OutfitSuggestion/OutfitSuggestion'
import SearchHistory from '../SearchHistory/SearchHistory'
import './WeatherDashboard.scss'

const WeatherDashboard = () => {
  const dispatch = useAppDispatch()

  const { currentWeather, searchHistory, error, outfitSuggestion } = useAppSelector(state => state.weather)
  const { darkMode } = useAppSelector(state => state.ui)

  const handleSearch = async (city: string) => {
    if (!city.trim()) return

    dispatch(searchWeather(city))
    dispatch(clearSearchCity())
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <Header onSearch={handleSearch} />

      <main className="main-content">
        <ErrorMessage error={error} />

        <div className="dashboard-layout">
          <div className="top-section">
            {currentWeather && (
              <WeatherCard weather={currentWeather} />
            )}
            
            {outfitSuggestion && (
              <OutfitSuggestion suggestion={outfitSuggestion} />
            )}
          </div>

          <SearchHistory
            history={searchHistory}
            onCityClick={handleSearch}
          />
        </div>
      </main>
    </div>
  )
}

export default WeatherDashboard

