'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SecuritySettings() {
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Data & Security
        </h2>
        <p className="text-sm text-slate-600 mt-2">
          Your financial data is protected with enterprise-grade security
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Encryption Badge */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-2 border-emerald-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
              🔒
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">End-to-End Encryption</h3>
              <p className="text-sm text-slate-600 mt-1">
                All data is encrypted at rest and in transit using industry-standard SSL/TLS protocols
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Assurance */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
              🛡️
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Privacy First</h3>
              <p className="text-sm text-slate-600 mt-1">
                We never share or sell your financial data. Your expenses stay private, always.
              </p>
            </div>
          </div>
        </div>

        {/* Secure Backup */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
              ☁️
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Secure Cloud Backup</h3>
              <p className="text-sm text-slate-600 mt-1">
                Powered by Supabase with automatic backups and 99.9% uptime SLA
              </p>
              <p className="text-xs text-slate-500 mt-2">
                Last synced: <span className="font-semibold">Just now</span>
              </p>
            </div>
          </div>
        </div>

        {/* Authentication */}
        <div className="bg-white/95 backdrop-blur-sm p-6 border-2 border-orange-200 shadow-xl hover:shadow-2xl transition-all">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl flex-shrink-0 shadow-lg">
              🔑
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Google OAuth</h3>
              <p className="text-sm text-slate-600 mt-1">
                Secure authentication via Google - no passwords to remember
              </p>
              {user && (
                <p className="text-xs text-slate-500 mt-2">
                  Signed in as: <span className="font-semibold">{user.email}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Details */}
      <div className="bg-white/95 backdrop-blur-sm p-6 shadow-xl border-2 border-slate-200">
        <h3 className="font-bold text-xl text-slate-900 mb-4">Security Measures</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl flex-shrink-0">✓</span>
            <div>
              <p className="font-semibold text-slate-900">Row-Level Security (RLS)</p>
              <p className="text-sm text-slate-600">Database policies ensure you can only access your own data</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl flex-shrink-0">✓</span>
            <div>
              <p className="font-semibold text-slate-900">Rate Limiting</p>
              <p className="text-sm text-slate-600">Protection against spam and abuse with intelligent throttling</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl flex-shrink-0">✓</span>
            <div>
              <p className="font-semibold text-slate-900">Input Sanitization</p>
              <p className="text-sm text-slate-600">All data is validated and sanitized to prevent injection attacks</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600 text-xl flex-shrink-0">✓</span>
            <div>
              <p className="font-semibold text-slate-900">Content Security Policy (CSP)</p>
              <p className="text-sm text-slate-600">Advanced headers protect against XSS and code injection</p>
            </div>
          </li>
        </ul>
      </div>

      {/* Account Actions */}
      <div className="bg-white/95 backdrop-blur-sm p-6 shadow-xl border-2 border-slate-200">
        <h3 className="font-bold text-xl text-slate-900 mb-4">Account Management</h3>
        <div className="space-y-3">
          <button
            onClick={() => signOut()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white font-bold
                     hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg hover:shadow-xl
                     transform hover:scale-105"
          >
            Sign Out
          </button>
          <p className="text-xs text-slate-500">
            Need help? Contact support at{' '}
            <a href="mailto:support@monetly.app" className="text-[var(--color-primary-accent)] hover:underline font-semibold">
              support@monetly.app
            </a>
          </p>
        </div>
      </div>

      {/* Compliance & Privacy Policy */}
      <div className="bg-slate-50 p-6 border border-slate-200 text-center">
        <p className="text-sm text-slate-600">
          By using Monetly, you agree to our{' '}
          <button className="text-[var(--color-primary-accent)] hover:underline font-semibold">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-[var(--color-primary-accent)] hover:underline font-semibold">
            Privacy Policy
          </button>
        </p>
        <p className="text-xs text-slate-500 mt-2">
          Monetly is compliant with GDPR and CCPA regulations
        </p>
      </div>
    </div>
  );
}
