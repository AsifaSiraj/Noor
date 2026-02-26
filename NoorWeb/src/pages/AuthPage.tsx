import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

export default function AuthPage() {
  const { state, login } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if (mode === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      // Save user
      const users = JSON.parse(localStorage.getItem('noor_users') || '[]');
      if (users.find((u: { email: string }) => u.email === formData.email)) {
        setError('Email already registered');
        setLoading(false);
        return;
      }
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        password: btoa(formData.password), // Simple encoding for demo
        joinedAt: new Date().toISOString(),
      };
      users.push(newUser);
      localStorage.setItem('noor_users', JSON.stringify(users));

      login({ id: newUser.id, name: newUser.name, email: newUser.email, joinedAt: newUser.joinedAt });
      navigate('/dashboard');
    } else if (mode === 'login') {
      const users = JSON.parse(localStorage.getItem('noor_users') || '[]');
      const user = users.find((u: { email: string; password: string }) => u.email === formData.email && u.password === btoa(formData.password));
      if (!user) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      login({ id: user.id, name: user.name, email: user.email, joinedAt: user.joinedAt });
      navigate('/dashboard');
    } else if (mode === 'forgot') {
      const users = JSON.parse(localStorage.getItem('noor_users') || '[]');
      if (users.find((u: { email: string }) => u.email === formData.email)) {
        setSuccess('Password reset link sent to your email (demo: password reset to "123456")');
        const updatedUsers = users.map((u: { email: string }) =>
          u.email === formData.email ? { ...u, password: btoa('123456') } : u
        );
        localStorage.setItem('noor_users', JSON.stringify(updatedUsers));
      } else {
        setError('Email not found');
      }
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex ${state.darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-emerald-50 via-white to-green-50'}`}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 items-center justify-center p-12">
        <div className="islamic-pattern absolute inset-0 opacity-20" />
        <div className="relative z-10 text-center text-white space-y-8 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-3xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
            <span className="text-5xl">☪</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">Noor</h1>
          <p className="text-emerald-200 text-lg leading-relaxed">
            Your complete Islamic companion. Prayer times, Quran, Azkar, Qibla direction, and more — all in one beautiful app.
          </p>
          <div className="flex gap-4 justify-center text-sm text-emerald-300">
            <span className="px-3 py-1 rounded-full bg-white/10">🕌 Prayer Times</span>
            <span className="px-3 py-1 rounded-full bg-white/10">📖 Quran</span>
            <span className="px-3 py-1 rounded-full bg-white/10">🧭 Qibla</span>
          </div>
          <p className="arabic-text text-2xl text-emerald-100">
            إِنَّ مَعَ الْعُسْرِ يُسْرًا
          </p>
          <p className="text-emerald-300 text-sm">Indeed, with hardship comes ease. (94:6)</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fadeIn">
          {/* Mobile logo */}
          <div className="lg:hidden text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-200">
              <span className="text-3xl text-white">☪</span>
            </div>
            <h1 className="text-2xl font-bold text-emerald-700">Noor</h1>
          </div>

          <div className="space-y-2">
            <h2 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
              {mode === 'login' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
            </h2>
            <p className={`${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {mode === 'login' ? 'Sign in to continue your journey' : mode === 'signup' ? 'Start your Islamic journey today' : 'Enter your email to reset password'}
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm animate-fadeIn">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="Your full name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-2">
                <label className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full pl-12 pr-12 py-3.5 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <label className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 rounded-xl border transition-all focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold shadow-lg shadow-emerald-200 hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-4">
            {mode === 'login' ? (
              <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Don't have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Sign Up
                </button>
              </p>
            ) : (
              <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-emerald-600 font-semibold hover:text-emerald-700">
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
