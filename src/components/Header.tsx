
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { toggleDarkMode } from '../store/slices/uiSlice'
import { APP_CONSTANTS } from '../constants'

const Header = () => {
  const dispatch = useAppDispatch()
  const { darkMode } = useAppSelector(state => state.ui)

  return (
    <header className="header">
      <h1>{APP_CONSTANTS.TITLE}</h1>
      <button 
        className="theme-toggle"
        onClick={() => dispatch(toggleDarkMode())}
        aria-label={APP_CONSTANTS.THEME_TOGGLE_ARIA}
      >
        {darkMode ? APP_CONSTANTS.SUN_ICON : APP_CONSTANTS.MOON_ICON}
      </button>
    </header>
  )
}

export default Header
