// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProgressPage from './pages/ProgressPage';
import UserManagementPage from './pages/UserManagementPage'; // <-- Importa la nueva página
import Navbar from './components/Navbar';
import ChildManagementPage from './pages/ChildManagementPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 min-h-screen">
        <Navbar />
        
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/progreso" element={<ProgressPage />} />
            <Route path="/gestion-usuarios" element={<UserManagementPage />} />
            <Route path="/gestion-perfiles" element={<ChildManagementPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;