import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-medical-600 text-white'
        : 'text-medical-300 hover:text-white hover:bg-navy-800'
    }`;

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const links = (
    <>
      <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
      <NavLink to="/analyze" className={linkClass} onClick={() => setOpen(false)}>Analyze</NavLink>
      {isAuthenticated && <NavLink to="/dashboard" className={linkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>}
      {isAuthenticated && <NavLink to="/history" className={linkClass} onClick={() => setOpen(false)}>History</NavLink>}
    </>
  );

  return (
    <header className="bg-navy-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-medical-500 to-medical-600 flex items-center justify-center text-white font-bold text-sm">
              DV
            </div>
            <span className="text-white font-semibold text-lg">
              Dermacare<span className="text-medical-400">Vision</span> AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {links}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-navy-700">
                <span className="text-medical-300 text-sm hidden lg:inline">{user}</span>
                <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-medical-300 hover:text-white hover:bg-navy-800 transition-colors cursor-pointer">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-medical-600 text-white hover:bg-medical-500 transition-colors ml-2 no-underline">
                <LogIn size={16} /> Sign In
              </NavLink>
            )}
          </nav>

          <button className="md:hidden text-white p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            {links}
            {isAuthenticated ? (
              <button onClick={handleLogout} className={`${linkClass({ isActive: false })} flex items-center gap-2 text-left`}>
                <LogOut size={16} /> Logout ({user})
              </button>
            ) : (
              <NavLink to="/login" className={linkClass} onClick={() => setOpen(false)}>Sign In</NavLink>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
