import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  Home, Compass, Clock, BookOpen, Calendar, User, Moon, Sun,
  LogOut, Menu, X, BookMarked, Heart
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/qibla', label: 'Qibla', icon: Compass },
  { path: '/prayer-times', label: 'Prayer', icon: Clock },
  { path: '/azkar', label: 'Azkar', icon: Heart },
  { path: '/quran', label: 'Quran', icon: BookOpen },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { path: '/profile', label: 'Profile', icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex ${state.darkMode ? 'bg-gray-950 text-gray-100' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50 text-gray-900'}`}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white/90 backdrop-blur-xl border-emerald-100'} border-r flex flex-col`}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-white text-lg font-bold">☪</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">Noor</h1>
            <p className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Islamic Companion</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto p-1">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? state.darkMode
                      ? 'bg-emerald-900/50 text-emerald-400 shadow-lg shadow-emerald-900/20'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : state.darkMode
                      ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                      : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={`p-4 border-t ${state.darkMode ? 'border-gray-800' : 'border-emerald-100'}`}>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${state.darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-emerald-50'}`}
          >
            {state.darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {state.darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className={`sticky top-0 z-30 px-4 lg:px-8 py-4 flex items-center justify-between ${state.darkMode ? 'bg-gray-950/80' : 'bg-white/60'} backdrop-blur-xl border-b ${state.darkMode ? 'border-gray-800' : 'border-emerald-100'}`}>
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-emerald-100 transition">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </span>
          </div>
          <div className="flex items-center gap-3">
            {state.user && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                  {state.user.name.charAt(0).toUpperCase()}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {state.user.name}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8 animate-fadeIn">
          {children}
        </div>
      </main>
    </div>
  );
}
