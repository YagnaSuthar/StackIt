// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';
import HomePage from './Pages/HomePage.jsx';
import Login from './Pages/Login.jsx'; // 👈 import the Login page
import Register from './Pages/Register.jsx';
import './CSS/global.css'


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
