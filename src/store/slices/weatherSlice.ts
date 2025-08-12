
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface WeatherData {
  city: string
  temperature: number
  condition: string
  windSpeed: number
  humidity: number
  icon: string
}

export interface OutfitSuggestion {
  message: string
  items: string[]
}

interface WeatherState {
  currentWeather: WeatherData | null
  searchHistory: string[]
  loading: boolean
  error: string
  outfitSuggestion: OutfitSuggestion | null
}

const initialState: WeatherState = {
  currentWeather: null,
  searchHistory: [],
  loading: false,
  error: '',
  outfitSuggestion: null,
}

// Mock weather API function
const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const cityHash = city.toLowerCase().split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
  const icons = ['☀️', '☁️', '🌧️', '❄️', '💨']
  
  const conditionIndex = cityHash % conditions.length
  const temperature = Math.floor((cityHash % 35) + 5)
  const windSpeed = Math.floor((cityHash % 20) + 5)
  const humidity = Math.floor((cityHash % 40) + 40)

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

export const searchWeather = createAsyncThunk(
  'weather/searchWeather',
  async (city: string) => {
    const weatherData = await fetchWeatherData(city)
    const outfitSuggestion = getOutfitSuggestion(weatherData)
    return { weatherData, outfitSuggestion }
  }
)

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = ''
    },
    addToHistory: (state, action: PayloadAction<string>) => {
      const city = action.payload
      const newHistory = [city, ...state.searchHistory.filter(item => item !== city)]
      state.searchHistory = newHistory.slice(0, 5)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchWeather.pending, (state) => {
        state.loading = true
        state.error = ''
      })
      .addCase(searchWeather.fulfilled, (state, action) => {
        state.loading = false
        state.currentWeather = action.payload.weatherData
        state.outfitSuggestion = action.payload.outfitSuggestion
        const city = action.payload.weatherData.city
        const newHistory = [city, ...state.searchHistory.filter(item => item !== city)]
        state.searchHistory = newHistory.slice(0, 5)
      })
      .addCase(searchWeather.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch weather data'
      })
  },
})

export const { clearError, addToHistory } = weatherSlice.actions
export default weatherSlice.reducer
