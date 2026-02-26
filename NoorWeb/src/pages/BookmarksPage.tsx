import { useApp } from '@/context/AppContext';
import { BookMarked, BookOpen, Heart, Calendar, Trash2, Clock } from 'lucide-react';

export default function BookmarksPage() {
  const { state, dispatch } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'quran': return <BookOpen size={18} className="text-purple-500" />;
      case 'zikr': return <Heart size={18} className="text-emerald-500" />;
      case 'schedule': return <Calendar size={18} className="text-blue-500" />;
      default: return <BookMarked size={18} className="text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quran': return state.darkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200';
      case 'zikr': return state.darkMode ? 'bg-emerald-900/30 border-emerald-800' : 'bg-emerald-50 border-emerald-200';
      case 'schedule': return state.darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200';
      default: return state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  const quranBookmarks = state.bookmarks.filter(b => b.type === 'quran');
  const zikrBookmarks = state.bookmarks.filter(b => b.type === 'zikr');
  const otherBookmarks = state.bookmarks.filter(b => b.type !== 'quran' && b.type !== 'zikr');

  const renderSection = (title: string, icon: React.ReactNode, bookmarks: typeof state.bookmarks) => {
    if (bookmarks.length === 0) return null;
    return (
      <div className="space-y-3">
        <h3 className={`flex items-center gap-2 font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {icon}
          {title} ({bookmarks.length})
        </h3>
        <div className="space-y-2">
          {bookmarks.map(b => (
            <div
              key={b.id}
              className={`rounded-xl p-4 flex items-center justify-between ${getTypeColor(b.type)} border transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                {getIcon(b.type)}
                <div>
                  <p className={`font-medium ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{b.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{b.reference}</span>
                    <Clock size={12} className={state.darkMode ? 'text-gray-600' : 'text-gray-300'} />
                    <span className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {new Date(b.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_BOOKMARK', payload: b.id })}
                className={`p-2 rounded-lg transition ${state.darkMode ? 'hover:bg-gray-700 text-gray-500' : 'hover:bg-red-100 text-gray-400 hover:text-red-500'}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>🔖 Bookmarks</h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>Your saved items and progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Quran', count: quranBookmarks.length, color: 'from-purple-500 to-purple-600' },
          { label: 'Azkar', count: zikrBookmarks.length, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Other', count: otherBookmarks.length, color: 'from-blue-500 to-blue-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 text-center ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
            <p className={`text-3xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>{s.count}</p>
            <p className={`text-sm mt-1 ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {state.bookmarks.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <p className="text-4xl mb-4">🔖</p>
          <p className={`font-medium ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No bookmarks yet</p>
          <p className={`text-sm ${state.darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Bookmark Quran ayahs and azkar to see them here</p>
        </div>
      ) : (
        <>
          {renderSection('Quran Bookmarks', <BookOpen size={18} className="text-purple-500" />, quranBookmarks)}
          {renderSection('Azkar Bookmarks', <Heart size={18} className="text-emerald-500" />, zikrBookmarks)}
          {renderSection('Other Bookmarks', <BookMarked size={18} className="text-blue-500" />, otherBookmarks)}
        </>
      )}
    </div>
  );
}
