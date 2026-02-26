import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  User, Mail, Calendar, Bell, BellOff, Moon, Sun, Shield, TrendingUp,
  BookOpen, CheckCircle2, Heart, Download, AlertTriangle,
  HardDrive, Info, Trash2, RefreshCw, FileDown, FileUp, CheckCircle
} from 'lucide-react';

export default function ProfilePage() {
  const { state, dispatch } = useApp();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(state.user?.name || '');
  const [email, setEmail] = useState(state.user?.email || '');
  const [backupMsg, setBackupMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PROFILE', payload: { name, email } });
    setEditing(false);
  };

  // Stats
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const totalPrayerDays = state.prayerLogs.length;
  const totalPrayersDone = state.prayerLogs.reduce(
    (acc, log) => acc + Object.values(log.prayers).filter(Boolean).length, 0
  );
  const totalBookmarks = state.bookmarks.length;

  // Weekly prayer
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });
  const weeklyPrayers = last7Days.map(date => {
    const log = state.prayerLogs.find(l => l.date === date);
    return log ? Object.values(log.prayers).filter(Boolean).length : 0;
  }).reverse();
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const today = new Date().getDay();
  const reorderedLabels = Array.from({ length: 7 }, (_, i) => dayLabels[(today - 6 + i + 7) % 7]);

  // ========== BACKUP / RESTORE ==========

  const handleExportData = () => {
    try {
      const userId = state.user?.id;
      if (!userId) return;

      // Gather all user data
      const backupData = {
        _noor_backup: true,
        _version: 1,
        _exportedAt: new Date().toISOString(),
        _userName: state.user?.name,
        _userEmail: state.user?.email,
        user: state.user,
        tasks: state.tasks,
        bookmarks: state.bookmarks,
        prayerLogs: state.prayerLogs,
        lastReadSurah: state.lastReadSurah,
        lastReadAyah: state.lastReadAyah,
        tasbeehCounts: state.tasbeehCounts,
        azkarProgress: state.azkarProgress,
        location: state.location,
        notifications: state.notifications,
        darkMode: state.darkMode,
      };

      const jsonStr = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `noor-backup-${state.user?.name?.replace(/\s+/g, '-') || 'user'}-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupMsg({ type: 'success', text: '✅ Backup downloaded successfully! Keep this file safe.' });
      setTimeout(() => setBackupMsg(null), 5000);
    } catch {
      setBackupMsg({ type: 'error', text: '❌ Failed to export data. Please try again.' });
      setTimeout(() => setBackupMsg(null), 5000);
    }
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        // Validate backup file
        if (!data._noor_backup) {
          setBackupMsg({ type: 'error', text: '❌ Invalid backup file! This is not a Noor backup.' });
          setTimeout(() => setBackupMsg(null), 5000);
          return;
        }

        // Restore each piece of data
        if (data.tasks && Array.isArray(data.tasks)) {
          data.tasks.forEach((task: any) => {
            // Only add if not already present
            const exists = state.tasks.find(t => t.id === task.id);
            if (!exists) {
              dispatch({ type: 'ADD_TASK', payload: task });
            }
          });
        }

        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          data.bookmarks.forEach((bm: any) => {
            const exists = state.bookmarks.find(b => b.id === bm.id);
            if (!exists) {
              dispatch({ type: 'ADD_BOOKMARK', payload: bm });
            }
          });
        }

        if (data.prayerLogs && Array.isArray(data.prayerLogs)) {
          data.prayerLogs.forEach((log: any) => {
            Object.entries(log.prayers).forEach(([prayer, done]) => {
              if (done) {
                dispatch({
                  type: 'LOG_PRAYER',
                  payload: { date: log.date, prayer: prayer as any, done: true }
                });
              }
            });
          });
        }

        if (data.lastReadSurah && data.lastReadAyah) {
          dispatch({ type: 'SET_LAST_READ', payload: { surah: data.lastReadSurah, ayah: data.lastReadAyah } });
        }

        if (data.location) {
          dispatch({ type: 'SET_LOCATION', payload: data.location });
        }

        setBackupMsg({ type: 'success', text: `✅ Data restored successfully from backup (${data._exportedAt ? new Date(data._exportedAt).toLocaleDateString() : 'unknown date'})!` });
        setTimeout(() => setBackupMsg(null), 5000);
      } catch {
        setBackupMsg({ type: 'error', text: '❌ Corrupted backup file! Cannot restore.' });
        setTimeout(() => setBackupMsg(null), 5000);
      }
    };
    reader.readAsText(file);

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAllData = () => {
    // Clear tasks
    state.tasks.forEach(t => dispatch({ type: 'DELETE_TASK', payload: t.id }));
    // Clear bookmarks
    state.bookmarks.forEach(b => dispatch({ type: 'REMOVE_BOOKMARK', payload: b.id }));
    setShowDeleteConfirm(false);
    setBackupMsg({ type: 'success', text: '🗑️ Tasks and bookmarks cleared. Prayer logs are preserved.' });
    setTimeout(() => setBackupMsg(null), 5000);
  };

  // Calculate storage usage
  const getStorageSize = () => {
    let total = 0;
    for (const key in localStorage) {
      if (key.startsWith('noor_')) {
        total += (localStorage.getItem(key)?.length || 0) * 2; // UTF-16
      }
    }
    if (total < 1024) return `${total} B`;
    if (total < 1024 * 1024) return `${(total / 1024).toFixed(1)} KB`;
    return `${(total / (1024 * 1024)).toFixed(1)} MB`;
  };

  const dm = state.darkMode;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>👤 Profile</h1>
        <p className={dm ? 'text-gray-400' : 'text-gray-500'}>Manage your account, backup data & track progress</p>
      </div>

      {/* Profile Card */}
      <div className={`rounded-2xl p-8 text-center ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
        <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-emerald-200 mb-4">
          {state.user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        {editing ? (
          <div className="space-y-4 max-w-sm mx-auto">
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${dm ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              placeholder="Full Name"
            />
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${dm ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              placeholder="Email"
            />
            <div className="flex gap-2 justify-center">
              <button onClick={() => setEditing(false)} className={`px-4 py-2 rounded-xl ${dm ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium">Save</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>{state.user?.name}</h2>
            <p className={`${dm ? 'text-gray-400' : 'text-gray-500'} flex items-center justify-center gap-2 mt-1`}>
              <Mail size={14} /> {state.user?.email}
            </p>
            <p className={`text-sm ${dm ? 'text-gray-500' : 'text-gray-400'} flex items-center justify-center gap-2 mt-1`}>
              <Calendar size={14} /> Joined {state.user?.joinedAt ? new Date(state.user.joinedAt).toLocaleDateString() : 'N/A'}
            </p>
            <button onClick={() => setEditing(true)} className="mt-4 px-6 py-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition text-sm font-medium">
              Edit Profile
            </button>
          </>
        )}
      </div>

      {/* ===== DATA STORAGE INFO ===== */}
      <div className={`rounded-2xl p-6 border ${dm ? 'bg-amber-950/30 border-amber-800/50' : 'bg-amber-50 border-amber-200'}`}>
        <h3 className={`font-semibold flex items-center gap-2 mb-4 ${dm ? 'text-amber-300' : 'text-amber-800'}`}>
          <Info size={18} />
          📱 Data Storage Information
        </h3>

        <div className="space-y-3">
          <div className={`flex items-start gap-3 p-3 rounded-xl ${dm ? 'bg-gray-900/50' : 'bg-white'}`}>
            <HardDrive size={18} className={`mt-0.5 flex-shrink-0 ${dm ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`font-medium text-sm ${dm ? 'text-gray-200' : 'text-gray-800'}`}>Where is your data stored?</p>
              <p className={`text-xs mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
                Your data is saved in your <strong>browser's localStorage</strong> on this device. Current usage: <strong>{getStorageSize()}</strong>
              </p>
            </div>
          </div>

          <div className={`flex items-start gap-3 p-3 rounded-xl ${dm ? 'bg-red-950/30' : 'bg-red-50'}`}>
            <AlertTriangle size={18} className={`mt-0.5 flex-shrink-0 ${dm ? 'text-red-400' : 'text-red-500'}`} />
            <div>
              <p className={`font-medium text-sm ${dm ? 'text-red-300' : 'text-red-700'}`}>⚠️ When data will be LOST:</p>
              <ul className={`text-xs mt-1 space-y-1 ${dm ? 'text-red-300/70' : 'text-red-600'}`}>
                <li>• Browser cache / cookies / data clear karein</li>
                <li>• "Clear browsing data" use karein</li>
                <li>• Incognito / Private mode mein use karein</li>
                <li>• Different browser ya device par login karein</li>
                <li>• Browser uninstall karein</li>
              </ul>
            </div>
          </div>

          <div className={`flex items-start gap-3 p-3 rounded-xl ${dm ? 'bg-emerald-950/30' : 'bg-emerald-50'}`}>
            <CheckCircle size={18} className={`mt-0.5 flex-shrink-0 ${dm ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <div>
              <p className={`font-medium text-sm ${dm ? 'text-emerald-300' : 'text-emerald-700'}`}>✅ When data is SAFE:</p>
              <ul className={`text-xs mt-1 space-y-1 ${dm ? 'text-emerald-300/70' : 'text-emerald-600'}`}>
                <li>• Same browser mein normally use karein — data safe hai</li>
                <li>• Browser band karein aur dobara kholein — data safe hai</li>
                <li>• Computer restart karein — data safe hai</li>
                <li>• Logout karein aur wapas login karein — data safe hai ✅</li>
              </ul>
            </div>
          </div>

          <div className={`flex items-start gap-3 p-3 rounded-xl ${dm ? 'bg-blue-950/30' : 'bg-blue-50'}`}>
            <Download size={18} className={`mt-0.5 flex-shrink-0 ${dm ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <p className={`font-medium text-sm ${dm ? 'text-blue-300' : 'text-blue-700'}`}>💡 Best Practice:</p>
              <p className={`text-xs mt-1 ${dm ? 'text-blue-300/70' : 'text-blue-600'}`}>
                Har hafte <strong>Backup Download</strong> karein neeche diye gaye button se. Agar data delete ho jaye to backup file se wapas restore kar sakte hain!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== BACKUP & RESTORE ===== */}
      <div className={`rounded-2xl p-6 border ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <h3 className={`font-semibold flex items-center gap-2 mb-6 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
          <RefreshCw size={18} className="text-emerald-500" />
          🔄 Backup & Restore
        </h3>

        {/* Backup Message */}
        {backupMsg && (
          <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${backupMsg.type === 'success'
            ? (dm ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-800' : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
            : (dm ? 'bg-red-950/50 text-red-300 border border-red-800' : 'bg-red-50 text-red-700 border border-red-200')
            }`}>
            {backupMsg.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Download Backup */}
          <button
            onClick={handleExportData}
            className={`p-5 rounded-xl border-2 border-dashed transition-all hover:scale-[1.02] text-left ${dm ? 'border-emerald-800 hover:border-emerald-600 hover:bg-emerald-950/30' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'}`}
          >
            <FileDown size={32} className="text-emerald-500 mb-3" />
            <p className={`font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>📥 Download Backup</p>
            <p className={`text-xs mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
              Apna sara data (tasks, bookmarks, Quran progress, prayer logs) ek JSON file mein download karein
            </p>
          </button>

          {/* Upload Restore */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-5 rounded-xl border-2 border-dashed transition-all hover:scale-[1.02] text-left ${dm ? 'border-blue-800 hover:border-blue-600 hover:bg-blue-950/30' : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'}`}
          >
            <FileUp size={32} className="text-blue-500 mb-3" />
            <p className={`font-semibold ${dm ? 'text-white' : 'text-gray-900'}`}>📤 Restore from Backup</p>
            <p className={`text-xs mt-1 ${dm ? 'text-gray-400' : 'text-gray-500'}`}>
              Pehle se download ki hui backup file upload karein aur apna data wapas laaein
            </p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportData}
            className="hidden"
          />
        </div>

        {/* Last backup info */}
        <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 ${dm ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
          <Info size={14} />
          Tip: Backup file ko Google Drive, WhatsApp ya Email mein save karein taa ke kabhi bhi restore kar sakein
        </div>
      </div>

      {/* ===== DANGER ZONE ===== */}
      <div className={`rounded-2xl p-6 border ${dm ? 'bg-gray-900 border-red-900/50' : 'bg-white border-red-100'}`}>
        <h3 className={`font-semibold flex items-center gap-2 mb-4 ${dm ? 'text-red-400' : 'text-red-600'}`}>
          <AlertTriangle size={18} />
          ⚠️ Danger Zone
        </h3>

        {showDeleteConfirm ? (
          <div className={`p-4 rounded-xl ${dm ? 'bg-red-950/30 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
            <p className={`text-sm font-medium mb-3 ${dm ? 'text-red-300' : 'text-red-700'}`}>
              Kya aap sure hain? Yeh tasks aur bookmarks delete kar dega. Prayer logs safe rahenge. 
              <br />
              <strong>Pehle backup download kar lein!</strong>
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-lg text-sm ${dm ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleClearAllData}
                className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition"
              >
                Haan, Delete Karein
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition ${dm ? 'bg-red-950/30 text-red-400 hover:bg-red-950/50 border border-red-900' : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'}`}
          >
            <Trash2 size={16} />
            Clear Tasks & Bookmarks Data
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: CheckCircle2, label: 'Tasks Done', value: `${completedTasks}/${totalTasks}`, color: 'text-emerald-500' },
          { icon: TrendingUp, label: 'Prayer Days', value: totalPrayerDays.toString(), color: 'text-blue-500' },
          { icon: Heart, label: 'Total Prayers', value: totalPrayersDone.toString(), color: 'text-purple-500' },
          { icon: BookOpen, label: 'Bookmarks', value: totalBookmarks.toString(), color: 'text-amber-500' },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl p-5 text-center ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
            <s.icon size={24} className={`mx-auto mb-2 ${s.color}`} />
            <p className={`text-2xl font-bold ${dm ? 'text-white' : 'text-gray-900'}`}>{s.value}</p>
            <p className={`text-xs mt-1 ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly Prayer Chart */}
      <div className={`rounded-2xl p-6 ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
        <h3 className={`font-semibold mb-6 flex items-center gap-2 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
          <TrendingUp size={18} className="text-emerald-500" />
          Weekly Prayer Tracker
        </h3>
        <div className="flex items-end justify-between gap-2 h-32">
          {weeklyPrayers.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className={`text-xs font-mono ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{count}</span>
              <div className={`w-full rounded-t-lg ${dm ? 'bg-gray-800' : 'bg-gray-100'} relative`} style={{ height: '100px' }}>
                <div
                  className="absolute bottom-0 w-full rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400 transition-all duration-500"
                  style={{ height: `${(count / 5) * 100}%` }}
                />
              </div>
              <span className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{reorderedLabels[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className={`rounded-2xl p-6 space-y-4 ${dm ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
        <h3 className={`font-semibold flex items-center gap-2 ${dm ? 'text-gray-200' : 'text-gray-800'}`}>
          <Shield size={18} className="text-emerald-500" />
          Settings
        </h3>

        <div className="space-y-3">
          <div className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              {state.darkMode ? <Moon size={18} className="text-purple-400" /> : <Sun size={18} className="text-amber-500" />}
              <div>
                <p className={`font-medium ${dm ? 'text-gray-200' : 'text-gray-800'}`}>Appearance</p>
                <p className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{state.darkMode ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className={`w-12 h-7 rounded-full relative transition-colors ${state.darkMode ? 'bg-emerald-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${state.darkMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              {state.notifications ? <Bell size={18} className="text-emerald-500" /> : <BellOff size={18} className="text-gray-400" />}
              <div>
                <p className={`font-medium ${dm ? 'text-gray-200' : 'text-gray-800'}`}>Notifications</p>
                <p className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>{state.notifications ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
              className={`w-12 h-7 rounded-full relative transition-colors ${state.notifications ? 'bg-emerald-600' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${state.notifications ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>

          <div className={`flex items-center justify-between p-4 rounded-xl ${dm ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-3">
              <User size={18} className="text-blue-500" />
              <div>
                <p className={`font-medium ${dm ? 'text-gray-200' : 'text-gray-800'}`}>Account</p>
                <p className={`text-xs ${dm ? 'text-gray-500' : 'text-gray-400'}`}>Logged in as {state.user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
