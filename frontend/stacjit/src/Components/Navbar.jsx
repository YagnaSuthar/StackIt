// src/Components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>StackIt</h2>
      <ul style={styles.navLinks}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    margin: 0,
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '1rem',
  }
};

export default Navbar;
