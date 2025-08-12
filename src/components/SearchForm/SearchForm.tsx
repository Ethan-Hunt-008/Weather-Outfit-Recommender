import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setSearchCity,
  setSuggestions,
  setShowSuggestions,
} from "../../store/slices/uiSlice";
import { APP_CONSTANTS } from "../../constants";
import "./SearchForm.scss";

interface SearchFormProps {
  onSearch: (city: string) => void;
}

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const dispatch = useAppDispatch();
  const { searchCity, suggestions, showSuggestions } = useAppSelector(
    (state) => state.ui
  );
  const { loading } = useAppSelector((state) => state.weather);

  const controllerRef = useRef<AbortController | null>(null);

  const fetchCitySuggestions = useCallback(
    async (query: string) => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=0&limit=10&q=${encodeURIComponent(
            query
          )}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(
            `Suggestion request failed with status ${response.status}`
          );
        }

        const data = await response.json();

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

        const cityNames = (Array.isArray(data) ? data : [])
          .filter((item: any) => {
            const itemClass = String(item?.class || '')
            const itemType = String(item?.type || '')
            const isPlace = itemClass === 'place'
            const isAllowedType = allowedTypes.has(itemType)
            const isAdminBoundary = itemClass === 'boundary' && (itemType === 'administrative' || itemType === 'political')
            return isPlace || isAllowedType || isAdminBoundary
          })
          .map((item: any) => String(item?.display_name || '').split(',')[0].trim())
          .filter((name: string) => name.length > 0)
          .filter((name: string, index: number, arr: string[]) => arr.indexOf(name) === index)
          .slice(0, 8);

        dispatch(setSuggestions(cityNames));
        dispatch(setShowSuggestions(cityNames.length > 0));
      } catch (error: any) {
        if (error?.name === "AbortError") return;
        console.error("Error fetching city suggestions", error);
        dispatch(setSuggestions([]));
        dispatch(setShowSuggestions(false));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (searchCity.length > 2) {
      const timeoutId = setTimeout(() => {
        fetchCitySuggestions(searchCity);
      }, 500);
      return () => clearTimeout(timeoutId);
    } else {
      dispatch(setShowSuggestions(false));
      dispatch(setSuggestions([]));
    }
  }, [searchCity, fetchCitySuggestions, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchCity);
  };

  const handleSuggestionClick = (city: string) => {
    dispatch(setSearchCity(city));
    dispatch(setShowSuggestions(false));
    onSearch(city);
  };

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
                  type="button"
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
  );
};

export default SearchForm;

