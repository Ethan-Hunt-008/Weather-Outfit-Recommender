export const APP_CONSTANTS = {
  TITLE: "🌤️ Weather Dashboard",
  SEARCH_PLACEHOLDER: "Enter city name...",
  OUTFIT_TITLE: "👔 Outfit Suggestion",
  RECENT_SEARCHES: "🕐 Recent Searches",
  THEME_TOGGLE_ARIA: "Toggle theme",
  ERROR_PREFIX: "⚠️",
  SEARCH_ICON: "🔍",
  LOADING_ICON: "🔄",
  SUN_ICON: "☀️",
  MOON_ICON: "🌙",
  WIND_LABEL: "💨 Wind Speed",
  HUMIDITY_LABEL: "💧 Humidity",
  WIND_UNIT: "km/h",
  HUMIDITY_UNIT: "%",
  TEMPERATURE_UNIT: "°C",
  // Validation & error messages
  ERROR_EMPTY_CITY: "Please enter a city name.",
  ERROR_VALIDATE_CITY_FAILED: "Failed to validate city name. Please try again.",
  ERROR_CITY_NOT_FOUND: (city: string) => `City "${city}" not found. Please check the spelling and try again.`,
  // Outfit messages
  MSG_VERY_COLD: "It's very cold! Bundle up warm.",
  MSG_CHILLY: "It's chilly. Layer up!",
  MSG_PLEASANT: "Pleasant weather. Dress comfortably.",
  MSG_WARM: "It's warm! Light clothing recommended.",
  MSG_RAIN_ADDON: " Don't forget rain protection!",
  MSG_SUN_ADDON: " Perfect for outdoor activities!",
};

// Removed POPULAR_CITIES - now using real API for city suggestions
