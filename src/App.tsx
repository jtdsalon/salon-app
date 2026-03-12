import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes';
import ErrorBoundary from './components/ErrorBoundary';
import { BASE_PATH } from './routes/routeConfig';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Router basename={BASE_PATH}>
        <AppRoutes />
      </Router>
    </ErrorBoundary>
  )
}

export default App
