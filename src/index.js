import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Result from './Result';
import Report from './Report';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/about' element={<h1> ABOUT </h1>} />
        <Route path='/contact' element={<h1> CONTACT </h1>} />
        <Route path='/result' element={<Result />} />
        <Route path='/report' element={<Report />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
