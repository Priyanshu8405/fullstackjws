import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </main>
        <footer className="app-footer">
          <p>
            React JWT Authentication System • Token Stored in <code>localStorage</code> • Built with React & Vite
          </p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
