
import { useState, useEffect } from 'react'
import './App.css'

interface WeatherData {
  city: string
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  icon: string
}

interface OutfitSuggestion {
  message: string
  items: string[]
}

export default function App() {
  const [searchCity, setSearchCity] = useState('')
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Popular cities for auto-suggestions
  const popularCities = [
    'New York', 'London', 'Paris', 'Tokyo', 'Sydney', 'Los Angeles', 'Chicago',
    'Miami', 'Berlin', 'Amsterdam', 'Barcelona', 'Rome', 'Moscow', 'Dubai',
    'Singapore', 'Hong Kong', 'Toronto', 'Vancouver', 'Montreal', 'Madrid'
  ]

  // Mock weather API function
  const fetchWeatherData = async (city: string): Promise<WeatherData> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data based on city name hash for consistency
    const cityHash = city.toLowerCase().split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
    const icons = ['☀️', '☁️', '🌧️', '❄️', '💨']
    
    const conditionIndex = cityHash % conditions.length
    const temperature = Math.floor((cityHash % 35) + 5) // 5-40°C
    const windSpeed = Math.floor((cityHash % 20) + 5) // 5-25 km/h
    const humidity = Math.floor((cityHash % 40) + 40) // 40-80%

    // Simulate city not found error
    if (city.toLowerCase() === 'notfound') {
      throw new Error('City not found')
    }

    return {
      city: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
      temperature,
      condition: conditions[conditionIndex],
      windSpeed,
      humidity,
      icon: icons[conditionIndex]
    }
  }

  // Get outfit suggestions based on weather
  const getOutfitSuggestion = (weather: WeatherData): OutfitSuggestion => {
    const { temperature, condition } = weather
    
    let message = ''
    let items: string[] = []

    if (temperature < 5) {
      message = "It's very cold! Bundle up warm."
      items = ['Heavy coat', 'Warm hat', 'Gloves', 'Scarf', 'Warm boots']
    } else if (temperature < 15) {
      message = "It's chilly. Layer up!"
      items = ['Jacket', 'Long pants', 'Closed shoes']
    } else if (temperature < 25) {
      message = "Pleasant weather. Dress comfortably."
      items = ['Light sweater', 'Jeans', 'Sneakers']
    } else {
      message = "It's warm! Light clothing recommended."
      items = ['T-shirt', 'Shorts', 'Sandals']
    }

    if (condition === 'rainy') {
      message += " Don't forget rain protection!"
      items.push('Umbrella', 'Rain jacket')
    } else if (condition === 'sunny') {
      message += " Perfect for outdoor activities!"
      items.push('Sunglasses', 'Sunscreen', 'Hat')
    } else if (condition === 'windy') {
      items.push('Windbreaker')
    } else if (condition === 'snowy') {
      items.push('Waterproof boots', 'Extra layers')
    }

    return { message, items }
  }

  // Handle city search with debouncing for suggestions
  useEffect(() => {
    if (searchCity.length > 1) {
      const timeoutId = setTimeout(() => {
        const filtered = popularCities.filter(city =>
          city.toLowerCase().includes(searchCity.toLowerCase())
        ).slice(0, 5)
        setSuggestions(filtered)
        setShowSuggestions(true)
      }, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setShowSuggestions(false)
    }
  }, [searchCity])

  const handleSearch = async (city: string) => {
    if (!city.trim()) return

    setLoading(true)
    setError('')
    setShowSuggestions(false)

    try {
      const weatherData = await fetchWeatherData(city)
      setCurrentWeather(weatherData)
      
      // Update search history
      setSearchHistory(prev => {
        const newHistory = [weatherData.city, ...prev.filter(item => item !== weatherData.city)]
        return newHistory.slice(0, 5)
      })
      
      setSearchCity('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchCity)
  }

  const handleSuggestionClick = (city: string) => {
    setSearchCity(city)
    setShowSuggestions(false)
    handleSearch(city)
  }

  const outfitSuggestion = currentWeather ? getOutfitSuggestion(currentWeather) : null

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header className="header">
        <h1>🌤️ Weather Dashboard</h1>
        <button 
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
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
                onChange={(e) => setSearchCity(e.target.value)}
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
