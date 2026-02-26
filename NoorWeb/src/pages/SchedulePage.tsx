import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Plus, Trash2, CheckCircle2, Circle, Zap, Filter, CalendarPlus } from 'lucide-react';

type Category = 'prayer' | 'work' | 'personal' | 'islamic' | 'other';

const categories: { id: Category; label: string; color: string; icon: string }[] = [
  { id: 'prayer', label: 'Prayer', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '🕌' },
  { id: 'islamic', label: 'Islamic', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📿' },
  { id: 'work', label: 'Work', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '💼' },
  { id: 'personal', label: 'Personal', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '👤' },
  { id: 'other', label: 'Other', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: '📌' },
];

interface AiTip {
  icon: string;
  tip: string;
  taskTitle: string;
  suggestedTime: string;
  suggestedCategory: Category;
}

const aiTips: AiTip[] = [
  { icon: '🌅', tip: 'Schedule important tasks after Fajr — studies show early mornings boost focus by 40%.', taskTitle: 'Deep focus work after Fajr', suggestedTime: '05:30', suggestedCategory: 'work' },
  { icon: '📖', tip: 'Read Quran for 15 minutes after Fajr. Small consistent actions are most beloved to Allah.', taskTitle: 'Read Quran (15 min)', suggestedTime: '06:00', suggestedCategory: 'islamic' },
  { icon: '📿', tip: 'Complete your Morning Azkar after Fajr prayer for spiritual protection throughout the day.', taskTitle: 'Morning Azkar', suggestedTime: '06:15', suggestedCategory: 'islamic' },
  { icon: '🧠', tip: 'Take breaks during Dhuhr-Asr gap. Use this for lunch and light physical activity.', taskTitle: 'Lunch break & light exercise', suggestedTime: '13:00', suggestedCategory: 'personal' },
  { icon: '🤲', tip: "Make dua before Maghrib — it's one of the accepted times for supplication.", taskTitle: 'Dua before Maghrib', suggestedTime: '17:30', suggestedCategory: 'islamic' },
  { icon: '📝', tip: 'Review your day before Isha. Plan tomorrow for better productivity.', taskTitle: 'Daily review & plan tomorrow', suggestedTime: '20:00', suggestedCategory: 'personal' },
  { icon: '😴', tip: 'Sleep early after Isha prayer. Follow the Sunnah sleep schedule for optimal health.', taskTitle: 'Sleep early (Sunnah routine)', suggestedTime: '22:00', suggestedCategory: 'personal' },
  { icon: '🕌', tip: 'Set reminders for all 5 daily prayers. Consistency in salah is the foundation of a productive Muslim life.', taskTitle: 'Pray all 5 salah on time', suggestedTime: '05:00', suggestedCategory: 'prayer' },
];

export default function SchedulePage() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Category>('other');
  const [filterCat, setFilterCat] = useState<Category | 'all'>('all');
  const [showTips, setShowTips] = useState(false);
  const [addedTips, setAddedTips] = useState<Set<number>>(new Set());
  const [formError, setFormError] = useState('');

  const handleAdd = () => {
    setFormError('');
    if (!title.trim()) {
      setFormError('Please enter a task title.');
      return;
    }
    if (!time) {
      setFormError('Please select a time for the task.');
      return;
    }
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now().toString(),
        title: title.trim(),
        time,
        date,
        completed: false,
        category,
      },
    });
    setTitle('');
    setTime('');
    setCategory('other');
    setFormError('');
    setShowForm(false);
  };

  const handleAddFromTip = (tip: AiTip, index: number) => {
    dispatch({
      type: 'ADD_TASK',
      payload: {
        id: Date.now().toString() + '_' + index,
        title: tip.taskTitle,
        time: tip.suggestedTime,
        date,
        completed: false,
        category: tip.suggestedCategory,
      },
    });
    setAddedTips(prev => new Set(prev).add(index));
  };

  const handleApplyToForm = (tip: AiTip) => {
    setTitle(tip.taskTitle);
    setTime(tip.suggestedTime);
    setCategory(tip.suggestedCategory);
    setShowForm(true);
    setShowTips(false);
    setFormError('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  const filteredTasks = state.tasks
    .filter(t => t.date === date)
    .filter(t => filterCat === 'all' || t.category === filterCat)
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedCount = filteredTasks.filter(t => t.completed).length;
  const totalCount = filteredTasks.length;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>📅 Schedule Planner</h1>
        <p className={state.darkMode ? 'text-gray-400' : 'text-gray-500'}>Plan your day with Islamic productivity</p>
      </div>

      {/* Date & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={`px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
        />
        <div className="flex gap-2">
          <button
            onClick={() => { setShowTips(!showTips); setAddedTips(new Set()); }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${showTips ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
          >
            <Zap size={16} />
            AI Tips
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setFormError(''); }}
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition text-sm font-medium"
          >
            <Plus size={16} />
            Add Task
          </button>
        </div>
      </div>

      {/* AI Tips - Now with actionable buttons */}
      {showTips && (
        <div className={`rounded-2xl p-6 space-y-4 animate-fadeIn ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'} border`}>
          <h3 className={`font-semibold flex items-center gap-2 ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <Zap size={18} className="text-amber-500" />
            AI Productivity Recommendations
          </h3>
          <p className={`text-sm ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Click "Add to Schedule" to instantly add a suggestion as a task, or "Customize" to edit before adding.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {aiTips.map((tip, i) => {
              const isAdded = addedTips.has(i);
              return (
                <div key={i} className={`p-4 rounded-xl ${state.darkMode ? 'bg-gray-800' : 'bg-white'} flex flex-col gap-3 transition-all ${isAdded ? 'ring-2 ring-emerald-400' : ''}`}>
                  <div className="flex items-start gap-3">
                    <span className="text-xl shrink-0">{tip.icon}</span>
                    <p className={`text-sm ${state.darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{tip.tip}</p>
                  </div>
                  <div className={`text-xs ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    Suggested: {tip.suggestedTime} • {categories.find(c => c.id === tip.suggestedCategory)?.icon} {categories.find(c => c.id === tip.suggestedCategory)?.label}
                  </div>
                  <div className="flex gap-2">
                    {isAdded ? (
                      <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                        <CheckCircle2 size={16} />
                        Added to schedule!
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleAddFromTip(tip, i)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition"
                        >
                          <CalendarPlus size={14} />
                          Add to Schedule
                        </button>
                        <button
                          onClick={() => handleApplyToForm(tip)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${state.darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          Customize
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className={`rounded-2xl p-6 space-y-4 animate-fadeIn ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
          <h3 className={`font-semibold ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            ✏️ New Task
          </h3>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-fadeIn">
              {formError}
            </div>
          )}

          <div>
            <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setFormError(''); }}
              onKeyDown={handleKeyPress}
              placeholder="e.g., Read Quran, Morning exercise..."
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'border-gray-200'}`}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
              <input
                type="time"
                value={time}
                onChange={e => { setTime(e.target.value); setFormError(''); }}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`text-sm font-medium mb-1 block ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className={`w-full px-4 py-3 rounded-xl border outline-none ${state.darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'border-gray-200'}`}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              onClick={() => { setShowForm(false); setFormError(''); setTitle(''); setTime(''); }}
              className={`px-4 py-2.5 rounded-xl ${state.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} transition`}
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              Add Task
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {totalCount > 0 && (
        <div className={`rounded-2xl p-5 ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-100'} border`}>
          <div className="flex justify-between mb-2">
            <span className={`text-sm font-medium ${state.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Progress</span>
            <span className="text-sm font-bold text-emerald-600">{completedCount}/{totalCount}</span>
          </div>
          <div className={`h-3 rounded-full ${state.darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter size={16} className={state.darkMode ? 'text-gray-500' : 'text-gray-400'} />
        <button
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
            filterCat === 'all'
              ? 'bg-emerald-600 text-white'
              : state.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All
        </button>
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filterCat === c.id
                ? 'bg-emerald-600 text-white'
                : state.darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl ${state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border`}>
            <p className="text-4xl mb-4">📋</p>
            <p className={`font-medium ${state.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No tasks for this day</p>
            <p className={`text-sm mt-1 ${state.darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              Click "Add Task" or use "AI Tips" to get started
            </p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const cat = categories.find(c => c.id === task.category);
            return (
              <div
                key={task.id}
                className={`rounded-2xl p-5 flex items-center gap-4 transition-all ${
                  task.completed
                    ? state.darkMode ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-100'
                    : state.darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                } border`}
              >
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                  className="shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 size={24} className="text-emerald-500" />
                  ) : (
                    <Circle size={24} className={state.darkMode ? 'text-gray-600' : 'text-gray-300'} />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium ${task.completed ? 'line-through opacity-50' : ''} ${state.darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-mono ${state.darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{task.time}</span>
                    {cat && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${cat.color}`}>
                        {cat.icon} {cat.label}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                  className={`p-2 rounded-xl shrink-0 transition ${state.darkMode ? 'hover:bg-gray-800 text-gray-600' : 'hover:bg-red-50 text-gray-400 hover:text-red-500'}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
