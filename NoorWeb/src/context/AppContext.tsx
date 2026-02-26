import React, { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface ScheduleTask {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  date: string;
  category: 'prayer' | 'work' | 'personal' | 'islamic' | 'other';
}

export interface Bookmark {
  id: string;
  type: 'quran' | 'zikr' | 'schedule';
  title: string;
  reference: string;
  timestamp: string;
}

export interface PrayerLog {
  date: string;
  prayers: { [key: string]: boolean };
}

export interface CustomZikr {
  id: string;
  arabic: string;
  translation: string;
  target: number;
}

interface UserData {
  tasks: ScheduleTask[];
  bookmarks: Bookmark[];
  prayerLogs: PrayerLog[];
  tasbeehCounts: { [key: string]: number };
  azkarProgress: { [key: number]: number };
  customZikr: CustomZikr[];
  lastReadSurah: number;
  lastReadAyah: number;
  location: { lat: number; lng: number; city: string; country: string } | null;
  notifications: boolean;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  darkMode: boolean;
  tasks: ScheduleTask[];
  bookmarks: Bookmark[];
  prayerLogs: PrayerLog[];
  tasbeehCounts: { [key: string]: number };
  azkarProgress: { [key: number]: number };
  customZikr: CustomZikr[];
  lastReadSurah: number;
  lastReadAyah: number;
  location: { lat: number; lng: number; city: string; country: string } | null;
  notifications: boolean;
}

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_USER_DATA'; payload: Partial<UserData> }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOCATION'; payload: AppState['location'] }
  | { type: 'ADD_TASK'; payload: ScheduleTask }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'ADD_BOOKMARK'; payload: Bookmark }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'LOG_PRAYER'; payload: { date: string; prayer: string; done: boolean } }
  | { type: 'UPDATE_TASBEEH'; payload: { id: string; count: number } }
  | { type: 'UPDATE_AZKAR_PROGRESS'; payload: { id: number; count: number } }
  | { type: 'SET_LAST_READ'; payload: { surah: number; ayah: number } }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'ADD_CUSTOM_ZIKR'; payload: CustomZikr }
  | { type: 'DELETE_CUSTOM_ZIKR'; payload: string };

const defaultUserData: UserData = {
  tasks: [],
  bookmarks: [],
  prayerLogs: [],
  tasbeehCounts: {},
  azkarProgress: {},
  customZikr: [],
  lastReadSurah: 1,
  lastReadAyah: 1,
  location: null,
  notifications: true,
};

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  darkMode: false,
  ...defaultUserData,
};

// Save user-specific data to localStorage
function saveUserData(userId: string, state: AppState) {
  const data: UserData = {
    tasks: state.tasks,
    bookmarks: state.bookmarks,
    prayerLogs: state.prayerLogs,
    tasbeehCounts: state.tasbeehCounts,
    azkarProgress: state.azkarProgress,
    customZikr: state.customZikr,
    lastReadSurah: state.lastReadSurah,
    lastReadAyah: state.lastReadAyah,
    location: state.location,
    notifications: state.notifications,
  };
  localStorage.setItem(`noor_user_data_${userId}`, JSON.stringify(data));
}

// Load user-specific data from localStorage
function loadUserData(userId: string): Partial<UserData> {
  try {
    const saved = localStorage.getItem(`noor_user_data_${userId}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }
  return {};
}

function loadState(): AppState {
  try {
    // Check dark mode preference (saved globally, not per-user)
    const darkModeSaved = localStorage.getItem('noor_dark_mode');
    const darkMode = darkModeSaved === 'true';

    // Check if auth session exists
    const authSession = localStorage.getItem('noor_auth_session');
    if (authSession) {
      const session = JSON.parse(authSession);
      if (session.user && session.user.id) {
        // Load user-specific data
        const userData = loadUserData(session.user.id);
        return {
          ...initialState,
          darkMode,
          user: session.user,
          isAuthenticated: true,
          ...userData,
        };
      }
    }

    return { ...initialState, darkMode };
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'RESTORE_USER_DATA':
      return { ...state, ...action.payload };
    case 'LOGOUT':
      // Note: user data is saved BEFORE this action is dispatched (in the logout function)
      return { ...initialState, darkMode: state.darkMode };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'TOGGLE_TASK':
      return { ...state, tasks: state.tasks.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case 'ADD_BOOKMARK':
      return { ...state, bookmarks: [...state.bookmarks, action.payload] };
    case 'REMOVE_BOOKMARK':
      return { ...state, bookmarks: state.bookmarks.filter(b => b.id !== action.payload) };
    case 'LOG_PRAYER': {
      const { date, prayer, done } = action.payload;
      const existing = state.prayerLogs.find(l => l.date === date);
      if (existing) {
        return {
          ...state,
          prayerLogs: state.prayerLogs.map(l =>
            l.date === date ? { ...l, prayers: { ...l.prayers, [prayer]: done } } : l
          ),
        };
      }
      return { ...state, prayerLogs: [...state.prayerLogs, { date, prayers: { [prayer]: done } }] };
    }
    case 'UPDATE_TASBEEH':
      return { ...state, tasbeehCounts: { ...state.tasbeehCounts, [action.payload.id]: action.payload.count } };
    case 'UPDATE_AZKAR_PROGRESS':
      return { ...state, azkarProgress: { ...state.azkarProgress, [action.payload.id]: action.payload.count } };
    case 'SET_LAST_READ':
      return { ...state, lastReadSurah: action.payload.surah, lastReadAyah: action.payload.ayah };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'UPDATE_PROFILE':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'ADD_CUSTOM_ZIKR':
      return { ...state, customZikr: [...state.customZikr, action.payload] };
    case 'DELETE_CUSTOM_ZIKR':
      return { ...state, customZikr: state.customZikr.filter(z => z.id !== action.payload) };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  login: (user: User) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => {},
  login: () => {},
  logout: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  // Save user data whenever state changes (auto-save for logged-in user)
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      saveUserData(state.user.id, state);
      localStorage.setItem('noor_auth_session', JSON.stringify({ user: state.user }));
    }
  }, [state]);

  // Save dark mode globally
  useEffect(() => {
    localStorage.setItem('noor_dark_mode', state.darkMode ? 'true' : 'false');
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Login: set user, then restore their saved data
  const login = useCallback((user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
    const savedData = loadUserData(user.id);
    if (Object.keys(savedData).length > 0) {
      dispatch({ type: 'RESTORE_USER_DATA', payload: savedData });
    }
  }, []);

  // Logout: save user data first, then clear state
  const logout = useCallback(() => {
    if (state.user) {
      saveUserData(state.user.id, state);
    }
    localStorage.removeItem('noor_auth_session');
    dispatch({ type: 'LOGOUT' });
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch, login, logout }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
