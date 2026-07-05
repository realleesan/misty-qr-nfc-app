import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import QRCodes from './pages/QRCodes'
import Analytics from './pages/Analytics'
import Reviews from './pages/Reviews'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && user?.role && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

function OwnerRoute({ children }) {
  return (
    <ProtectedRoute roles={['owner']}>
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="qr-codes" element={<QRCodes />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reviews" element={<OwnerRoute><Reviews /></OwnerRoute>} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
