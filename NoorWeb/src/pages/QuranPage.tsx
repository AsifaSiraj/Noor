import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, Play, Pause, Bookmark, Search, ChevronLeft, Volume2, List, Square, AlertCircle } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
}

interface AudioAyah {
  number: number;
  audio: string;
}

// Verified working audio editions from alquran.cloud API
const QARIS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', short: 'Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdul Rahman Al-Sudais', short: 'Al-Sudais' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', short: 'Al-Husary' },
];

type ViewMode = 'surahs' | 'juz' | 'reading';

export default function QuranPage() {
  const { state, dispatch } = useApp();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingAyahs, setLoadingAyahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('surahs');
  const [selectedQari, setSelectedQari] = useState(QARIS[0].id);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [selectedJuz, setSelectedJuz] = useState<number | null>(null);
  const [audioError, setAudioError] = useState('');
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playingAllRef = useRef(false);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data);
      } catch {
        setSurahs([]);
      }
      setLoading(false);
    };
    fetchSurahs();
  }, []);

  const fetchSurahAyahs = async (surahNum: number) => {
    setLoadingAyahs(true);
    setAudioError('');
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}`);
      const data = await res.json();
      setAyahs(data.data.ayahs);
      const surah = surahs.find(s => s.number === surahNum);
      if (surah) setSelectedSurah(surah);
      setViewMode('reading');
      dispatch({ type: 'SET_LAST_READ', payload: { surah: surahNum, ayah: 1 } });
    } catch {
      setAyahs([]);
    }
    setLoadingAyahs(false);
  };

  const fetchJuzAyahs = async (juzNum: number) => {
    setLoadingAyahs(true);
    setSelectedJuz(juzNum);
    setAudioError('');
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/juz/${juzNum}/quran-uthmani`);
      const data = await res.json();
      setAyahs(data.data.ayahs);
      setSelectedSurah(null);
      setViewMode('reading');
    } catch {
      setAyahs([]);
    }
    setLoadingAyahs(false);
  };

  // Fetch audio URL from API instead of constructing CDN URL manually
  const playAyah = async (ayahNumber: number) => {
    // Stop current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Toggle off if same ayah
    if (playingAyah === ayahNumber && !isPlayingAll) {
      setPlayingAyah(null);
      return;
    }

    setPlayingAyah(ayahNumber);
    setAudioError('');
    setLoadingAudio(true);

    try {
      // Use API to get the correct audio URL for the selected Qari
      const res = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/${selectedQari}`);
      const data = await res.json();

      if (data.code === 200 && data.data?.audio) {
        const audio = new Audio(data.data.audio);
        audioRef.current = audio;

        audio.onended = () => {
          setPlayingAyah(null);
          audioRef.current = null;
        };

        audio.onerror = () => {
          setPlayingAyah(null);
          audioRef.current = null;
          setAudioError(`Could not play audio for this ayah. Try a different Qari.`);
        };

        setLoadingAudio(false);
        await audio.play();
      } else {
        setPlayingAyah(null);
        setLoadingAudio(false);
        setAudioError('Audio not available for this Qari. Try another one.');
      }
    } catch {
      setPlayingAyah(null);
      setLoadingAudio(false);
      setAudioError('Network error. Check your connection and try again.');
    }
  };

  // Play entire surah by fetching all audio URLs from API
  const playSurah = async () => {
    if (isPlayingAll) {
      // Stop playback
      playingAllRef.current = false;
      setIsPlayingAll(false);
      setPlayingAyah(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    if (!selectedSurah) return;

    setIsPlayingAll(true);
    playingAllRef.current = true;
    setAudioError('');

    try {
      // Fetch all audio URLs for the surah at once
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah.number}/${selectedQari}`);
      const data = await res.json();

      if (data.code !== 200 || !data.data?.ayahs) {
        setAudioError('Could not load audio for this surah with the selected Qari.');
        setIsPlayingAll(false);
        playingAllRef.current = false;
        return;
      }

      const audioAyahs: AudioAyah[] = data.data.ayahs;
      let idx = 0;

      const playNext = () => {
        if (!playingAllRef.current || idx >= audioAyahs.length) {
          setPlayingAyah(null);
          setIsPlayingAll(false);
          playingAllRef.current = false;
          audioRef.current = null;
          return;
        }

        const a = audioAyahs[idx];
        const audio = new Audio(a.audio);
        audioRef.current = audio;
        setPlayingAyah(a.number);

        audio.onended = () => {
          idx++;
          playNext();
        };

        audio.onerror = () => {
          // Skip to next on error
          idx++;
          playNext();
        };

        audio.play().catch(() => {
          setPlayingAyah(null);
          setIsPlayingAll(false);
          playingAllRef.current = false;
          audioRef.current = null;
        });
      };

      playNext();
    } catch {
      setAudioError('Network error loading surah audio.');
      setIsPlayingAll(false);
      playingAllRef.current = false;
    }
  };

  const stopAll = () => {
    playingAllRef.current = false;
    setIsPlayingAll(false);
    setPlayingAyah(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const bookmarkAyah = (ayah: Ayah) => {
    const surahName = selectedSurah ? selectedSurah.englishName : `Juz ${selectedJuz}`;
    dispatch({
      type: 'ADD_BOOKMARK',
      payload: {
        id: `quran-${ayah.number}`,
        type: 'quran',
        title: `${surahName} - Ayah ${ayah.numberInSurah}`,
        reference: `Ayah ${ayah.number}`,
        timestamp: new Date().toISOString(),
      },
    });
    dispatch({ type: 'SET_LAST_READ', payload: { surah: selectedSurah?.number || 1, ayah: ayah.numberInSurah } });
  };

  const filteredSurahs = surahs.filter(s =>
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString().includes(searchQuery)
  );

  if (viewMode === 'reading') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <button
            onClick={() => { setViewMode(selectedSurah ? 'surahs' : 'juz'); stopAll(); setAudioError(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl ${state.darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition`}
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <h2 className={`text-xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {selectedSurah ? `${selectedSurah.number}. ${selectedSurah.englishName}` : `Juz ${selectedJuz}`}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedQari}
              onChange={e => { setSelectedQari(e.target.value); setAudioError(''); }}
              className={`px-3 py-2 rounded-xl border text-sm outline-none ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
            >
              {QARIS.map(q => (
                <option key={q.id} value={q.id}>{q.short}</option>
              ))}
            </select>
            {selectedSurah && (
              <button
                onClick={playSurah}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition ${
                  isPlayingAll ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isPlayingAll ? <Square size={16} /> : <Volume2 size={16} />}
                {isPlayingAll ? 'Stop' : 'Play All'}
              </button>
            )}
          </div>
        </div>

        {/* Audio Error */}
        {audioError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={16} />
            {audioError}
          </div>
        )}

        {selectedSurah && (
          <div className={`text-center py-6 rounded-2xl ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100'} border`}>
            <p className="arabic-text text-2xl mb-2" style={{ color: state.darkMode ? '#e5e7eb' : '#1f2937' }}>
              {selectedSurah.name}
            </p>
            <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {selectedSurah.englishNameTranslation} • {selectedSurah.numberOfAyahs} Ayahs • {selectedSurah.revelationType}
            </p>
            {selectedSurah.number !== 9 && (
              <p className="arabic-text text-xl mt-4" style={{ color: '#059669' }}>
                بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ
              </p>
            )}
          </div>
        )}

        {/* Now Playing Indicator */}
        {isPlayingAll && (
          <div className={`p-3 rounded-xl ${state.darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'} border flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                <div className="w-1 h-4 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                <div className="w-1 h-5 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
              <span className={`text-sm font-medium ${state.darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Now playing: {QARIS.find(q => q.id === selectedQari)?.name}
              </span>
            </div>
            <button onClick={stopAll} className="text-sm text-red-500 font-medium hover:text-red-600 transition">
              Stop
            </button>
          </div>
        )}

        {/* Ayahs */}
        {loadingAyahs ? (
          <div className="flex justify-center py-16">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {ayahs.map(ayah => {
              const isBookmarked = state.bookmarks.some(b => b.id === `quran-${ayah.number}`);
              const isPlaying = playingAyah === ayah.number;
              const isLoading = loadingAudio && isPlaying;

              return (
                <div
                  key={ayah.number}
                  className={`rounded-2xl p-6 transition-all ${
                    isPlaying
                      ? state.darkMode ? 'bg-emerald-900/30 border-emerald-700 shadow-lg' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-300 shadow-lg'
                      : state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                  } border`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      state.darkMode ? 'bg-gray-800 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {ayah.numberInSurah}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => playAyah(ayah.number)}
                        disabled={isLoading}
                        className={`p-2 rounded-xl transition ${
                          isPlaying
                            ? 'bg-emerald-500 text-white'
                            : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        } disabled:opacity-50`}
                      >
                        {isLoading ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : isPlaying ? (
                          <Pause size={16} />
                        ) : (
                          <Play size={16} />
                        )}
                      </button>
                      <button
                        onClick={() => bookmarkAyah(ayah)}
                        className={`p-2 rounded-xl transition ${isBookmarked ? 'bg-amber-100 text-amber-600' : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <p className="arabic-text text-2xl text-right leading-[2.5]" style={{ color: state.darkMode ? '#e5e7eb' : '#1f2937' }}>
                    {ayah.text}
                  </p>
                  <p className={`text-xs mt-2 ${state.darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Juz {ayah.juz}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>📖 The Holy Quran</h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>Read, listen, and reflect</p>
      </div>

      {/* Continue Reading */}
      {state.lastReadSurah > 0 && (
        <div
          onClick={() => fetchSurahAyahs(state.lastReadSurah)}
          className={`rounded-2xl p-5 cursor-pointer transition-all hover:shadow-lg ${state.darkMode ? 'bg-gradient-to-r from-emerald-900/50 to-green-900/50 border-emerald-800' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200'} border`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-emerald-600" />
              <div>
                <p className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Continue Reading</p>
                <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Surah {state.lastReadSurah}, Ayah {state.lastReadAyah}
                </p>
              </div>
            </div>
            <span className="text-emerald-600 font-medium text-sm">Resume →</span>
          </div>
        </div>
      )}

      {/* Qari Selection */}
      <div className={`rounded-2xl p-4 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
        <p className={`text-sm font-medium mb-3 ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>🎙️ Select Qari (Reciter)</p>
        <div className="flex flex-wrap gap-2">
          {QARIS.map(q => (
            <button
              key={q.id}
              onClick={() => setSelectedQari(q.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                selectedQari === q.id
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {q.name}
            </button>
          ))}
        </div>
      </div>

      {/* View Toggle */}
      <div className={`flex rounded-2xl p-1.5 ${state.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <button
          onClick={() => setViewMode('surahs')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'surahs'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
              : state.darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <BookOpen size={16} />
          By Surah
        </button>
        <button
          onClick={() => setViewMode('juz')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'juz'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
              : state.darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          <List size={16} />
          By Juz (Para)
        </button>
      </div>

      {viewMode === 'surahs' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search surah by name or number..."
              className={`w-full pl-12 pr-4 py-3.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
            />
          </div>

          {/* Surah List */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {filteredSurahs.map(surah => (
                <button
                  key={surah.number}
                  onClick={() => fetchSurahAyahs(surah.number)}
                  className={`p-4 rounded-2xl text-left flex items-center gap-4 transition-all hover:shadow-md ${state.darkMode ? 'bg-gray-900 border-gray-800 hover:border-emerald-700' : 'bg-white border-gray-100 hover:border-emerald-300'} border`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${state.darkMode ? 'bg-gray-800 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                    {surah.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-semibold truncate ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {surah.englishName}
                      </h3>
                      <span className="arabic-text text-lg text-emerald-600 ml-2 shrink-0">{surah.name}</span>
                    </div>
                    <p className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {surah.englishNameTranslation} • {surah.numberOfAyahs} Ayahs
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {viewMode === 'juz' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
            <button
              key={juz}
              onClick={() => fetchJuzAyahs(juz)}
              className={`p-5 rounded-2xl text-center transition-all hover:shadow-md ${state.darkMode ? 'bg-gray-900 border-gray-800 hover:border-emerald-700' : 'bg-white border-gray-100 hover:border-emerald-300'} border`}
            >
              <div className={`w-14 h-14 rounded-xl mx-auto mb-3 flex items-center justify-center font-bold text-lg ${state.darkMode ? 'bg-gray-800 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                {juz}
              </div>
              <p className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Juz {juz}</p>
              <p className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Para {juz}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
