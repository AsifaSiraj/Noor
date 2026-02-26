import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { CustomZikr } from '@/context/AppContext';
import { morningAzkar, eveningAzkar, tasbeehItems, hijriMonths, tuhfatulAkhirat } from '@/data/azkarData';
import { Sun, Moon, RotateCcw, Plus, Minus, Calendar, BookOpen, Heart, Trash2, X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

type Tab = 'morning' | 'evening' | 'tasbeeh' | 'custom' | 'book' | 'calendar';

export default function AzkarPage() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('morning');
  const [selectedTasbeeh, setSelectedTasbeeh] = useState(0);

  // Custom Zikr state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newZikrArabic, setNewZikrArabic] = useState('');
  const [newZikrTranslation, setNewZikrTranslation] = useState('');
  const [newZikrTarget, setNewZikrTarget] = useState(33);
  const [formError, setFormError] = useState('');

  // Book state
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  const azkar = activeTab === 'morning' ? morningAzkar : eveningAzkar;

  const handleAzkarTap = (id: number, maxCount: number) => {
    const current = state.azkarProgress[id] || 0;
    if (current < maxCount) {
      dispatch({ type: 'UPDATE_AZKAR_PROGRESS', payload: { id, count: current + 1 } });
    }
  };

  const resetAzkar = (id: number) => {
    dispatch({ type: 'UPDATE_AZKAR_PROGRESS', payload: { id, count: 0 } });
  };

  const tasbeeh = tasbeehItems[selectedTasbeeh];
  const tasbeehCount = state.tasbeehCounts[tasbeeh.id.toString()] || 0;

  const handleTasbeehTap = () => {
    dispatch({ type: 'UPDATE_TASBEEH', payload: { id: tasbeeh.id.toString(), count: tasbeehCount + 1 } });
  };

  const resetTasbeeh = () => {
    dispatch({ type: 'UPDATE_TASBEEH', payload: { id: tasbeeh.id.toString(), count: 0 } });
  };

  // Custom zikr handlers
  const handleAddCustomZikr = () => {
    if (!newZikrArabic.trim() && !newZikrTranslation.trim()) {
      setFormError('Please enter Arabic text or translation');
      return;
    }
    if (newZikrTarget < 1) {
      setFormError('Target must be at least 1');
      return;
    }
    const zikr: CustomZikr = {
      id: `custom_${Date.now()}`,
      arabic: newZikrArabic.trim(),
      translation: newZikrTranslation.trim(),
      target: newZikrTarget,
    };
    dispatch({ type: 'ADD_CUSTOM_ZIKR', payload: zikr });
    setNewZikrArabic('');
    setNewZikrTranslation('');
    setNewZikrTarget(33);
    setShowAddForm(false);
    setFormError('');
  };

  const handleCustomZikrTap = (id: string) => {
    const current = state.tasbeehCounts[id] || 0;
    dispatch({ type: 'UPDATE_TASBEEH', payload: { id, count: current + 1 } });
  };

  const handleCustomZikrReset = (id: string) => {
    dispatch({ type: 'UPDATE_TASBEEH', payload: { id, count: 0 } });
  };

  const handleDeleteCustomZikr = (id: string) => {
    dispatch({ type: 'DELETE_CUSTOM_ZIKR', payload: id });
    // Also clear count
    dispatch({ type: 'UPDATE_TASBEEH', payload: { id, count: 0 } });
  };

  const tabs = [
    { id: 'morning' as Tab, label: 'Morning', icon: Sun },
    { id: 'evening' as Tab, label: 'Evening', icon: Moon },
    { id: 'tasbeeh' as Tab, label: 'Tasbeeh', icon: Plus },
    { id: 'custom' as Tab, label: 'My Zikr', icon: Heart },
    { id: 'book' as Tab, label: 'Akhirat', icon: BookOpen },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
  ];

  const selectedBookChapter = selectedChapter !== null ? tuhfatulAkhirat.find(c => c.id === selectedChapter) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>📿 Azkar & Zikr</h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>Remember Allah throughout your day</p>
      </div>

      {/* Tabs */}
      <div className={`flex rounded-2xl p-1.5 overflow-x-auto ${state.darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[60px] flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                : state.darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Morning / Evening Azkar */}
      {(activeTab === 'morning' || activeTab === 'evening') && (
        <div className="space-y-4">
          {azkar.map(zikr => {
            const progress = state.azkarProgress[zikr.id] || 0;
            const completed = progress >= zikr.count;
            const percentage = Math.min((progress / zikr.count) * 100, 100);

            return (
              <div
                key={zikr.id}
                onClick={() => !completed && handleAzkarTap(zikr.id, zikr.count)}
                className={`rounded-2xl p-6 cursor-pointer transition-all ${
                  completed
                    ? state.darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
                    : state.darkMode ? 'bg-gray-900 border-gray-800 hover:border-emerald-700' : 'bg-white border-gray-100 hover:border-emerald-300 hover:shadow-md'
                } border`}
              >
                <p className="arabic-text text-2xl mb-4 text-center leading-loose" style={{ color: completed ? '#059669' : state.darkMode ? '#e5e7eb' : '#1f2937' }}>
                  {zikr.arabic}
                </p>
                <p className={`text-sm mb-4 text-center ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {zikr.translation}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-32 rounded-full ${state.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${completed ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className={`text-sm font-mono font-bold ${completed ? 'text-emerald-500' : state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {progress}/{zikr.count}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {completed && <span className="text-emerald-500 text-sm font-medium">✓ Done</span>}
                    <button
                      onClick={(e) => { e.stopPropagation(); resetAzkar(zikr.id); }}
                      className={`p-2 rounded-lg ${state.darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition`}
                    >
                      <RotateCcw size={14} className={state.darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tasbeeh Counter */}
      {activeTab === 'tasbeeh' && (
        <div className="space-y-6">
          {/* Tasbeeh Selector */}
          <div className="flex flex-wrap gap-2 justify-center">
            {tasbeehItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedTasbeeh(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedTasbeeh === idx
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : state.darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.translation.split('(')[0].trim()}
              </button>
            ))}
          </div>

          {/* Counter Display */}
          <div className={`rounded-3xl p-8 text-center ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
            <p className="arabic-text text-4xl mb-4" style={{ color: state.darkMode ? '#e5e7eb' : '#1f2937' }}>
              {tasbeeh.arabic}
            </p>
            <p className={`text-sm mb-8 ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {tasbeeh.translation}
            </p>

            {/* Circular Progress */}
            <div className="relative w-56 h-56 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke={state.darkMode ? '#1f2937' : '#f3f4f6'} strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke="#10b981" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - Math.min(tasbeehCount / tasbeeh.target, 1))}`}
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {tasbeehCount}
                </span>
                <span className={`text-sm ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  / {tasbeeh.target}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={resetTasbeeh}
                className={`p-4 rounded-2xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              >
                <RotateCcw size={24} className={state.darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>

              <button
                onClick={handleTasbeehTap}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center active:scale-95"
              >
                <Plus size={36} />
              </button>

              <button
                onClick={() => tasbeehCount > 0 && dispatch({ type: 'UPDATE_TASBEEH', payload: { id: tasbeeh.id.toString(), count: tasbeehCount - 1 } })}
                className={`p-4 rounded-2xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
              >
                <Minus size={24} className={state.darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>

            {tasbeehCount >= tasbeeh.target && (
              <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium animate-fadeIn">
                🎉 Masha'Allah! You completed your target!
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== CUSTOM ZIKR TAB ==================== */}
      {activeTab === 'custom' && (
        <div className="space-y-6">
          {/* Header */}
          <div className={`rounded-2xl p-6 text-center ${state.darkMode ? 'bg-gradient-to-br from-emerald-900/40 to-teal-900/40 border-emerald-800' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'} border`}>
            <Sparkles className="mx-auto mb-2 text-emerald-500" size={28} />
            <h3 className={`text-lg font-bold mb-1 ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>My Custom Zikr</h3>
            <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Apna zikr add karein aur counter se shumar karein
            </p>
          </div>

          {/* Add Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-emerald-400 text-emerald-600 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add New Zikr
            </button>
          )}

          {/* Add Form */}
          {showAddForm && (
            <div className={`rounded-2xl p-6 space-y-4 ${state.darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className={`font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>✨ Naya Zikr Add Karein</h4>
                <button onClick={() => { setShowAddForm(false); setFormError(''); }} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X size={18} className={state.darkMode ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>

              <div>
                <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Arabic Text (عربی متن)
                </label>
                <input
                  type="text"
                  value={newZikrArabic}
                  onChange={e => setNewZikrArabic(e.target.value)}
                  placeholder="مثلاً: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ"
                  dir="rtl"
                  className={`w-full p-3 rounded-xl text-lg arabic-text text-center ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Translation / Tarjuma
                </label>
                <input
                  type="text"
                  value={newZikrTranslation}
                  onChange={e => setNewZikrTranslation(e.target.value)}
                  placeholder="e.g., Glory be to Allah and praise Him"
                  className={`w-full p-3 rounded-xl ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Target Count (Kitni baar padhna hai)
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNewZikrTarget(Math.max(1, newZikrTarget - 1))}
                    className={`p-2 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    value={newZikrTarget}
                    onChange={e => setNewZikrTarget(Math.max(1, parseInt(e.target.value) || 1))}
                    className={`w-24 p-3 rounded-xl text-center font-bold text-lg ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'} border focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                  />
                  <button
                    onClick={() => setNewZikrTarget(newZikrTarget + 1)}
                    className={`p-2 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    <Plus size={16} />
                  </button>
                  {/* Quick presets */}
                  {[33, 100, 500].map(n => (
                    <button
                      key={n}
                      onClick={() => setNewZikrTarget(n)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${newZikrTarget === n ? 'bg-emerald-600 text-white' : state.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}

              <button
                onClick={handleAddCustomZikr}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold hover:from-emerald-600 hover:to-emerald-700 transition shadow-lg"
              >
                Save Zikr
              </button>
            </div>
          )}

          {/* Custom Zikr List */}
          {state.customZikr.length === 0 && !showAddForm && (
            <div className={`text-center py-12 ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Heart size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-1">Koi custom zikr nahi hai</p>
              <p className="text-sm">Upar button dabayein aur apna zikr add karein</p>
            </div>
          )}

          {state.customZikr.map(zikr => {
            const count = state.tasbeehCounts[zikr.id] || 0;
            const percentage = Math.min((count / zikr.target) * 100, 100);
            const completed = count >= zikr.target;

            return (
              <div
                key={zikr.id}
                className={`rounded-2xl overflow-hidden ${
                  completed
                    ? state.darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200'
                    : state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                } border transition-all`}
              >
                {/* Progress bar at top */}
                <div className={`h-1.5 ${state.darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div
                    className={`h-full transition-all duration-300 ${completed ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <div className="p-6">
                  {/* Arabic text */}
                  {zikr.arabic && (
                    <p className="arabic-text text-2xl mb-3 text-center leading-loose" style={{ color: completed ? '#059669' : state.darkMode ? '#e5e7eb' : '#1f2937' }}>
                      {zikr.arabic}
                    </p>
                  )}

                  {/* Translation */}
                  {zikr.translation && (
                    <p className={`text-sm mb-4 text-center ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {zikr.translation}
                    </p>
                  )}

                  {/* Counter + Controls */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <button
                      onClick={() => count > 0 && handleCustomZikrReset(zikr.id)}
                      className={`p-3 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                      title="Reset"
                    >
                      <RotateCcw size={18} className={state.darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </button>

                    <button
                      onClick={() => count > 0 && dispatch({ type: 'UPDATE_TASBEEH', payload: { id: zikr.id, count: count - 1 } })}
                      className={`p-3 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                    >
                      <Minus size={18} className={state.darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    </button>

                    {/* Big tap button */}
                    <button
                      onClick={() => handleCustomZikrTap(zikr.id)}
                      className={`w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-200 active:scale-95 ${
                        completed
                          ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white'
                          : 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white hover:scale-105'
                      }`}
                    >
                      <span className="text-xl font-bold">{count}</span>
                      <span className="text-[10px] opacity-80">/ {zikr.target}</span>
                    </button>

                    <button
                      onClick={() => handleCustomZikrTap(zikr.id)}
                      className={`p-3 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition`}
                    >
                      <Plus size={18} className="text-emerald-500" />
                    </button>

                    <button
                      onClick={() => handleDeleteCustomZikr(zikr.id)}
                      className={`p-3 rounded-xl ${state.darkMode ? 'bg-red-900/30 hover:bg-red-900/50' : 'bg-red-50 hover:bg-red-100'} transition`}
                      title="Delete"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>

                  {completed && (
                    <div className="text-center">
                      <span className="text-emerald-500 text-sm font-medium">🎉 Masha'Allah! Complete!</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ==================== TUHFAT UL AKHIRAT BOOK ==================== */}
      {activeTab === 'book' && (
        <div className="space-y-6">
          {/* Book Header */}
          <div className={`rounded-2xl p-6 text-center ${state.darkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'} border`}>
            <BookOpen className="mx-auto mb-2 text-amber-500" size={32} />
            <h3 className="arabic-text text-2xl mb-1" style={{ color: state.darkMode ? '#fbbf24' : '#92400e' }}>
              تُحْفَةُ الْآخِرَة
            </h3>
            <h4 className={`text-lg font-bold mb-1 ${state.darkMode ? 'text-amber-300' : 'text-amber-800'}`}>Tohfa-e-Akhirat</h4>
            <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Akhirat ki tayyari — Maut se lekar Jannat/Jahannam tak
            </p>
          </div>

          {selectedChapter === null ? (
            /* Chapter List */
            <div className="space-y-3">
              {tuhfatulAkhirat.map((chapter, idx) => (
                <button
                  key={chapter.id}
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={`w-full rounded-2xl p-5 text-left transition-all hover:scale-[1.01] ${
                    state.darkMode ? 'bg-gray-900 border-gray-800 hover:border-amber-700' : 'bg-white border-gray-100 hover:border-amber-300 hover:shadow-md'
                  } border flex items-center gap-4`}
                >
                  {/* Chapter number */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${
                    state.darkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="arabic-text text-lg mb-0.5" style={{ color: state.darkMode ? '#fbbf24' : '#92400e' }}>
                      {chapter.titleArabic}
                    </p>
                    <p className={`font-semibold text-sm ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {chapter.titleUrdu} — {chapter.titleEnglish}
                    </p>
                  </div>

                  <ChevronRight size={20} className={state.darkMode ? 'text-gray-600' : 'text-gray-400'} />
                </button>
              ))}
            </div>
          ) : (
            /* Chapter Content */
            <div className="space-y-4">
              {/* Back button */}
              <button
                onClick={() => setSelectedChapter(null)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl ${state.darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition font-medium`}
              >
                <ChevronLeft size={18} />
                Previous Chapters
              </button>

              {selectedBookChapter && (
                <div className={`rounded-2xl overflow-hidden ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
                  {/* Chapter Header */}
                  <div className={`p-6 text-center ${state.darkMode ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}>
                    <p className="arabic-text text-2xl mb-2" style={{ color: state.darkMode ? '#fbbf24' : '#92400e' }}>
                      {selectedBookChapter.titleArabic}
                    </p>
                    <h3 className={`text-xl font-bold ${state.darkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                      {selectedBookChapter.titleUrdu}
                    </h3>
                    <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {selectedBookChapter.titleEnglish}
                    </p>
                  </div>

                  {/* Hadith */}
                  {selectedBookChapter.hadith && (
                    <div className={`mx-6 mt-6 p-4 rounded-xl text-center ${state.darkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'} border`}>
                      <p className="arabic-text text-xl mb-2 leading-relaxed" style={{ color: '#059669' }}>
                        {selectedBookChapter.hadith}
                      </p>
                      {selectedBookChapter.hadithSource && (
                        <p className={`text-xs ${state.darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          📚 {selectedBookChapter.hadithSource}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {selectedBookChapter.content.map((para, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl ${state.darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}
                      >
                        <div className="flex gap-3">
                          <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            state.darkMode ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <p className={`text-sm leading-relaxed ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`} style={{ whiteSpace: 'pre-line' }}>
                            {para}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation */}
                  <div className="p-6 pt-0 flex gap-3">
                    {selectedBookChapter.id > 1 && (
                      <button
                        onClick={() => setSelectedChapter(selectedBookChapter.id - 1)}
                        className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${
                          state.darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                        } transition`}
                      >
                        <ChevronLeft size={16} /> Previous
                      </button>
                    )}
                    {selectedBookChapter.id < tuhfatulAkhirat.length && (
                      <button
                        onClick={() => setSelectedChapter(selectedBookChapter.id + 1)}
                        className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 transition"
                      >
                        Next <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Islamic Calendar */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <div className={`rounded-2xl p-6 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
            <h3 className={`text-lg font-semibold mb-6 text-center ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Hijri Calendar Months
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hijriMonths.map((month, idx) => {
                const isRamadan = idx === 8;
                const isDhulHijjah = idx === 11;
                return (
                  <div
                    key={month}
                    className={`p-4 rounded-xl text-center transition-all ${
                      isRamadan
                        ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : isDhulHijjah
                          ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg'
                          : state.darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <p className={`text-xs mb-1 ${isRamadan || isDhulHijjah ? 'text-white/70' : state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Month {idx + 1}
                    </p>
                    <p className={`font-semibold ${isRamadan || isDhulHijjah ? 'text-white' : state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {month}
                    </p>
                    {isRamadan && <p className="text-xs mt-1 text-emerald-100">🌙 Month of Fasting</p>}
                    {isDhulHijjah && <p className="text-xs mt-1 text-yellow-100">🕋 Month of Hajj</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
