import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { searchWeather } from '../store/slices/weatherSlice'
import { clearSearchCity } from '../store/slices/uiSlice'
import Header from './Header'
import SearchForm from './SearchForm'
import ErrorMessage from './ErrorMessage'
import WeatherCard from './WeatherCard'
import OutfitSuggestion from './OutfitSuggestion'
import SearchHistory from './SearchHistory'

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
      <Header />

      <main className="main-content">
        <SearchForm onSearch={handleSearch} />

        <ErrorMessage error={error} />

        {currentWeather && (
          <div className="weather-container">
            <WeatherCard weather={currentWeather} />
            {outfitSuggestion && (
              <OutfitSuggestion suggestion={outfitSuggestion} />
            )}
          </div>
        )}

        <SearchHistory
          history={searchHistory}
          onCityClick={handleSearch}
        />
      </main>
    </div>
  )
}

export default WeatherDashboard