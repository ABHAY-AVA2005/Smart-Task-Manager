import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="navbar">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <LayoutDashboard className="text-primary-color" />
        <h2 style={{ margin: 0 }}>TaskFlow</h2>
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="btn btn-outline" onClick={toggleTheme} style={{ padding: '0.5rem', borderRadius: '50%' }}>
          <Moon className="theme-icon-dark" size={18} />
        </button>
        
        {user ? (
          <>
            <span style={{ fontWeight: 500 }}>{user.name}</span>
            <button className="btn btn-danger" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
