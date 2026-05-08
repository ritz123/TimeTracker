import React, { useState } from 'react';
import {
  APP_NAME, APP_VERSION, APP_TAGLINE, APP_DESCRIPTION,
  APP_LICENSE, APP_LICENSE_URL, APP_CONTACT_EMAIL, APP_REPO_URL, APP_COPYRIGHT,
} from '../utils/appInfo';
import { THEME_OPTIONS } from '../theme';

const TABS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'storage', label: 'Storage' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function SettingsModal({ theme, onThemeChange, onClose }) {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'var(--modal-backdrop)' }}>
      <div
        className="rounded-2xl shadow-2xl w-[500px] max-h-[85vh] flex flex-col overflow-hidden border"
        style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--border)' }}
      >
        <div
          className="flex items-center justify-between px-6 py-4 border-b"
          style={{
            borderColor: 'var(--border)',
            backgroundImage: 'var(--gradient-modal-header)',
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface-elevated)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b px-6 overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap hover:opacity-90"
              style={{
                borderBottomColor: activeTab === tab.id ? 'var(--modal-tab-active-border)' : 'transparent',
                color: activeTab === tab.id ? 'var(--modal-tab-active-text)' : 'var(--modal-tab-inactive)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'appearance' && (
            <div className="space-y-3">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Choose a color theme for the app. Your choice is saved on this device.
              </p>
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onThemeChange(opt.id)}
                  className="w-full text-left p-4 rounded-xl border-2 transition-all"
                  style={{
                    borderColor: theme === opt.id ? 'var(--modal-tab-active-border)' : 'var(--border)',
                    backgroundColor: theme === opt.id ? 'var(--modal-storage-bg)' : 'transparent',
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                        {opt.label}
                      </h3>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        {opt.description}
                      </p>
                    </div>
                    {theme === opt.id && (
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: 'var(--modal-badge-text)', backgroundColor: 'var(--modal-badge-bg)' }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-5">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Your entries are stored on this device only.
              </p>

              <div
                className="w-full text-left p-4 rounded-xl border-2"
                style={{
                  borderColor: 'var(--modal-storage-border)',
                  backgroundColor: 'var(--modal-storage-bg)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                      Local storage
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      In the desktop app, data lives under your home directory in{' '}
                      <code
                        className="text-[11px] px-1 rounded"
                        style={{ backgroundColor: 'var(--surface)', color: 'var(--text)' }}
                      >
                        .weekly-tracker/
                      </code>
                      . In the browser build, data stays in this browser&apos;s storage.
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: 'var(--modal-badge-text)', backgroundColor: 'var(--modal-badge-bg)' }}
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{
                    backgroundImage: 'var(--gradient-about-icon)',
                    boxShadow: 'var(--shadow-about-icon)',
                  }}
                >
                  <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
                    <path d="M12 6v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
                  {APP_NAME}
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {APP_TAGLINE}
                </p>
                <span
                  className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ color: 'var(--modal-tab-active-text)', backgroundColor: 'var(--modal-badge-bg)' }}
                >
                  Version {APP_VERSION}
                </span>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {APP_DESCRIPTION}
                </p>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}>
                  License
                </h4>
                <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                  {APP_LICENSE}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>
                  This program is free software; you can redistribute it and/or modify it under
                  the terms of the GNU General Public License as published by the Free Software
                  Foundation; either version 2 of the License, or (at your option) any later version.
                </p>
                <a
                  href={APP_LICENSE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-semibold transition-colors"
                  style={{ color: 'var(--text-link)' }}
                >
                  Read full license text →
                </a>
              </div>

              <div className="text-center text-xs pt-2" style={{ color: 'var(--text-faint)' }}>
                {APP_COPYRIGHT}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-5">
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Get in touch or report issues.
              </p>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--modal-icon-email-bg)', color: 'var(--modal-icon-email-fg)' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                      Email
                    </h4>
                    <a
                      href={`mailto:${APP_CONTACT_EMAIL}`}
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-link)' }}
                    >
                      {APP_CONTACT_EMAIL}
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--surface-muted)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: 'var(--surface-elevated)', color: 'var(--text-muted)' }}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--text)' }}>
                      GitHub
                    </h4>
                    <a
                      href={APP_REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm transition-colors"
                      style={{ color: 'var(--text-link)' }}
                    >
                      Source Code & Issues
                    </a>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'var(--modal-callout-bg)',
                  borderColor: 'var(--modal-callout-border)',
                }}
              >
                <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--modal-callout-title)' }}>
                  Found a bug?
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--modal-callout-text)' }}>
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
