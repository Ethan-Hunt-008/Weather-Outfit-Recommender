
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { 
  setSearchCity, 
  setSuggestions, 
  setShowSuggestions 
} from '../store/slices/uiSlice'
import { APP_CONSTANTS, POPULAR_CITIES } from '../constants'

interface SearchFormProps {
  onSearch: (city: string) => void
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const dispatch = useAppDispatch()
  const { searchCity, suggestions, showSuggestions } = useAppSelector(state => state.ui)
  const { loading } = useAppSelector(state => state.weather)

  // Handle city search with debouncing for suggestions
  useEffect(() => {
    if (searchCity.length > 1) {
      const timeoutId = setTimeout(() => {
        const filtered = POPULAR_CITIES.filter(city =>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchCity)
  }

  const handleSuggestionClick = (city: string) => {
    dispatch(setSearchCity(city))
    dispatch(setShowSuggestions(false))
    onSearch(city)
  }

  return (
    <div className="search-section">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => dispatch(setSearchCity(e.target.value))}
            placeholder={APP_CONSTANTS.SEARCH_PLACEHOLDER}
            className="search-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="search-button"
            disabled={loading || !searchCity.trim()}
          >
            {loading ? APP_CONSTANTS.LOADING_ICON : APP_CONSTANTS.SEARCH_ICON}
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
  )
}

export default SearchForm
