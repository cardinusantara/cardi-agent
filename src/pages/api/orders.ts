import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import type { OrderLead } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const {
      customerName,
      customerPhone,
      shippingAddress,
      googleMapsUrl,
      notes,
      productName = 'Plakat Akrilik Google Review NFC',
      productPrice = 69000,
    } = body;

    // Validasi field wajib
    if (!customerName || !customerPhone || !shippingAddress || !googleMapsUrl) {
      return new Response(
        JSON.stringify({
          error: 'Nama lengkap, nomor WhatsApp, alamat pengiriman, dan link Google Maps wajib diisi.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const orderRecord: OrderLead = {
      customer_name: String(customerName).trim(),
      customer_phone: String(customerPhone).trim(),
      shipping_address: String(shippingAddress).trim(),
      google_maps_url: String(googleMapsUrl).trim(),
      notes: notes ? String(notes).trim() : null,
      product_name: String(productName).trim(),
      product_price: Number(productPrice) || 69000,
      status: 'pending_payment',
      created_at: new Date().toISOString(),
    };

    let supabaseSaved = false;
    let savedData: any = null;

    // Upayakan penyimpanan ke Supabase jika konfigurasi tersedia
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderRecord])
        .select();

      if (error) {
        // Coba simpan ke tabel leads jika tabel orders belum ada
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .insert([orderRecord])
          .select();

        if (leadError) {
          console.warn('[Orders API] Supabase leads & orders warning:', leadError.message);
        } else {
          supabaseSaved = true;
          savedData = leadData;
        }
      } else {
        supabaseSaved = true;
        savedData = data;
      }
    } catch (sbErr) {
      console.warn('[Orders API] Supabase connection error:', sbErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Data pemesan berhasil dicatat.',
        data: orderRecord,
        savedToSupabase: supabaseSaved,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('[Orders API] Error handling order submission:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan internal server saat memproses data pesanan.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
