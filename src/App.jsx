import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginGate from './components/LoginGate';
import Dashboard from './components/Dashboard';

export default function App() {
  const [page, setPage] = useState('landing');
  const [token, setToken] = useState(null);

  // Check localStorage on mount for pre-existing session token
  useEffect(() => {
    const savedToken = localStorage.getItem('packco-token');
    if (savedToken) {
      setToken(savedToken);
      setPage('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userToken) => {
    localStorage.setItem('packco-token', userToken);
    setToken(userToken);
    setPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('packco-token');
    setToken(null);
    setPage('landing');
  };

  switch (page) {
    case 'landing':
      return <LandingPage onEnterDemo={() => setPage(token ? 'dashboard' : 'login')} />;
    case 'login':
      return (
        <LoginGate 
          onLoginSuccess={handleLoginSuccess} 
          onBack={() => setPage('landing')} 
        />
      );
    case 'dashboard':
      return <Dashboard onLogout={handleLogout} />;
    default:
      return <LandingPage onEnterDemo={() => setPage('login')} />;
  }
}
