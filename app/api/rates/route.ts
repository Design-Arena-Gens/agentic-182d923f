import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const base = searchParams.get('base') || 'INR';
  try {
    const res = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json({ base, rates: data.rates || {} }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ base, rates: {} }, { status: 200 });
  }
}
