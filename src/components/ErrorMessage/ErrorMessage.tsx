import { APP_CONSTANTS } from '../../constants'
import './ErrorMessage.scss'

interface ErrorMessageProps {
  error: string
}

const ErrorMessage = ({ error }: ErrorMessageProps) => {
  if (!error) return null

  return (
    <div className="error-message">
      {APP_CONSTANTS.ERROR_PREFIX} {error}
    </div>
  )
}

export default ErrorMessage

