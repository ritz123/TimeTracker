import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { isSameDay } from 'date-fns';
import SplashScreen from './components/SplashScreen';
import Toolbar from './components/Toolbar';
import MonthCalendar from './components/MonthCalendar';
import DayDetailPanel from './components/DayDetailPanel';
import ItemForm from './components/ItemForm';
import ExportModal from './components/ExportModal';
import SettingsModal from './components/SettingsModal';
import { loadData, saveData, loadPrefs, savePrefs } from './utils/storage';
import { applyTheme, normalizeThemeId } from './theme';
import { formatDateKey, getItemsForDay } from './utils/dates';
import { APP_NAME, APP_VERSION, APP_COPYRIGHT, APP_LICENSE } from './utils/appInfo';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [],
  monthOffset: 0,
  editingItem: null,
  selectedDate: null,
  loaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loaded: true };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        editingItem: null,
        selectedDate: null,
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? action.payload : item
        ),
        editingItem: null,
        selectedDate: null,
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        editingItem: null,
        selectedDate: null,
      };
    case 'PREV_MONTH':
      return { ...state, monthOffset: state.monthOffset - 1, editingItem: null, selectedDate: null };
    case 'NEXT_MONTH':
      return { ...state, monthOffset: state.monthOffset + 1, editingItem: null, selectedDate: null };
    case 'TODAY':
      return { ...state, monthOffset: 0, editingItem: null, selectedDate: null };
    case 'START_ADD':
      return { ...state, editingItem: null, selectedDate: action.payload };
    case 'START_EDIT':
      return { ...state, editingItem: action.payload, selectedDate: null };
    case 'CANCEL_FORM':
      return { ...state, editingItem: null, selectedDate: null };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showSplash, setShowSplash] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [pinnedDate, setPinnedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [theme, setTheme] = useState(() => normalizeThemeId(undefined));

  const displayDate = pinnedDate || hoveredDate || new Date();
  const displayItems = getItemsForDay(state.items, displayDate);

  useEffect(() => {
    (async () => {
      const prefs = await loadPrefs();
      const t = normalizeThemeId(prefs.theme);
      setTheme(t);
      applyTheme(t);
      try {
        const items = await loadData();
        dispatch({ type: 'SET_ITEMS', payload: items });
      } catch {
        dispatch({ type: 'SET_ITEMS', payload: [] });
      }
    })();
  }, []);

  const handleThemeChange = useCallback(async (nextId) => {
    const t = normalizeThemeId(nextId);
    setTheme(t);
    applyTheme(t);
    const prefs = await loadPrefs();
    await savePrefs({ ...prefs, theme: t });
  }, []);

  // Save whenever items change
  useEffect(() => {
    if (state.loaded) {
      saveData(state.items).catch(() => {});
    }
  }, [state.items, state.loaded]);

  const handleAddItem = useCallback((date) => {
    dispatch({ type: 'START_ADD', payload: date });
  }, []);

  const handleEditItem = useCallback((item) => {
    dispatch({ type: 'START_EDIT', payload: item });
  }, []);

  const handleDeleteItem = useCallback((id) => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  }, []);

  const handleSave = useCallback(
    (formData) => {
      if (state.editingItem) {
        dispatch({
          type: 'UPDATE_ITEM',
          payload: {
            ...state.editingItem,
            ...formData,
            updatedAt: new Date().toISOString(),
          },
        });
      } else if (state.selectedDate) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            id: uuidv4(),
            date: formatDateKey(state.selectedDate),
            ...formData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }
    },
    [state.editingItem, state.selectedDate]
  );

  const handleDayClick = useCallback((date) => {
    setPinnedDate((prev) => (prev && isSameDay(prev, date) ? null : date));
  }, []);

  const handleDayHover = useCallback((date) => {
    setHoveredDate(date);
  }, []);

  const handleTogglePin = useCallback(() => {
    if (pinnedDate) {
      setPinnedDate(null);
    } else {
      setPinnedDate(displayDate);
    }
  }, [pinnedDate, displayDate]);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  if (!state.loaded) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundImage: 'var(--gradient-page)' }}
      >
        <div className="text-sm font-medium" style={{ color: 'var(--accent-muted)' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{ backgroundImage: 'var(--gradient-page)' }}>
      <Toolbar
        monthOffset={state.monthOffset}
        theme={theme}
        onThemeChange={handleThemeChange}
        onPrevMonth={() => dispatch({ type: 'PREV_MONTH' })}
        onNextMonth={() => dispatch({ type: 'NEXT_MONTH' })}
        onToday={() => dispatch({ type: 'TODAY' })}
        onExport={() => setShowExportModal(true)}
        onSettings={() => setShowSettings(true)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <MonthCalendar
          monthOffset={state.monthOffset}
          items={state.items}
          focusedDate={pinnedDate}
          hoveredDate={hoveredDate}
          onDayClick={handleDayClick}
          onDayHover={handleDayHover}
        />
        <DayDetailPanel
          date={displayDate}
          items={displayItems}
          isPinned={!!pinnedDate}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onAdd={handleAddItem}
          onPin={handleTogglePin}
        />
      </div>

      <ItemForm
        editingItem={state.editingItem}
        selectedDate={state.selectedDate}
        onSave={handleSave}
        onCancel={() => dispatch({ type: 'CANCEL_FORM' })}
      />

      {showExportModal && (
        <ExportModal
          items={state.items}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Copyright footer */}
      <div
        className="flex items-center justify-between px-6 py-1.5 border-t text-[10px]"
        style={{
          backgroundColor: 'var(--footer-bg)',
          borderColor: 'var(--border)',
          color: 'var(--footer-text)',
        }}
      >
        <span>{APP_COPYRIGHT} &middot; {APP_LICENSE}</span>
        <span>{APP_NAME} v{APP_VERSION}</span>
      </div>

      {showSettings && (
        <SettingsModal
          theme={theme}
          onThemeChange={handleThemeChange}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
