// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Components/Navbar.jsx';
import HomePage from './Pages/HomePage.jsx';
import Login from './Pages/Login.jsx'; // 👈 import the Login page
import Register from './Pages/Register.jsx';
import AskQuestion from './Pages/AskQuestions.jsx';
import './CSS/global.css'


function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register/>}></Route>
        <Route path="/AskQuestion" element={<AskQuestion/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
