import { WeatherData } from '../../store/slices/weatherSlice'
import { APP_CONSTANTS } from '../../constants'
import './WeatherCard.scss'

interface WeatherCardProps {
  weather: WeatherData
}

const WeatherCard = ({ weather }: WeatherCardProps) => {
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.city}</h2>
        <span className="weather-icon">{weather.icon}</span>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          {weather.temperature}{APP_CONSTANTS.TEMPERATURE_UNIT}
        </div>
        <div className="condition">
          {weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)}
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">{APP_CONSTANTS.WIND_LABEL}</span>
          <span className="detail-value">{weather.windSpeed} {APP_CONSTANTS.WIND_UNIT}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">{APP_CONSTANTS.HUMIDITY_LABEL}</span>
          <span className="detail-value">{weather.humidity}{APP_CONSTANTS.HUMIDITY_UNIT}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard

