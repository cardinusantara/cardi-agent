import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';

interface ActivateRequestBody {
  cardId?: string;
  businessName?: string;
  placeId?: string;
  reviewUrl?: string;
  pin?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ActivateRequestBody = await request.json();
    const { cardId, businessName, placeId, reviewUrl, pin } = body;

    // 1. Validasi kelengkapan data
    if (!cardId || !businessName || !placeId || !reviewUrl || !pin) {
      return NextResponse.json(
        {
          error:
            'Data tidak lengkap. cardId, businessName, placeId, reviewUrl, dan pin wajib diisi.',
        },
        { status: 400 }
      );
    }

    // 2. Validasi format PIN 4-digit
    const sanitizedPin = String(pin).trim();
    if (!/^\d{4}$/.test(sanitizedPin)) {
      return NextResponse.json(
        { error: 'PIN harus berupa 4 digit angka.' },
        { status: 400 }
      );
    }

    // 3. Verifikasi apakah kartu terdaftar di database
    const { data: existingCard, error: fetchError } = await supabase
      .from('cards')
      .select('card_id, is_active')
      .eq('card_id', cardId)
      .maybeSingle();

    if (fetchError) {
      console.error('Database fetch error:', fetchError);
      return NextResponse.json(
        { error: 'Terjadi kesalahan sistem saat memeriksa data kartu.' },
        { status: 500 }
      );
    }

    if (!existingCard) {
      return NextResponse.json(
        { error: 'Kode kartu tidak terdaftar.' },
        { status: 404 }
      );
    }

    // 4. Hash PIN menggunakan bcryptjs (salt 10)
    const saltRounds = 10;
    const hashedPin = await bcrypt.hash(sanitizedPin, saltRounds);

    // 5. Standarisasi URL review agar langsung memicu pop-up bintang & komentar Google Maps
    const cleanPlaceId = placeId ? placeId.trim() : '';
    const standardizedReviewUrl = cleanPlaceId
      ? `https://search.google.com/local/writereview?placeid=${cleanPlaceId}`
      : reviewUrl.trim();

    // 6. Update data kartu di Supabase
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
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { error: `Gagal memperbarui status kartu: ${updateError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Kartu berhasil diaktifkan.',
        data: {
          cardId,
          businessName,
          reviewUrl,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Activate API error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan internal pada server.' },
      { status: 500 }
    );
  }
}
