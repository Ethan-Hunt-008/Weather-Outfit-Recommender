
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { searchWeather } from '../store/slices/weatherSlice'
import { 
  toggleDarkMode, 
  setSearchCity, 
  setSuggestions, 
  setShowSuggestions, 
  clearSearchCity 
} from '../store/slices/uiSlice'

const WeatherDashboard = () => {
  const dispatch = useAppDispatch()
  
  const { currentWeather, searchHistory, loading, error, outfitSuggestion } = useAppSelector(state => state.weather)
  const { darkMode, searchCity, suggestions, showSuggestions } = useAppSelector(state => state.ui)

  // Popular cities for auto-suggestions
  const popularCities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Los Angeles', 'Chicago',
    'Miami', 'Berlin', 'Amsterdam', 'Barcelona', 'Rome', 'Moscow', 'Dubai',
    'Singapore', 'Hong Kong', 'Toronto', 'Vancouver', 'Montreal', 'Madrid'
  ]

  // Handle city search with debouncing for suggestions
  useEffect(() => {
    if (searchCity.length > 1) {
      const timeoutId = setTimeout(() => {
        const filtered = popularCities.filter(city =>
          city.toLowerCase().includes(searchCity.toLowerCase())
        ).slice(0, 5)
        dispatch(setSuggestions(filtered))
        dispatch(setShowSuggestions(true))
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      dispatch(setShowSuggestions(false))
    }
  }, [searchCity, dispatch])

  const handleSearch = async (city: string) => {
    if (!city.trim()) return

    dispatch(setShowSuggestions(false))
    dispatch(searchWeather(city))
    dispatch(clearSearchCity())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchCity)
  }

  const handleSuggestionClick = (city: string) => {
    dispatch(setSearchCity(city))
    dispatch(setShowSuggestions(false))
    handleSearch(city)
  }

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1>🌤️ Weather Dashboard</h1>
        <button 
          className="theme-toggle"
          onClick={() => dispatch(toggleDarkMode())}
          aria-label="Toggle theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="main-content">
        <div className="search-section">
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-container">
              <input
                type="text"
                value={searchCity}
                onChange={(e) => dispatch(setSearchCity(e.target.value))}
                placeholder="Enter city name..."
                className="search-input"
                disabled={loading}
              />
              <button 
                type="submit" 
                className="search-button"
                disabled={loading || !searchCity.trim()}
              >
                {loading ? '🔄' : '🔍'}
              </button>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((city, index) => (
                    <button
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(city)}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {currentWeather && (
          <div className="weather-container">
            <div className="weather-card">
              <div className="weather-header">
                <h2>{currentWeather.city}</h2>
                <span className="weather-icon">{currentWeather.icon}</span>
              </div>
              
              <div className="weather-main">
                <div className="temperature">
                  {currentWeather.temperature}°C
                </div>
                <div className="condition">
                  {currentWeather.condition.charAt(0).toUpperCase() + currentWeather.condition.slice(1)}
                </div>
              </div>
              
              <div className="weather-details">
                <div className="detail-item">
                  <span className="detail-label">💨 Wind Speed</span>
                  <span className="detail-value">{currentWeather.windSpeed} km/h</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">💧 Humidity</span>
                  <span className="detail-value">{currentWeather.humidity}%</span>
                </div>
              </div>
            </div>

            {outfitSuggestion && (
              <div className="outfit-card">
                <h3>👔 Outfit Suggestion</h3>
                <p className="outfit-message">{outfitSuggestion.message}</p>
                <div className="outfit-items">
                  {outfitSuggestion.items.map((item, index) => (
                    <span key={index} className="outfit-item">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {searchHistory.length > 0 && (
          <div className="history-section">
            <h3>🕐 Recent Searches</h3>
            <div className="history-list">
              {searchHistory.map((city, index) => (
                <button
                  key={index}
                  className="history-item"
                  onClick={() => handleSearch(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default WeatherDashboard
