
import { OutfitSuggestion as OutfitSuggestionType } from '../store/slices/weatherSlice'
import { APP_CONSTANTS } from '../constants'

interface OutfitSuggestionProps {
  suggestion: OutfitSuggestionType
}

const OutfitSuggestion = ({ suggestion }: OutfitSuggestionProps) => {
  return (
    <div className="outfit-card">
      <h3>{APP_CONSTANTS.OUTFIT_TITLE}</h3>
      <p className="outfit-message">{suggestion.message}</p>
      <div className="outfit-items">
        {suggestion.items.map((item, index) => (
          <span key={index} className="outfit-item">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default OutfitSuggestion
