import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { MapPin, Bell, BellOff, Check, Search, Locate, AlertCircle } from 'lucide-react';

interface PrayerTiming {
  name: string;
  time: string;
  arabic: string;
  icon: string;
}

export default function PrayerTimesPage() {
  const { state, dispatch } = useApp();
  const [prayers, setPrayers] = useState<PrayerTiming[]>([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(state.location?.city || '');
  const [country, setCountry] = useState(state.location?.country || '');
  const [manualCity, setManualCity] = useState('');
  const [manualCountry, setManualCountry] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [method, setMethod] = useState(2);
  const [alarms, setAlarms] = useState<{ [key: string]: boolean }>({});
  const [showManual, setShowManual] = useState(false);
  const [nextPrayer, setNextPrayer] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [detectingGPS, setDetectingGPS] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = state.prayerLogs.find(l => l.date === todayStr);

  const processPrayerData = useCallback((data: { data: { timings: Record<string, string>; date: { hijri: { day: string; month: { en: string }; year: string } }; meta: { timezone: string } } }, displayCity?: string, displayCountry?: string) => {
    const t = data.data.timings;
    const hijri = data.data.date.hijri;
    const meta = data.data.meta;

    setHijriDate(`${hijri.day} ${hijri.month.en} ${hijri.year} AH`);

    const detectedCity = displayCity || meta.timezone?.split('/').pop()?.replace(/_/g, ' ') || '';
    const detectedCountry = displayCountry || '';
    setCity(detectedCity);
    setCountry(detectedCountry);

    setPrayers([
      { name: 'Fajr', time: t.Fajr, arabic: 'الفجر', icon: '🌅' },
      { name: 'Sunrise', time: t.Sunrise, arabic: 'الشروق', icon: '☀️' },
      { name: 'Dhuhr', time: t.Dhuhr, arabic: 'الظهر', icon: '🌤️' },
      { name: 'Asr', time: t.Asr, arabic: 'العصر', icon: '⛅' },
      { name: 'Maghrib', time: t.Maghrib, arabic: 'المغرب', icon: '🌅' },
      { name: 'Isha', time: t.Isha, arabic: 'العشاء', icon: '🌙' },
    ]);

    // Find next prayer
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const prayerList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const timings: { [k: string]: string } = { Fajr: t.Fajr, Dhuhr: t.Dhuhr, Asr: t.Asr, Maghrib: t.Maghrib, Isha: t.Isha };
    const next = prayerList.find(p => {
      const parts = timings[p].split(':').map(Number);
      return parts[0] * 60 + parts[1] > currentMinutes;
    });
    setNextPrayer(next || 'Fajr');
    setSearchError('');
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lng}&method=${method}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200) {
        processPrayerData(data);
        // Try to reverse geocode for city name
        try {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            const c = geoData.address?.city || geoData.address?.town || geoData.address?.village || geoData.address?.state || '';
            const co = geoData.address?.country || '';
            if (c) {
              setCity(c);
              setCountry(co);
              dispatch({ type: 'SET_LOCATION', payload: { lat, lng, city: c, country: co } });
            }
          }
        } catch {
          // reverse geocode failed, that's ok
        }
      } else {
        throw new Error('API error');
      }
    } catch {
      setPrayers([
        { name: 'Fajr', time: '05:00', arabic: 'الفجر', icon: '🌅' },
        { name: 'Sunrise', time: '06:30', arabic: 'الشروق', icon: '☀️' },
        { name: 'Dhuhr', time: '12:15', arabic: 'الظهر', icon: '🌤️' },
        { name: 'Asr', time: '15:30', arabic: 'العصر', icon: '⛅' },
        { name: 'Maghrib', time: '18:15', arabic: 'المغرب', icon: '🌅' },
        { name: 'Isha', time: '19:45', arabic: 'العشاء', icon: '🌙' },
      ]);
      setSearchError('Could not fetch prayer times. Showing default times.');
    }
    setLoading(false);
  }, [method, processPrayerData, dispatch]);

  const fetchByCity = useCallback(async (cityName: string, countryName: string) => {
    setLoading(true);
    setSearching(true);
    setSearchError('');
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      const url = `https://api.aladhan.com/v1/timingsByCity/${dd}-${mm}-${yyyy}?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&method=${method}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.code === 200) {
        processPrayerData(data, cityName, countryName);
        setShowManual(false);
      } else {
        setSearchError(`Could not find prayer times for "${cityName}, ${countryName}". Please check the spelling and try again.`);
      }
    } catch {
      setSearchError('Network error. Please check your connection and try again.');
    }
    setLoading(false);
    setSearching(false);
  }, [method, processPrayerData]);

  const detectGPS = useCallback(async () => {
    setDetectingGPS(true);
    setSearchError('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          dispatch({ type: 'SET_LOCATION', payload: { lat: latitude, lng: longitude, city: '', country: '' } });
          fetchByCoords(latitude, longitude);
          setDetectingGPS(false);
        },
        async () => {
          // GPS failed, try IP
          try {
            const ipRes = await fetch('https://ipapi.co/json/');
            if (ipRes.ok) {
              const ipData = await ipRes.json();
              if (ipData.latitude && ipData.longitude && !ipData.error) {
                dispatch({ type: 'SET_LOCATION', payload: { lat: ipData.latitude, lng: ipData.longitude, city: ipData.city || '', country: ipData.country_name || '' } });
                fetchByCoords(ipData.latitude, ipData.longitude);
                setDetectingGPS(false);
                return;
              }
            }
          } catch {
            // IP fallback also failed
          }
          setSearchError('Could not detect location. Please enter city and country manually.');
          setShowManual(true);
          setDetectingGPS(false);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setSearchError('Geolocation not supported. Please enter city manually.');
      setShowManual(true);
      setDetectingGPS(false);
      setLoading(false);
    }
  }, [dispatch, fetchByCoords]);

  // Initial load
  useEffect(() => {
    if (state.location && state.location.lat !== 0) {
      setCity(state.location.city || '');
      setCountry(state.location.country || '');
      fetchByCoords(state.location.lat, state.location.lng);
    } else {
      detectGPS();
    }

    // Load alarms
    const saved = localStorage.getItem('noor_alarms');
    if (saved) setAlarms(JSON.parse(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSearch = () => {
    if (!manualCity.trim()) {
      setSearchError('Please enter a city name.');
      return;
    }
    if (!manualCountry.trim()) {
      setSearchError('Please enter a country name.');
      return;
    }
    fetchByCity(manualCity.trim(), manualCountry.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  const toggleAlarm = (prayer: string) => {
    const newAlarms = { ...alarms, [prayer]: !alarms[prayer] };
    setAlarms(newAlarms);
    localStorage.setItem('noor_alarms', JSON.stringify(newAlarms));

    if (newAlarms[prayer] && 'Notification' in window) {
      Notification.requestPermission();
    }
  };

  const togglePrayerDone = (prayer: string) => {
    const done = !(todayLog?.prayers[prayer]);
    dispatch({ type: 'LOG_PRAYER', payload: { date: todayStr, prayer, done } });
  };

  const prayersDoneCount = todayLog ? Object.values(todayLog.prayers).filter(Boolean).length : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>⏰ Prayer Times</h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>{hijriDate}</p>
      </div>

      {/* Location Card */}
      <div className={`rounded-2xl p-5 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <div>
              <p className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {city || (loading ? 'Detecting location...' : 'Location not set')}
              </p>
              {country && <p className={`text-sm ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{country}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={detectGPS}
              disabled={detectingGPS}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm font-medium disabled:opacity-50"
            >
              <Locate size={16} />
              {detectingGPS ? 'Detecting...' : 'Detect GPS'}
            </button>
            <button
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition text-sm font-medium"
            >
              <Search size={16} />
              Search City
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {searchError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-3 animate-fadeIn">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <p>{searchError}</p>
        </div>
      )}

      {/* Manual Search Panel */}
      {showManual && (
        <div className={`rounded-2xl p-6 space-y-4 animate-fadeIn ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            🔍 Search by City & Country
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
              <input
                type="text"
                value={manualCity}
                onChange={e => { setManualCity(e.target.value); setSearchError(''); }}
                onKeyDown={handleKeyPress}
                placeholder="e.g., London, Islamabad, Dubai"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
              <input
                type="text"
                value={manualCountry}
                onChange={e => { setManualCountry(e.target.value); setSearchError(''); }}
                onKeyDown={handleKeyPress}
                placeholder="e.g., UK, Pakistan, UAE"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
              />
            </div>
          </div>
          <div>
            <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Calculation Method</label>
            <select
              value={method}
              onChange={e => setMethod(Number(e.target.value))}
              className={`w-full px-4 py-3 rounded-xl border outline-none ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
            >
              <option value={1}>University of Islamic Sciences, Karachi</option>
              <option value={2}>Islamic Society of North America (ISNA)</option>
              <option value={3}>Muslim World League</option>
              <option value={4}>Umm Al-Qura University, Makkah</option>
              <option value={5}>Egyptian General Authority of Survey</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setShowManual(false); setSearchError(''); }}
              className={`px-4 py-2.5 rounded-xl ${state.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={handleManualSearch}
              disabled={searching}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Search size={16} />
              )}
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className={`rounded-2xl p-5 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100'} border`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Today's Prayer Progress</span>
          <span className="text-emerald-600 font-bold">{prayersDoneCount}/5</span>
        </div>
        <div className={`h-3 rounded-full ${state.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-700"
            style={{ width: `${(prayersDoneCount / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Prayer Cards */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fetching prayer times...</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prayers.map((p) => {
            const isNext = p.name === nextPrayer;
            const isPrayer = p.name !== 'Sunrise';
            const isDone = todayLog?.prayers[p.name];

            return (
              <div
                key={p.name}
                className={`rounded-2xl p-5 flex items-center justify-between transition-all ${
                  isNext
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : state.darkMode
                      ? 'bg-gray-900 border-gray-800 border'
                      : 'bg-white border-gray-100 border hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-lg font-bold ${isNext ? 'text-white' : state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {p.name}
                      </h3>
                      {isNext && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Next</span>}
                    </div>
                    <p className={`text-sm ${isNext ? 'text-emerald-100' : state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {p.arabic}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xl font-mono font-bold ${isNext ? 'text-white' : state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {p.time}
                  </span>

                  {isPrayer && (
                    <>
                      <button
                        onClick={() => toggleAlarm(p.name)}
                        className={`p-2 rounded-xl transition ${
                          alarms[p.name]
                            ? 'bg-amber-100 text-amber-600'
                            : isNext
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                        title={alarms[p.name] ? 'Alarm on' : 'Set alarm'}
                      >
                        {alarms[p.name] ? <Bell size={18} /> : <BellOff size={18} />}
                      </button>
                      <button
                        onClick={() => togglePrayerDone(p.name)}
                        className={`p-2 rounded-xl transition ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-600'
                            : isNext
                              ? 'bg-white/20 text-white hover:bg-white/30'
                              : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                        }`}
                      >
                        <Check size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
