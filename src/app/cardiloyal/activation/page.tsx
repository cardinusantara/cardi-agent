import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aktivasi Kartu | Cardi Loyal Review',
  description: 'Silakan tempelkan (tap) kartu NFC atau scan kode QR pada kartu fisik Anda untuk memulai aktivasi.',
};

export default function ActivationIndexPage() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 via-slate-50 to-blue-50/40 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-600/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-600/10"
      />

      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50 text-blue-600 ring-8 ring-blue-50/60 dark:bg-blue-950/50 dark:text-blue-400 dark:ring-blue-950/30">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 8h4m-4 3h4"
            />
          </svg>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/60 dark:text-blue-300 dark:ring-blue-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          Cardi Loyal
        </div>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Aktivasi Kartu
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Silakan tempelkan (tap) kartu NFC atau scan kode QR pada kartu fisik Anda untuk memulai aktivasi.
        </p>

        <div className="mt-8 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-800/40">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Setiap kartu memiliki kode unik untuk dihubungkan dengan lokasi Google Maps bisnis Anda.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
