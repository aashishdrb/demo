import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pincode = searchParams.get('pincode');

    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return NextResponse.json({ error: 'Invalid pincode format. Must be 6 digits.' }, { status: 400 });
    }

    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);

    if (!res.ok) {
      throw new Error(`Postal API responded with status ${res.status}`);
    }

    const data = await res.json();
    
    if (data && data[0] && data[0].Status === 'Success') {
      const postOffices = data[0].PostOffice;
      if (postOffices && postOffices.length > 0) {
        // Extract state, district, and all cities (post office names)
        const state = postOffices[0].State;
        const district = postOffices[0].District;
        const cities = Array.from(new Set(postOffices.map((po: any) => po.Name))) as string[];

        return NextResponse.json({
          success: true,
          state,
          district,
          cities
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Pincode not found in Indian Postal database.'
    });
  } catch (err) {
    console.error('Pincode validation API error:', err);
    // On network failure or API down, we return success: true with offlineFallback flag
    // to prevent blocking checkout when the government API is offline.
    return NextResponse.json({
      success: true,
      offlineFallback: true,
      message: 'Postal database offline. Local validation applied.'
    });
  }
}
