'use client';

import React, { useState } from 'react';
import BusinessSearch, { SelectedBusiness } from '@/components/BusinessSearch';

interface ActivationFormProps {
  cardId: string;
}

export default function ActivationForm({ cardId }: ActivationFormProps) {
  const [selectedBusiness, setSelectedBusiness] = useState<SelectedBusiness | null>(null);
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSelectBusiness = (business: SelectedBusiness) => {
    setSelectedBusiness(business);
    setErrorMessage(null);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, ''); // Hanya terima digit angka
    if (rawVal.length <= 4) {
      setPin(rawVal);
      setErrorMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBusiness) {
      setErrorMessage('Silakan cari dan pilih tempat bisnis terlebih dahulu.');
      return;
    }

    if (pin.length !== 4) {
      setErrorMessage('PIN aktivasi harus terdiri dari 4 digit angka.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId,
          businessName: selectedBusiness.name,
          placeId: selectedBusiness.placeId,
          reviewUrl: selectedBusiness.reviewUrl,
          pin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengaktifkan kartu');
      }

      setIsSuccess(true);

      // Otomatis arahkan pengguna ke tautan Google Review bisnis yang baru diaktifkan
      const targetUrl = selectedBusiness.reviewUrl;
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 1200);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Terjadi kesalahan tidak terduga saat aktivasi.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilan Berhasil Diaktifkan
  if (isSuccess && selectedBusiness) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl dark:border-emerald-900/40 dark:bg-zinc-900 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60 dark:bg-emerald-950/60 dark:text-emerald-400 dark:ring-emerald-950/30">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h2 className="mt-5 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Kartu Berhasil Aktif!
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Kartu fisik dengan kode <strong className="font-bold text-zinc-900 dark:text-white">#{cardId}</strong> sekarang telah terhubung ke profil Google Maps bisnis Anda.
          </p>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400">
            <span className="inline-block h-2 w-2 animate-ping rounded-full bg-blue-500" />
            Mengarahkan ke halaman Google Review...
          </p>

          <div className="mt-6 w-full rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 text-left dark:border-zinc-800 dark:bg-zinc-800/50">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Bisnis Terhubung
            </div>
            <div className="mt-1 font-semibold text-zinc-900 dark:text-white">
              {selectedBusiness.name}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>Place ID:</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">
                {selectedBusiness.placeId.slice(0, 14)}...
              </span>
            </div>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3">
            <a
              href={selectedBusiness.reviewUrl}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]"
            >
              Buka Halaman Google Review Sekarang
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Form Aktivasi
  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/90 sm:p-8">
      {/* Header Form */}
      <div className="mb-6 flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Aktivasi Kartu
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Kode kartu: <strong className="font-bold text-zinc-900 dark:text-white">{cardId}</strong>. Isi semua kolom di bawah untuk mengaktifkan kartu.
        </p>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-300">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <span className="font-semibold">Gagal: </span>
            {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Step 1: Cari Bisnis */}
        <BusinessSearch
          onSelect={handleSelectBusiness}
          selectedBusinessName={selectedBusiness?.name}
          label="Nama Bisnis"
          placeholder="Ketik nama bisnis untuk cari otomatis"
        />

        {/* Preview Review URL jika bisnis sudah dipilih */}
        {selectedBusiness && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4 transition-all dark:border-blue-900/40 dark:bg-blue-950/20">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                ✓
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                Tempat Dipilih
              </span>
            </div>

            <div className="mt-2 text-sm font-semibold text-zinc-900 dark:text-white">
              {selectedBusiness.name}
            </div>

            <div className="mt-2.5">
              <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Tautan Google Review Otomatis:
              </span>
              <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white p-2 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <span className="truncate font-mono text-[11px]">
                  {selectedBusiness.reviewUrl}
                </span>
                <a
                  href={selectedBusiness.reviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  title="Buka link di tab baru untuk verifikasi"
                >
                  Buka
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Buat 4-Digit PIN */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="pin-input"
              className="text-sm font-semibold text-zinc-700 dark:text-zinc-200"
            >
              Buat PIN (4 Digit Angka)
            </label>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {pin.length}/4 digit
            </span>
          </div>

          <div className="relative">
            <input
              id="pin-input"
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={pin}
              onChange={handlePinChange}
              placeholder={showPin ? '1234' : '••••'}
              autoComplete="new-password"
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-12 pr-12 text-center font-mono text-2xl tracking-[0.5em] text-zinc-900 shadow-sm transition-all placeholder:tracking-widest placeholder:text-zinc-300 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-700 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 z-30 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPin(!showPin);
                }}
                aria-label={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                title={showPin ? 'Sembunyikan PIN' : 'Tampilkan PIN'}
                className="relative z-30 cursor-pointer hover:opacity-80 p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-opacity focus:outline-none"
              >
                {showPin ? (
                  /* Ikon mata dicoret saat PIN sedang terlihat */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  /* Ikon mata terbuka saat PIN tersembunyi */
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            PIN ini berguna untuk mengelola atau mengganti tujuan review kartu Anda nanti.
          </p>
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isLoading || !selectedBusiness || pin.length !== 4}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Mengaktifkan Kartu...</span>
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Aktifkan Kartu</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
