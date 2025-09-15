import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Generator from './pages/Generator';
import Scanner from './pages/Scanner';
import ValidatePage from './pages/ValidatePage';
import Wallet from './pages/Wallet';   
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <div className="app-container">
          <h2 className="app-title">Shopping QR System</h2>
          <nav className="app-nav">
            <Link to="/" className="nav-link">Generate QR</Link>
            <Link to="/scanner" className="nav-link">Scan</Link>
            <Link to="/wallet" className="nav-link">Wallet</Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/scanner" element={<Scanner />} />
          <Route path="/validate/:token" element={<ValidatePage />} />
          <Route path="/wallet" element={<Wallet />} /> 
        </Routes>
      </main>
    </BrowserRouter>
  );
}
