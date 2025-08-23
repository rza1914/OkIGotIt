import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import RequireAuth from './routes/RequireAuth';
import { AuthProvider } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
          <AuthModal />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
