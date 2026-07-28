import { NextRequest, NextResponse } from 'next/server';
import { fetchApplicationsFirestore, fetchApplicationsForExportFirestore } from '@/lib/firebase-db'; // Use Firestore specific function

export async function GET(request: NextRequest) {
  try {
    const exportRequested = request.nextUrl.searchParams.get('export') === '1';
    const fromParameter = request.nextUrl.searchParams.get('from');
    const toParameter = request.nextUrl.searchParams.get('to');
    const fromTimestamp = fromParameter ? Number(fromParameter) : undefined;
    const toTimestamp = toParameter ? Number(toParameter) : undefined;

    if (
      (fromParameter && !Number.isFinite(fromTimestamp)) ||
      (toParameter && !Number.isFinite(toTimestamp)) ||
      (fromTimestamp !== undefined &&
        toTimestamp !== undefined &&
        fromTimestamp > toTimestamp)
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid export date range.' },
        { status: 400 },
      );
    }

    const result = exportRequested
      ? await fetchApplicationsForExportFirestore(fromTimestamp, toTimestamp)
      : await fetchApplicationsFirestore();

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: result.data,
        count: result.data?.length || 0,
      });
    }

    return NextResponse.json(
      { success: false, error: result.error },
      { status: 500 },
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'state',
      'program',
      'qualification',
      'preferredUniversity',
      'budget',
      'preferredSession',
      'lastPassingPercentage',
      'callbackDate',
      'callbackTime',
    ];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    

    if (
      body.budget === 'Custom amount' &&
      (!/^\d+$/.test(String(body.customBudget || '')) ||
        Number(body.customBudget) < 1000)
    ) {
      return NextResponse.json(
        { success: false, error: 'Enter a valid custom budget of at least ₹1,000' },
        { status: 400 }
      );
    }

    if (
      body.preferredSession === 'Custom session' &&
      String(body.customPreferredSession || '').trim().length < 2
    ) {
      return NextResponse.json(
        { success: false, error: 'Enter your preferred starting session' },
        { status: 400 }
      );
    }
    // Import here to avoid circular dependency issues
    const { saveApplication } = await import('@/lib/firebase-db');
    const result = await saveApplication(body);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        id: result.id,
        message: 'Application submitted successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
