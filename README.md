## Weather-Based Outfit Recommender

A React + TypeScript app bootstrapped with Vite that suggests outfits based on mock weather data. It supports debounced city suggestions via the free Nominatim API and validates searches to show an error for unknown cities.

### Prerequisites
- Node.js 18+ (recommended LTS)
- npm 9+ or yarn/pnpm

### Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run the app locally
```bash
npm run dev
# Vite will print a local URL, e.g. http://localhost:5173
```

### Build for production
```bash
npm run build
npm run preview
```

### How it works
- City suggestions are fetched from the free OpenStreetMap Nominatim API with a 500ms debounce in `SearchForm`.
- On search, we validate the city exists using Nominatim before generating mock weather, ensuring invalid inputs show an error.
- Successful searches update recent history; failed ones do not.

### Assumptions and decisions
- Mock weather: This project uses deterministic, mock weather generation instead of a paid weather API to keep it free and self-contained.
- Free suggestions: City suggestions and validation use Nominatim (no API key). If rate-limited or offline, suggestions may be temporarily unavailable.
- Error policy: If Nominatim returns no match for a city, we show an error instead of fabricating data.
- Styling: Component-scoped SCSS files under `src/components/*/` keep styles modular; global theming remains in `src/App.scss`.
- Accessibility: Buttons and inputs include basic ARIA/labels; improvements are welcome.

### Scripts
- `dev`: start Vite dev server
- `build`: build production assets
- `preview`: preview built assets

### Tech stack
- React 18, TypeScript
- Redux Toolkit for state
- Vite for dev/build
- SCSS modules per component

### Notes
- Nominatim usage policy: please avoid excessive requests; we debounce and limit results to be polite.
