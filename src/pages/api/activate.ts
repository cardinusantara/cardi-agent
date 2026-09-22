import type { APIRoute } from 'astro';
import bcrypt from 'bcryptjs';
import { supabase } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { cardId, businessName, placeId, reviewUrl, pin } = body;

    if (!cardId || !businessName || !placeId || !reviewUrl || !pin) {
      return new Response(
        JSON.stringify({ error: 'Data tidak lengkap. cardId, businessName, placeId, reviewUrl, dan pin wajib diisi.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedPin = String(pin).trim();
    if (!/^\d{4}$/.test(sanitizedPin)) {
      return new Response(
        JSON.stringify({ error: 'PIN harus berupa 4 digit angka.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { data: existingCard, error: fetchError } = await supabase
      .from('cards')
      .select('card_id, is_active')
      .eq('card_id', cardId)
      .maybeSingle();

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: 'Terjadi kesalahan sistem saat memeriksa data kartu.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!existingCard) {
      return new Response(
        JSON.stringify({ error: 'Kode kartu tidak terdaftar.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(sanitizedPin, saltRounds);

    const cleanPlaceId = placeId ? placeId.trim() : '';
    const standardizedReviewUrl = cleanPlaceId
      ? `https://search.google.com/local/writereview?placeid=${cleanPlaceId}`
      : reviewUrl.trim();

    const { error: updateError } = await supabase
      .from('cards')
      .update({
        business_name: businessName.trim(),
        place_id: cleanPlaceId,
        review_url: standardizedReviewUrl,
        pin_hash: hashedPin,
        is_active: true,
        updated_at: new Date().toISOString(),
      })
      .eq('card_id', cardId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: `Gagal memperbarui status kartu: ${updateError.message}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Kartu berhasil diaktifkan.',
        data: { cardId, businessName, reviewUrl },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan internal pada server.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
