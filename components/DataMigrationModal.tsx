'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Modal from './Modal';
import {
  migrateLocalStorageToSupabase,
  hasLocalStorageData,
  clearLocalStorageData,
} from '@/lib/dataMigration';

export default function DataMigrationModal() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);
  const [migrationResult, setMigrationResult] = useState<{
    expenseCount: number;
    budgetCount: number;
    recurringCount: number;
    errors: string[];
  } | null>(null);

  useEffect(() => {
    // Check if user just logged in and has local storage data
    if (user && hasLocalStorageData()) {
      // Check if user has already been prompted (use a flag in localStorage)
      const migrationPrompted = localStorage.getItem('migration-prompted');
      if (!migrationPrompted) {
        setShowModal(true);
        localStorage.setItem('migration-prompted', 'true');
      }
    }
  }, [user]);

  const handleMigrate = async () => {
    if (!user) return;

    setMigrating(true);

    try {
      const result = await migrateLocalStorageToSupabase(user.id);
      setMigrationResult(result);
      setMigrationComplete(true);

      if (result.success) {
        // Clear localStorage after successful migration
        clearLocalStorageData();
      }
    } catch (error) {
      console.error('Migration failed:', error);
      setMigrationResult({
        expenseCount: 0,
        budgetCount: 0,
        recurringCount: 0,
        errors: ['Migration failed. Please try again.'],
      });
      setMigrationComplete(true);
    } finally {
      setMigrating(false);
    }
  };

  const handleSkip = () => {
    setShowModal(false);
    // Clear the flag so they can manually trigger migration later if needed
    localStorage.removeItem('migration-prompted');
  };

  const handleClose = () => {
    setShowModal(false);
    setMigrationComplete(false);
    setMigrationResult(null);
  };

  if (!showModal) return null;

  return (
    <Modal isOpen={showModal} onClose={handleClose} title="Migrate Your Data">
      <div className="space-y-4">
        {!migrationComplete ? (
          <>
            {/* Migration Prompt */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-1">
                    Local Data Detected
                  </h3>
                  <p className="text-sm text-blue-800">
                    We found expense data saved on your browser. Would you like to sync it to your cloud account?
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-700 text-sm">
                <strong>What will be migrated:</strong>
              </p>
              <ul className="text-sm text-slate-600 space-y-1 ml-4 list-disc">
                <li>All your expenses</li>
                <li>Budget settings</li>
                <li>Recurring expenses</li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-xs text-slate-600">
                <strong>Note:</strong> This will copy your local data to Supabase. Your browser data will be cleared after successful migration.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleMigrate}
                disabled={migrating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {migrating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Migrating...
                  </span>
                ) : (
                  'Migrate Data'
                )}
              </button>
              <button
                onClick={handleSkip}
                disabled={migrating}
                className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Migration Result */}
            {migrationResult && migrationResult.errors.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-green-900 mb-2">
                      Migration Successful!
                    </h3>
                    <div className="text-sm text-green-800 space-y-1">
                      <p>✓ {migrationResult.expenseCount} expenses migrated</p>
                      <p>✓ {migrationResult.budgetCount} budgets migrated</p>
                      <p>✓ {migrationResult.recurringCount} recurring expenses migrated</p>
                    </div>
                    <p className="text-sm text-green-700 mt-3">
                      Your data is now safely stored in the cloud and synced across all your devices!
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-red-900 mb-2">
                      Migration Had Issues
                    </h3>
                    {migrationResult && (
                      <>
                        <div className="text-sm text-red-800 space-y-1 mb-3">
                          <p>✓ {migrationResult.expenseCount} expenses migrated</p>
                          <p>✓ {migrationResult.budgetCount} budgets migrated</p>
                          <p>✓ {migrationResult.recurringCount} recurring expenses migrated</p>
                        </div>
                        {migrationResult.errors.length > 0 && (
                          <div className="bg-red-100 rounded p-2 text-xs text-red-700">
                            <strong>Errors:</strong>
                            <ul className="mt-1 space-y-1 ml-4 list-disc">
                              {migrationResult.errors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleClose}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
