export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { supabase, Card } from '@/lib/supabase';
import ActivationForm from './ActivationForm';

interface PageProps {
  params: Promise<{ card_id?: string; cardId?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ card_id?: string; cardId?: string }>;
}): Promise<Metadata> {
  const { card_id, cardId } = await params;
  const id = (card_id || cardId || '').trim();
  return {
    title: `Aktivasi Kartu #${id} | Cardi Loyal Review`,
    description: `Aktivasi dan integrasi Google Maps Review untuk kartu #${id}`,
  };
}

export default async function CardActivationPage({
  params,
  searchParams,
}: PageProps) {
  // Ambil parameter card_id dari URL dinamis
  const { card_id, cardId: paramCardId } = await params;
  const rawCardId = card_id || paramCardId || '';
  const cardId = decodeURIComponent(rawCardId).trim();

  const resolvedSearchParams = await searchParams;
  const isManage = resolvedSearchParams.manage === 'true';

  console.log(
    `[Supabase Query] Mengambil data kartu dengan card_id: "${cardId}" dari tabel 'cards'...`
  );

  // Lakukan query ke Supabase pada tabel 'cards' berdasarkan 'card_id'
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('card_id', cardId)
    .maybeSingle();

  // Kondisi 1: Kartu tidak ditemukan / tidak terdaftar
  if (error || !data) {
    if (error) {
      console.error(`[Supabase Query Error] cardId: "${cardId}":`, error);
    }
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 sm:p-6">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-8 ring-rose-50/60 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-950/30">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="mt-5 inline-block rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            ID: #{cardId || 'UNKNOWN'}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Kartu Tidak Terdaftar
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Kartu dengan nomor identifikasi ini tidak ditemukan di database. Pastikan kode URL kartu sesuai atau hubungi admin Cardi Loyal.
          </p>
        </div>
      </main>
    );
  }

  const card = data as Card;
  const reviewUrl = card.review_url || card.google_review_url;

  // Kondisi 2: is_active === true dan review_url / google_review_url terisi
  // Lakukan auto-redirect langsung menggunakan redirect() dari 'next/navigation' (kecuali mode kelola ?manage=true)
  if (card.is_active && reviewUrl && !isManage) {
    console.log(`[Auto-Redirect] Kartu "${cardId}" aktif, mengalihkan langsung ke: ${reviewUrl}`);
    redirect(reviewUrl);
  }

  // Jika kartu aktif namun review_url belum terisi dan bukan mode manage
  if (card.is_active && !reviewUrl && !isManage) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950 sm:p-6">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-amber-200 bg-white p-8 text-center shadow-xl dark:border-amber-900/40 dark:bg-zinc-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 ring-8 ring-amber-50/60 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-950/30">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="mt-5 inline-block rounded-full bg-zinc-100 px-3 py-1 font-mono text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
            ID: #{cardId}
          </div>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Tautan Ulasan Belum Siap
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Kartu ini telah aktif namun link Google Review belum tersimpan dengan lengkap.
          </p>

          <a
            href={`/cardiloyal/activation/${cardId}?manage=true`}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
          >
            Atur Ulang Profil Bisnis
          </a>
        </div>
      </main>
    );
  }

  // Kondisi 3: is_active === false (atau mode manage=true): Tampilkan ActivationForm
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

      <div className="relative z-10 w-full flex justify-center">
        <ActivationForm cardId={cardId} />
      </div>
    </main>
  );
}
