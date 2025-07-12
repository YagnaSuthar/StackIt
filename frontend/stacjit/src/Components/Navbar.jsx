import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import '../../CSS/components/Navbar.css';

const Navbar = ({ loggedIn = false }) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo/Title */}
        <div className="navbar-brand">
          <h1>StackIt</h1>
        </div>

        {/* Navigation Items */}
        <div className="navbar-content">
          {/* Ask Question Button - Only visible when logged in */}
          {loggedIn && (
            <button className="btn btn-primary">
              Ask New Question
            </button>
          )}

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button className="btn btn-filter active">
              Newest
            </button>
            <button className="btn btn-filter">
              Unanswered
            </button>
            <div className="dropdown">
              <button 
                className="btn btn-filter dropdown-toggle"
                onClick={() => setShowMoreDropdown(!showMoreDropdown)}
              >
                More <ChevronDown size={16} />
              </button>
              {showMoreDropdown && (
                <div className="dropdown-menu">
                  <button className="dropdown-item">Most Voted</button>
                  <button className="dropdown-item">Recent Activity</button>
                  <button className="dropdown-item">Most Viewed</button>
                </div>
              )}
            </div>
          </div>

          {/* Search Box */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>

          {/* Login/Register Button - Only visible when not logged in */}
          {!loggedIn && (
            <button className="btn btn-login">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
