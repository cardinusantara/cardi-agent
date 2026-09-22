'use client';

import React, { useState } from 'react';

interface PublicReviewCardProps {
  cardId: string;
  businessName: string;
  googleReviewUrl: string;
  placeId?: string | null;
}

export default function PublicReviewCard({
  cardId,
  businessName,
  googleReviewUrl,
}: PublicReviewCardProps) {
  const [hasReviewed, setHasReviewed] = useState<boolean>(false);
  const [hoveredStar, setHoveredStar] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(5);

  const handleReviewClick = () => {
    // Ubah tampilan di tab saat ini menjadi halaman 'Terima Kasih'
    setHasReviewed(true);
  };

  // Tampilan Halaman "Terima Kasih" setelah menekan tombol Beri Ulasan
  if (hasReviewed) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-100/80 bg-white/95 p-6 text-center shadow-2xl shadow-blue-500/10 backdrop-blur-xl transition-all dark:border-zinc-800/80 dark:bg-zinc-900/95 sm:p-8">
        {/* Ikon Perayaan / Sukses */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400/20 duration-1000" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
            <svg
              className="h-8 w-8 animate-bounce"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Badge Google Review Terbuka */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Tab Google Review Terbuka
        </div>

        {/* Judul & Pesan Terima Kasih */}
        <h1 className="mt-4 text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Terima Kasih Banyak!
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          Ulasan bintang dan masukan Anda untuk{' '}
          <strong className="font-bold text-zinc-900 dark:text-white">
            {businessName}
          </strong>{' '}
          sangat berarti bagi kami dalam memberikan pelayanan yang semakin prima.
        </p>

        {/* Kotak Informasi Bintang Pilihan */}
        <div className="mt-6 rounded-2xl border border-zinc-100 bg-gradient-to-b from-zinc-50 to-white p-4 shadow-sm dark:border-zinc-800 dark:from-zinc-800/60 dark:to-zinc-900/60">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`h-5 w-5 ${
                  star <= selectedRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Selesaikan komentar dan bintang Anda di jendela ulasan Google yang baru terbuka.
          </p>
        </div>

        {/* Tombol Aksi Tambahan */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98]"
          >
            <span>Buka Ulang Google Review</span>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>

          <button
            type="button"
            onClick={() => setHasReviewed(false)}
            className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-xs font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            Kembali ke Halaman Kartu
          </button>
        </div>

        {/* Footer info kartu */}
        <div className="mt-6 text-[11px] font-mono text-zinc-400 dark:text-zinc-600">
          ID Kartu: #{cardId}
        </div>
      </div>
    );
  }

  // Tampilan Halaman Publik Utama (Sebelum Menekan "Beri Ulasan")
  return (
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-100/80 bg-white/95 p-6 text-center shadow-2xl shadow-blue-500/10 backdrop-blur-xl transition-all dark:border-zinc-800/80 dark:bg-zinc-900/95 sm:p-8">
      {/* Header Badge */}
      <div className="flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-950/50 dark:text-blue-300 dark:ring-blue-400/20">
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          Google Maps Review
        </span>
      </div>

      {/* Avatar / Logo Brand Bisnis */}
      <div className="mt-5 flex flex-col items-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 text-3xl font-extrabold text-white shadow-xl shadow-blue-500/20 ring-4 ring-white dark:ring-zinc-800">
          {businessName.charAt(0).toUpperCase()}
          <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md dark:bg-zinc-800">
            {/* Google "G" Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.57.38-2.27V6.58H1.25A11.96 11.96 0 0 0 0 12c0 1.92.45 3.74 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>
        </div>

        {/* Nama Bisnis */}
        <h1 className="mt-4 text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          {businessName}
        </h1>

        {/* Deskripsi Singkat */}
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Bantu usaha kami berkembang dengan memberikan ulasan dan pengalaman terbaik Anda di Google Maps.
        </p>
      </div>

      {/* Pilihan Bintang Interaktif */}
      <div className="mt-6 rounded-2xl border border-zinc-100 bg-zinc-50/80 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Pilih Bintang Ulasan
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = star <= (hoveredStar || selectedRating);
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedRating(star)}
                className="group p-1 transition-transform hover:scale-125 focus:outline-none"
                title={`Beri ${star} Bintang`}
              >
                <svg
                  className={`h-8 w-8 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                      : 'fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            );
          })}
        </div>

        <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
          {selectedRating === 5 ? '⭐⭐⭐⭐⭐ Pengalaman Luar Biasa!' : `${selectedRating} Bintang Terpilih`}
        </p>
      </div>

      {/* Tombol Utama: 'Beri Ulasan' */}
      <div className="mt-6 flex flex-col gap-3">
        <a
          href={googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleReviewClick}
          className="group relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:shadow-2xl hover:shadow-blue-500/35 focus:outline-none focus:ring-4 focus:ring-blue-500/20 active:scale-[0.98]"
        >
          {/* Efek kilau halus */}
          <div className="pointer-events-none absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[100%]" />

          {/* Ikon Edit / Ulasan */}
          <svg
            className="h-5 w-5 transition-transform group-hover:rotate-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>

          <span>Beri Ulasan</span>

          {/* Ikon Tab Baru */}
          <svg
            className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Membuka formulir bintang ulasan Google Maps di tab baru.
        </p>
      </div>

      {/* Footer ID Kartu & Opsi Pengaturan */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        <span className="font-mono">ID: #{cardId}</span>
        <a
          href={`/r/${cardId}?manage=true`}
          className="hover:text-zinc-700 dark:hover:text-zinc-300 underline underline-offset-2"
        >
          Kelola Kartu
        </a>
      </div>
    </div>
  );
}
