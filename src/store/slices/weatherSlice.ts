
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { APP_CONSTANTS } from '../../constants'

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

// Mock weather API function with city validation using Nominatim
const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  await new Promise(resolve => setTimeout(resolve, 300))

  const rawQuery = city.trim()
  if (!rawQuery) {
    throw new Error(APP_CONSTANTS.ERROR_EMPTY_CITY)
  }

  // Validate the city exists using Nominatim (free API)
  // Use a higher limit and broaden acceptable classes/types to handle cases like countries/states (e.g., "Jamaica", "Delhi")
  const validateUrl = `https://nominatim.openstreetmap.org/search?format=json&limit=10&q=${encodeURIComponent(rawQuery)}`
  const validateResponse = await fetch(validateUrl)
  if (!validateResponse.ok) {
    throw new Error(APP_CONSTANTS.ERROR_VALIDATE_CITY_FAILED)
  }
  const validateData = await validateResponse.json()
  const candidates: any[] = Array.isArray(validateData) ? validateData : []
  const allowedTypes = new Set([
    'city',
    'town',
    'village',
    'hamlet',
    'municipality',
    'county',
    'state',
    'region',
    'province',
    'island',
    'country',
    'suburb',
    'locality',
    'administrative'
  ])

  // Prefer proper places, but also allow administrative boundaries
  const match = candidates.find((item: any) => {
    const itemClass = String(item?.class || '')
    const itemType = String(item?.type || '')
    const isPlace = itemClass === 'place'
    const isAllowedType = allowedTypes.has(itemType)
    const isAdminBoundary = itemClass === 'boundary' && (itemType === 'administrative' || itemType === 'political')
    return isPlace || isAllowedType || isAdminBoundary
  })

  if (!match) {
    throw new Error(APP_CONSTANTS.ERROR_CITY_NOT_FOUND(city))
  }

  const canonicalName = String(match?.display_name || rawQuery).split(',')[0].trim()
  const cityLower = canonicalName.toLowerCase()

  const cityHash = cityLower.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const conditions = ['sunny', 'cloudy', 'rainy', 'snowy', 'windy']
  const icons = ['☀️', '☁️', '🌧️', '❄️', '💨']
  
  const conditionIndex = cityHash % conditions.length
  const temperature = Math.floor((cityHash % 35) + 5)
  const windSpeed = Math.floor((cityHash % 20) + 5)
  const humidity = Math.floor((cityHash % 40) + 40)

  return {
    city: canonicalName.charAt(0).toUpperCase() + canonicalName.slice(1),
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
    message = APP_CONSTANTS.MSG_VERY_COLD
    items = ['Heavy coat', 'Warm hat', 'Gloves', 'Scarf', 'Warm boots']
  } else if (temperature < 15) {
    message = APP_CONSTANTS.MSG_CHILLY
    items = ['Jacket', 'Long pants', 'Closed shoes']
  } else if (temperature < 25) {
    message = APP_CONSTANTS.MSG_PLEASANT
    items = ['Light sweater', 'Jeans', 'Sneakers']
  } else {
    message = APP_CONSTANTS.MSG_WARM
    items = ['T-shirt', 'Shorts', 'Sandals']
  }

  if (condition === 'rainy') {
    message += APP_CONSTANTS.MSG_RAIN_ADDON
    items.push('Umbrella', 'Rain jacket')
  } else if (condition === 'sunny') {
    message += APP_CONSTANTS.MSG_SUN_ADDON
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
        state.currentWeather = null
        state.outfitSuggestion = null
      })
  },
})

export const { clearError, addToHistory } = weatherSlice.actions
export default weatherSlice.reducer
