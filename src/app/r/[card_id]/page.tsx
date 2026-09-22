export const dynamic = 'force-dynamic';

import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ card_id?: string; cardId?: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function LegacyCardRedirectPage({
  params,
  searchParams,
}: PageProps) {
  const { card_id, cardId: paramCardId } = await params;
  const rawCardId = card_id || paramCardId || '';
  const cardId = decodeURIComponent(rawCardId).trim();

  const resolvedSearchParams = await searchParams;
  const queryString = resolvedSearchParams.manage === 'true' ? '?manage=true' : '';

  redirect(`/cardiloyal/activation/${cardId}${queryString}`);
}
