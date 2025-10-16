'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-12">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform">
              {/* Savings Pig Icon - Simplified for better rendering */}
              <svg className="w-14 h-14 text-white" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="30" r="16" fill="currentColor" fillOpacity="0.9"/>
                <circle cx="28" cy="28" r="2" fill="white"/>
                <circle cx="36" cy="28" r="2" fill="white"/>
                <ellipse cx="32" cy="34" rx="4" ry="2" fill="white" fillOpacity="0.7"/>
                <rect x="28" y="44" width="3" height="8" rx="1.5" fill="currentColor"/>
                <rect x="33" y="44" width="3" height="8" rx="1.5" fill="currentColor"/>
                <path d="M48 30 Q52 28 54 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome to Monetly
          </h1>
          <p className="text-slate-600 text-lg font-medium">
            Your smart expense tracker
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 text-center">
            Sign in to continue
          </h2>
          <p className="text-slate-600 text-base text-center mb-8 leading-relaxed">
            Track your expenses, manage budgets, and achieve your financial goals
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base py-4 px-6 rounded-xl border-2 border-slate-300 hover:border-indigo-400 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mb-8"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-semibold">Continue with Google</span>
              </>
            )}
          </button>

          {/* Features List */}
          <div className="pt-6 border-t-2 border-slate-100">
            <p className="text-slate-700 text-sm font-semibold mb-4 text-center">
              What you&apos;ll get:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-slate-700 text-sm font-medium">Track expenses across all devices</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-slate-700 text-sm font-medium">Secure cloud backup of your data</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                </svg>
                <span className="text-slate-700 text-sm font-medium">Smart budgets and spending insights</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer - More Prominent */}
        <div className="mt-8 text-center">
          <p className="text-slate-600 text-sm font-medium leading-relaxed px-4">
            By signing in, you agree to our{' '}
            <span className="text-indigo-600 font-semibold">Terms of Service</span>
            {' '}and{' '}
            <span className="text-indigo-600 font-semibold">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
