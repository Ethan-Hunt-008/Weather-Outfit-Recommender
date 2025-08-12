import { APP_CONSTANTS } from '../../constants'
import './SearchHistory.scss'

interface SearchHistoryProps {
  history: string[]
  onCityClick: (city: string) => void
}

const SearchHistory = ({ history, onCityClick }: SearchHistoryProps) => {
  if (history.length === 0) return null

  return (
    <div className="history-section">
      <h3>{APP_CONSTANTS.RECENT_SEARCHES}</h3>
      <div className="history-list">
        {history.map((city, index) => (
          <button
            key={index}
            className="history-item"
            onClick={() => onCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchHistory

