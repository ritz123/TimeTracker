import React, { useReducer, useEffect, useCallback, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Toolbar from './components/Toolbar';
import WeekCalendar from './components/WeekCalendar';
import MonthPicker from './components/MonthPicker';
import ItemForm from './components/ItemForm';
import ExportModal from './components/ExportModal';
import { loadData, saveData } from './utils/storage';
import { formatDateKey, weekOffsetForDate } from './utils/dates';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  items: [],
  weekOffset: 0,
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
    case 'PREV_WEEK':
      return { ...state, weekOffset: state.weekOffset - 1, editingItem: null, selectedDate: null };
    case 'NEXT_WEEK':
      return { ...state, weekOffset: state.weekOffset + 1, editingItem: null, selectedDate: null };
    case 'TODAY':
      return { ...state, weekOffset: 0, editingItem: null, selectedDate: null };
    case 'GO_TO_WEEK':
      return { ...state, weekOffset: action.payload, editingItem: null, selectedDate: null };
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

  useEffect(() => {
    loadData().then((items) => dispatch({ type: 'SET_ITEMS', payload: items }));
  }, []);

  useEffect(() => {
    if (state.loaded) {
      saveData(state.items);
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
    const offset = weekOffsetForDate(date);
    dispatch({ type: 'GO_TO_WEEK', payload: offset });
  }, []);

  if (showSplash) {
    return <SplashScreen onFinished={() => setShowSplash(false)} />;
  }

  if (!state.loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        <div className="text-indigo-400 text-sm font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40">
      <Toolbar
        weekOffset={state.weekOffset}
        onPrevWeek={() => dispatch({ type: 'PREV_WEEK' })}
        onNextWeek={() => dispatch({ type: 'NEXT_WEEK' })}
        onToday={() => dispatch({ type: 'TODAY' })}
        onExport={() => setShowExportModal(true)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <MonthPicker
          weekOffset={state.weekOffset}
          items={state.items}
          onDayClick={handleDayClick}
        />
        <WeekCalendar
          weekOffset={state.weekOffset}
          items={state.items}
          onAddItem={handleAddItem}
          onEditItem={handleEditItem}
          onDeleteItem={handleDeleteItem}
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
          weekOffset={state.weekOffset}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
}
