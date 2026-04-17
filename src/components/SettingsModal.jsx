import React, { useState, useEffect } from 'react';
import { googleAuthStatus, googleSignIn, googleSignOut, googleUserInfo } from '../utils/storage';

const isElectron = typeof window !== 'undefined' && window.api;

export default function SettingsModal({ storageMode, onStorageModeChange, onSyncFromGoogle, onClose }) {
  const [authStatus, setAuthStatus] = useState({ isConfigured: false, isAuthenticated: false });
  const [user, setUser] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isElectron) return;
    (async () => {
      const status = await googleAuthStatus();
      setAuthStatus(status);
      if (status.isAuthenticated) {
        const info = await googleUserInfo();
        setUser(info);
      }
    })();
  }, []);

  async function handleSignIn() {
    setError(null);
    setSigningIn(true);
    try {
      const info = await googleSignIn();
      setUser(info);
      const status = await googleAuthStatus();
      setAuthStatus(status);
    } catch (err) {
      if (err.message !== 'Auth window closed') {
        setError(err.message || 'Sign-in failed');
      }
    } finally {
      setSigningIn(false);
    }
  }

  async function handleSignOut() {
    await googleSignOut();
    setUser(null);
    setAuthStatus((s) => ({ ...s, isAuthenticated: false }));
    if (storageMode === 'google') {
      onStorageModeChange('local');
    }
  }

  async function handleSignInAndSwitch() {
    setError(null);
    setSigningIn(true);
    try {
      const info = await googleSignIn();
      setUser(info);
      const status = await googleAuthStatus();
      setAuthStatus(status);
      if (status.isAuthenticated) {
        onStorageModeChange('google');
        onSyncFromGoogle();
      }
    } catch (err) {
      if (err.message !== 'Auth window closed') {
        setError(err.message || 'Sign-in failed');
      }
    } finally {
      setSigningIn(false);
    }
  }

  function handleModeSwitch(mode) {
    setError(null);
    if (mode === 'google') {
      if (!authStatus.isConfigured) {
        setError('Google Drive is not available in this build.');
        return;
      }
      if (!authStatus.isAuthenticated) {
        handleSignInAndSwitch();
        return;
      }
      onStorageModeChange('google');
      onSyncFromGoogle();
    } else {
      onStorageModeChange('local');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[480px] max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/50">
          <h2 className="text-lg font-bold text-slate-800">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <p className="text-sm text-slate-500">Choose where your data is stored.</p>

          {/* Local */}
          <button
            onClick={() => handleModeSwitch('local')}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              storageMode === 'local'
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                storageMode === 'local' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-400'
              }`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">Local Storage</h3>
                <p className="text-xs text-slate-400 mt-0.5">Data stored on this computer only</p>
              </div>
              {storageMode === 'local' && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Active</span>
              )}
            </div>
          </button>

          {/* Google Drive */}
          <button
            onClick={() => handleModeSwitch('google')}
            disabled={signingIn}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              storageMode === 'google'
                ? 'border-indigo-500 bg-indigo-50/50'
                : 'border-slate-200 hover:border-slate-300'
            } disabled:opacity-60`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                storageMode === 'google' ? 'bg-indigo-500 text-white' : 'bg-slate-100'
              }`}>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-800">Google Drive</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {signingIn
                    ? 'Signing in...'
                    : authStatus.isAuthenticated
                      ? `Synced as ${user?.email || 'Google User'}`
                      : 'Sign in with your Google account'}
                </p>
              </div>
              {storageMode === 'google' && (
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">Active</span>
              )}
            </div>
          </button>

          {/* Signed-in user card */}
          {authStatus.isAuthenticated && user && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
              {user.picture && (
                <img src={user.picture} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-800 truncate">{user.name}</p>
                <p className="text-xs text-green-600 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
              >
                Sign Out
              </button>
            </div>
          )}

          {!isElectron && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-700">
              Google Drive sync is only available in the desktop (Electron) app.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
