import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Clock, BookOpen, Heart, Compass, Calendar, TrendingUp, Star, Zap, CheckCircle2 } from 'lucide-react';

interface PrayerTime {
  name: string;
  time: string;
}

export default function Dashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTime | null>(null);
  const [hijriDate, setHijriDate] = useState('');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        
        let url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}`;
        if (state.location) {
          url += `?latitude=${state.location.lat}&longitude=${state.location.lng}&method=2`;
        } else {
          url += `?latitude=21.4225&longitude=39.8262&method=2`;
        }

        const res = await fetch(url);
        const data = await res.json();
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;
        setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);

        const prayers: PrayerTime[] = [
          { name: 'Fajr', time: timings.Fajr },
          { name: 'Dhuhr', time: timings.Dhuhr },
          { name: 'Asr', time: timings.Asr },
          { name: 'Maghrib', time: timings.Maghrib },
          { name: 'Isha', time: timings.Isha },
        ];
        setPrayerTimes(prayers);

        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const next = prayers.find(p => {
          const [h, m] = p.time.split(':').map(Number);
          return h * 60 + m > currentMinutes;
        });
        setNextPrayer(next || prayers[0]);
      } catch {
        setPrayerTimes([
          { name: 'Fajr', time: '05:00' },
          { name: 'Dhuhr', time: '12:15' },
          { name: 'Asr', time: '15:30' },
          { name: 'Maghrib', time: '18:15' },
          { name: 'Isha', time: '19:45' },
        ]);
      }
    };
    fetchPrayerTimes();
  }, [state.location]);

  // AI Recommendations
  const getRecommendations = () => {
    const totalTasks = state.tasks.length;
    const completedTasks = state.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayLog = state.prayerLogs.find(l => l.date === todayStr);
    const prayersDone = todayLog ? Object.values(todayLog.prayers).filter(Boolean).length : 0;

    const recs = [];
    if (prayersDone < 5) {
      recs.push({ icon: '🕌', text: `You've prayed ${prayersDone}/5 today. Keep going!`, type: 'prayer' });
    }
    if (completionRate < 50 && totalTasks > 0) {
      recs.push({ icon: '📋', text: 'Try completing your tasks right after Fajr for peak productivity.', type: 'productivity' });
    }
    const hour = new Date().getHours();
    if (hour >= 5 && hour <= 7) {
      recs.push({ icon: '🌅', text: 'After Fajr is the best time for Quran recitation and dhikr.', type: 'spiritual' });
    } else if (hour >= 17 && hour <= 19) {
      recs.push({ icon: '🌆', text: 'Time for Evening Azkar. Protect yourself with remembrance.', type: 'spiritual' });
    }
    if (Object.keys(state.tasbeehCounts).length === 0) {
      recs.push({ icon: '📿', text: 'Start your Tasbeeh journey today. Even 33 SubhanAllah counts!', type: 'spiritual' });
    }
    recs.push({ icon: '💡', text: 'Consistency is key. Small daily deeds are beloved to Allah.', type: 'motivation' });
    return recs.slice(0, 3);
  };

  const quickActions = [
    { label: 'Qibla', icon: Compass, path: '/qibla', color: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-200' },
    { label: 'Prayer Times', icon: Clock, path: '/prayer-times', color: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-200' },
    { label: 'Azkar', icon: Heart, path: '/azkar', color: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-200' },
    { label: 'Quran', icon: BookOpen, path: '/quran', color: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-200' },
    { label: 'Schedule', icon: Calendar, path: '/schedule', color: 'from-rose-500 to-rose-600', shadow: 'shadow-rose-200' },
    { label: 'Progress', icon: TrendingUp, path: '/profile', color: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-200' },
  ];

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = state.tasks.filter(t => t.date === todayStr);
  const completedToday = todayTasks.filter(t => t.completed).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <div className={`rounded-3xl p-8 bg-gradient-to-r from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden`}>
        <div className="islamic-pattern absolute inset-0 opacity-10" />
        <div className="relative z-10">
          <p className="text-emerald-200 text-sm mb-1">{hijriDate || 'Loading...'}</p>
          <h2 className="text-3xl font-bold mb-2">{greeting}, {state.user?.name?.split(' ')[0] || 'User'} 👋</h2>
          <p className="text-emerald-200 text-lg">
            {nextPrayer ? `Next prayer: ${nextPrayer.name} at ${nextPrayer.time}` : 'Loading prayer times...'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className={`text-lg font-semibold mb-4 ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map(action => (
            <button
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`p-5 rounded-2xl ${state.darkMode ? 'bg-gray-900 hover:bg-gray-800' : 'bg-white hover:shadow-lg'} transition-all duration-300 group border ${state.darkMode ? 'border-gray-800' : 'border-gray-100'}`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-3 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform`}>
                <action.icon size={22} className="text-white" />
              </div>
              <p className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{action.label}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prayer Times Widget */}
        <div className={`rounded-2xl p-6 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-lg font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Today's Prayers</h3>
            <Clock size={20} className="text-emerald-500" />
          </div>
          <div className="space-y-3">
            {prayerTimes.map(p => {
              const isNext = nextPrayer?.name === p.name;
              return (
                <div
                  key={p.name}
                  className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                    isNext
                      ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200'
                      : state.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isNext && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    <span className={`font-medium ${isNext ? 'text-emerald-700' : state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {p.name}
                    </span>
                    {isNext && <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">Next</span>}
                  </div>
                  <span className={`font-mono font-semibold ${isNext ? 'text-emerald-700' : state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {p.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className={`rounded-2xl p-6 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center justify-between mb-5">
            <h3 className={`text-lg font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>AI Recommendations</h3>
            <Zap size={20} className="text-gold-500" />
          </div>
          <div className="space-y-4">
            {getRecommendations().map((rec, i) => (
              <div key={i} className={`flex items-start gap-3 p-4 rounded-xl ${state.darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100'}`}>
                <span className="text-2xl">{rec.icon}</span>
                <p className={`text-sm leading-relaxed ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rec.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className={`rounded-2xl p-6 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center gap-2 mb-4">
            <Star size={20} className="text-gold-500" />
            <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Today's Progress</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>Tasks</span>
                <span className="font-medium text-emerald-600">{completedToday}/{todayTasks.length}</span>
              </div>
              <div className={`h-2 rounded-full ${state.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                  style={{ width: `${todayTasks.length > 0 ? (completedToday / todayTasks.length) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>Bookmarks</span>
                <span className="font-medium text-blue-600">{state.bookmarks.length}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>Quran Progress</span>
                <span className="font-medium text-purple-600">Surah {state.lastReadSurah}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Last Read */}
        <div
          className={`rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}
          onClick={() => navigate('/quran')}
        >
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={20} className="text-purple-500" />
            <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Continue Reading</h3>
          </div>
          <div className={`p-4 rounded-xl ${state.darkMode ? 'bg-gray-800' : 'bg-purple-50'}`}>
            <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last read position</p>
            <p className={`text-lg font-semibold mt-1 ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Surah {state.lastReadSurah}, Ayah {state.lastReadAyah}
            </p>
            <p className="text-emerald-600 text-sm mt-2 font-medium">Tap to continue →</p>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className={`rounded-2xl p-6 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Today's Tasks</h3>
            </div>
            <button onClick={() => navigate('/schedule')} className="text-emerald-600 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {todayTasks.length === 0 ? (
              <p className={`text-sm ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No tasks for today. Add some in Schedule!</p>
            ) : (
              todayTasks.slice(0, 4).map(task => (
                <div key={task.id} className={`flex items-center gap-3 p-2 rounded-lg ${task.completed ? 'opacity-50' : ''}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'}`}>
                    {task.completed && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={`text-sm ${task.completed ? 'line-through' : ''} ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {task.title}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
