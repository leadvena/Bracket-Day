import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import CreateTournament from '@/pages/CreateTournament'
import ManageBracket from '@/pages/ManageBracket'
import PublicBracket from '@/pages/PublicBracket'
import TitleUpdater from '@/components/TitleUpdater'

function App() {
  return (
    <AuthProvider>
      <Router>
        <TitleUpdater />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/bracket/:tournamentId" element={<PublicBracket />} />

          {/* Admin Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateTournament />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manage/:tournamentId"
            element={
              <ProtectedRoute>
                <ManageBracket />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
