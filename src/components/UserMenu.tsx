import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-rose-100 to-amber-100 text-gray-800 hover:from-rose-200 hover:to-amber-200 transition-all"
      >
        <User size={18} />
        <span className="text-sm font-medium">{user.first_name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 min-w-[200px] bg-white/70 backdrop-blur-xl border border-black/10 rounded-xl shadow-2xl z-50">
          <div className="p-2">
            <Link
              to="/dashboard"
              data-allow-nav
              onClick={(e) => {
                console.log('Dashboard link clicked!');
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors"
            >
              <User size={18} />
              <span>داشبورد من</span>
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100/50 rounded-lg transition-colors w-full text-right"
            >
              <LogOut size={18} />
              <span>خروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;