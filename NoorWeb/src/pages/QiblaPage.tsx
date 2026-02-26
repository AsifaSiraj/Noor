import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Navigation, MapPin, RotateCcw, Locate, Edit3 } from 'lucide-react';

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(deg: number) { return deg * (Math.PI / 180); }
function toDegrees(rad: number) { return rad * (180 / Math.PI); }

function calculateQiblaDirection(lat: number, lng: number): number {
  const phiK = toRadians(KAABA_LAT);
  const lambdaK = toRadians(KAABA_LNG);
  const phi = toRadians(lat);
  const lambda = toRadians(lng);
  const x = Math.sin(lambdaK - lambda);
  const y = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);
  let qibla = toDegrees(Math.atan2(x, y));
  if (qibla < 0) qibla += 360;
  return qibla;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function QiblaPage() {
  const { state, dispatch } = useApp();
  const [qiblaAngle, setQiblaAngle] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [hasCompass, setHasCompass] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(true);
  const [userLat, setUserLat] = useState(0);
  const [userLng, setUserLng] = useState(0);
  const [distance, setDistance] = useState(0);
  const [cityName, setCityName] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualLat, setManualLat] = useState('');
  const [manualLng, setManualLng] = useState('');
  const [detecting, setDetecting] = useState(false);

  const applyLocation = useCallback((lat: number, lng: number, city?: string, country?: string) => {
    setUserLat(lat);
    setUserLng(lng);
    const angle = calculateQiblaDirection(lat, lng);
    setQiblaAngle(angle);
    setDistance(calculateDistance(lat, lng, KAABA_LAT, KAABA_LNG));
    const cName = city || '';
    const coName = country || '';
    dispatch({ type: 'SET_LOCATION', payload: { lat, lng, city: cName, country: coName } });
    if (cName) {
      setCityName(cName + (coName ? `, ${coName}` : ''));
    }
    setLoading(false);
    setDetecting(false);
    setLocationError('');
  }, [dispatch]);

  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`);
      if (!res.ok) return;
      const data = await res.json();
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state || '';
      const country = data.address?.country || '';
      setCityName(city + (country ? `, ${country}` : ''));
      dispatch({ type: 'SET_LOCATION', payload: { lat, lng, city, country } });
    } catch {
      // Reverse geocode failed, that's ok
    }
  }, [dispatch]);

  const getLocationByIP = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (!res.ok) return false;
      const data = await res.json();
      if (data.error) return false;
      if (data.latitude && data.longitude) {
        applyLocation(data.latitude, data.longitude, data.city, data.country_name);
        return true;
      }
    } catch {
      // IP geolocation failed
    }
    return false;
  }, [applyLocation]);

  const detectLocation = useCallback(async () => {
    setLoading(true);
    setDetecting(true);
    setLocationError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          applyLocation(latitude, longitude);
          reverseGeocode(latitude, longitude);
        },
        async () => {
          // GPS failed, try IP-based fallback
          const ipOk = await getLocationByIP();
          if (!ipOk) {
            setLocationError('Could not detect location via GPS or IP. Please enter your coordinates manually below.');
            setShowManual(true);
            setLoading(false);
            setDetecting(false);
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      // No GPS, try IP
      const ipOk = await getLocationByIP();
      if (!ipOk) {
        setLocationError('Geolocation not supported. Please enter your coordinates manually.');
        setShowManual(true);
        setLoading(false);
        setDetecting(false);
      }
    }
  }, [applyLocation, reverseGeocode, getLocationByIP]);

  // Initialize on mount
  useEffect(() => {
    if (state.location && state.location.lat !== 0 && state.location.lng !== 0) {
      applyLocation(state.location.lat, state.location.lng, state.location.city, state.location.country);
    } else {
      detectLocation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Device orientation for compass
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        setDeviceHeading(e.alpha);
        setHasCompass(true);
      }
    };

    if ('DeviceOrientationEvent' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const DOE = DeviceOrientationEvent as any;
      if (typeof DOE.requestPermission === 'function') {
        DOE.requestPermission().then((resp: string) => {
          if (resp === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        }).catch(() => {});
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleManualSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError('Please enter valid coordinates. Latitude: -90 to 90, Longitude: -180 to 180');
      return;
    }
    applyLocation(lat, lng);
    reverseGeocode(lat, lng);
    setShowManual(false);
    setManualLat('');
    setManualLng('');
  };

  const compassRotation = hasCompass ? -deviceHeading : 0;
  const needleRotation = hasCompass ? qiblaAngle - deviceHeading : qiblaAngle;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
          🧭 Qibla Direction
        </h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>
          Find the direction of the Kaaba for prayer
        </p>
      </div>

      {locationError && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm text-center">
          ⚠️ {locationError}
        </div>
      )}

      {/* Compass */}
      <div className={`rounded-3xl p-8 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border flex flex-col items-center`}>
        {loading ? (
          <div className="w-64 h-64 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {detecting ? 'Detecting your location...' : 'Loading...'}
            </p>
          </div>
        ) : (
          <div className="relative w-72 h-72 sm:w-80 sm:h-80">
            {/* Compass Rose */}
            <div
              className="w-full h-full rounded-full border-4 border-emerald-200 relative transition-transform duration-300"
              style={{ transform: `rotate(${compassRotation}deg)` }}
            >
              {/* Cardinal directions */}
              <span className="absolute top-2 left-1/2 -translate-x-1/2 text-red-500 font-bold text-lg">N</span>
              <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-lg ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>S</span>
              <span className={`absolute left-2 top-1/2 -translate-y-1/2 font-bold text-lg ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>W</span>
              <span className={`absolute right-2 top-1/2 -translate-y-1/2 font-bold text-lg ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E</span>

              {/* Degree markers */}
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 bg-gray-300"
                  style={{
                    height: i % 3 === 0 ? '12px' : '6px',
                    top: '0',
                    left: '50%',
                    transformOrigin: '50% 144px',
                    transform: `translateX(-50%) rotate(${i * 10}deg)`,
                  }}
                />
              ))}

              {/* Inner circle */}
              <div className={`absolute inset-8 rounded-full ${state.darkMode ? 'bg-gray-800' : 'bg-emerald-50'} flex items-center justify-center`}>
                <div className={`text-center ${state.darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  <p className="text-4xl font-bold text-emerald-600">{Math.round(qiblaAngle)}°</p>
                  <p className={`text-xs mt-1 ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qibla</p>
                </div>
              </div>
            </div>

            {/* Qibla Needle */}
            <div
              className="absolute inset-0 transition-transform duration-300"
              style={{ transform: `rotate(${needleRotation}deg)` }}
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-300 animate-pulse-glow">
                  <span className="text-white text-sm">🕋</span>
                </div>
                <div className="w-0.5 h-8 bg-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3 flex-wrap justify-center">
          <button
            onClick={detectLocation}
            disabled={detecting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition font-medium text-sm disabled:opacity-50"
          >
            <Locate size={16} />
            {detecting ? 'Detecting...' : 'Detect Location'}
          </button>
          <button
            onClick={() => setShowManual(!showManual)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${state.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            <Edit3 size={16} />
            Enter Manually
          </button>
          {!loading && (
            <button
              onClick={detectLocation}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition ${state.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <RotateCcw size={16} />
              Recalibrate
            </button>
          )}
        </div>
      </div>

      {/* Manual Entry */}
      {showManual && (
        <div className={`rounded-2xl p-6 space-y-4 animate-fadeIn ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <h3 className={`font-semibold flex items-center gap-2 ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <MapPin size={18} className="text-blue-500" />
            Enter Your Coordinates
          </h3>
          <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            You can find your coordinates by searching your city on Google Maps
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Latitude</label>
              <input
                type="number"
                step="any"
                value={manualLat}
                onChange={e => setManualLat(e.target.value)}
                placeholder="e.g., 33.6844 (Islamabad)"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Longitude</label>
              <input
                type="number"
                step="any"
                value={manualLng}
                onChange={e => setManualLng(e.target.value)}
                placeholder="e.g., 73.0479 (Islamabad)"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowManual(false)}
              className={`px-4 py-2 rounded-xl ${state.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={handleManualSubmit}
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Set Location
            </button>
          </div>
        </div>
      )}

      {/* Info Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={`rounded-2xl p-5 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <MapPin size={20} className="text-blue-600" />
            </div>
            <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Your Location</h3>
          </div>
          {cityName && (
            <p className={`text-sm font-medium mb-1 ${state.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              📍 {cityName}
            </p>
          )}
          <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Lat: {userLat.toFixed(4)}° | Lng: {userLng.toFixed(4)}°
          </p>
        </div>

        <div className={`rounded-2xl p-5 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Navigation size={20} className="text-emerald-600" />
            </div>
            <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Distance to Kaaba</h3>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{Math.round(distance).toLocaleString()} km</p>
          <p className={`text-xs mt-1 ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Kaaba: 21.4225°N, 39.8262°E
          </p>
        </div>
      </div>

      {!hasCompass && !loading && (
        <div className={`rounded-2xl p-5 text-center ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-amber-50 border-amber-200'} border`}>
          <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-amber-700'}`}>
            📱 For live compass, open on a mobile device with compass sensor. The arrow shows the Qibla direction ({Math.round(qiblaAngle)}° from North).
          </p>
        </div>
      )}
    </div>
  );
}
