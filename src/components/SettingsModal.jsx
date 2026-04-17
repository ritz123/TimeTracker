import React, { useState, useEffect } from 'react';
import { googleAuthStatus, googleSignIn, googleSignOut, googleUserInfo } from '../utils/storage';
import {
  APP_NAME, APP_VERSION, APP_TAGLINE, APP_DESCRIPTION,
  APP_LICENSE, APP_LICENSE_URL, APP_CONTACT_EMAIL, APP_REPO_URL, APP_COPYRIGHT,
} from '../utils/appInfo';

const isElectron = typeof window !== 'undefined' && window.api;

const TABS = [
  { id: 'storage', label: 'Storage' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function SettingsModal({ storageMode, onStorageModeChange, onSyncFromGoogle, onClose }) {
  const [activeTab, setActiveTab] = useState('storage');
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
      <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col overflow-hidden">
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

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ── Storage tab ── */}
          {activeTab === 'storage' && (
            <div className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                  {error}
                </div>
              )}

              <p className="text-sm text-slate-500">Choose where your data is stored.</p>

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
          )}

          {/* ── About tab ── */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 mb-4 shadow-lg shadow-indigo-200">
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">{APP_NAME}</h3>
                <p className="text-sm text-slate-400 mt-1">{APP_TAGLINE}</p>
                <span className="inline-block mt-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  Version {APP_VERSION}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm text-slate-600 leading-relaxed">{APP_DESCRIPTION}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">License</h4>
                <p className="text-sm text-slate-700 font-medium">{APP_LICENSE}</p>
                <p className="text-xs text-slate-400 mt-1">
                  This program is free software; you can redistribute it and/or modify it under
                  the terms of the GNU General Public License as published by the Free Software
                  Foundation; either version 2 of the License, or (at your option) any later version.
                </p>
                <a
                  href={APP_LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Read full license text →
                </a>
              </div>

              <div className="text-center text-xs text-slate-400 pt-2">
                {APP_COPYRIGHT}
              </div>
            </div>
          )}

          {/* ── Contact tab ── */}
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <p className="text-sm text-slate-500">Get in touch or report issues.</p>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Email</h4>
                    <a
                      href={`mailto:${APP_CONTACT_EMAIL}`}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      {APP_CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">GitHub</h4>
                    <a
                      href={APP_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Source Code & Issues
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                <h4 className="text-sm font-bold text-indigo-800 mb-1">Found a bug?</h4>
                <p className="text-xs text-indigo-600 leading-relaxed">
                  Please open an issue on GitHub with steps to reproduce. Feature requests
                  and pull requests are also welcome!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
