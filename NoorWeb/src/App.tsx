import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';
import Layout from '@/components/Layout';
import AuthPage from '@/pages/AuthPage';
import Dashboard from '@/pages/Dashboard';
import QiblaPage from '@/pages/QiblaPage';
import PrayerTimesPage from '@/pages/PrayerTimesPage';
import AzkarPage from '@/pages/AzkarPage';
import QuranPage from '@/pages/QuranPage';
import SchedulePage from '@/pages/SchedulePage';
import BookmarksPage from '@/pages/BookmarksPage';
import ProfilePage from '@/pages/ProfilePage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp();
  if (!state.isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Layout>{children}</Layout>;
}

function AuthRoute() {
  const { state } = useApp();
  if (state.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AuthPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/qibla" element={<ProtectedRoute><QiblaPage /></ProtectedRoute>} />
      <Route path="/prayer-times" element={<ProtectedRoute><PrayerTimesPage /></ProtectedRoute>} />
      <Route path="/azkar" element={<ProtectedRoute><AzkarPage /></ProtectedRoute>} />
      <Route path="/quran" element={<ProtectedRoute><QuranPage /></ProtectedRoute>} />
      <Route path="/schedule" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute><BookmarksPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </HashRouter>
  );
}
