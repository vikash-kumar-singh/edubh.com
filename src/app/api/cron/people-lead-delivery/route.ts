import { NextResponse } from 'next/server';
import {
  fetchApplicationsPendingPeopleDelivery,
  updateApplicationPeopleDeliveryFirestore,
} from '@/lib/firebase-db';
import { deliverApplicationToPeople } from '@/lib/people-crm';
import type { PeopleImportBatch } from '@/lib/people-crm';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(request: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  return request.headers.get('authorization') === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { fromDate?: string; toDate?: string; batch?: PeopleImportBatch }
    | null;
  const fromDate = body?.fromDate?.trim() || null;
  const toDate = body?.toDate?.trim() || null;
  const batch = body?.batch;
  const hasDateRange = Boolean(fromDate || toDate);
  if (hasDateRange && (!fromDate || !toDate || !/^\d{4}-\d{2}-\d{2}$/.test(fromDate) || !/^\d{4}-\d{2}-\d{2}$/.test(toDate))) {
    return NextResponse.json({ error: 'Valid fromDate and toDate are required.' }, { status: 400 });
  }

  let dateRange: { fromTimestamp: number; toTimestamp: number } | undefined;
  if (fromDate && toDate) {
    const fromTimestamp = new Date(`${fromDate}T00:00:00+05:30`).getTime();
    const toTimestamp = new Date(`${toDate}T23:59:59.999+05:30`).getTime();
    const maximumRangeMs = 31 * 24 * 60 * 60 * 1000;
    if (!Number.isFinite(fromTimestamp) || !Number.isFinite(toTimestamp) || fromTimestamp > toTimestamp) {
      return NextResponse.json({ error: 'Invalid date range.' }, { status: 400 });
    }
    if (toTimestamp - fromTimestamp > maximumRangeMs) {
      return NextResponse.json({ error: 'Date range cannot exceed 31 days.' }, { status: 400 });
    }
    dateRange = { fromTimestamp, toTimestamp };
  }

  if (batch && (
    !batch.batchId?.trim() ||
    !batch.batchName?.trim() ||
    !batch.sourceTag?.trim() ||
    !Array.isArray(batch.batchTags) ||
    batch.batchTags.length === 0
  )) {
    return NextResponse.json({ error: 'Invalid batch metadata.' }, { status: 400 });
  }

  const applications = await fetchApplicationsPendingPeopleDelivery(dateRange ? 250 : 25, dateRange);
  const results: Array<{ applicationId: string | null; status: string }> = [];
  const concurrency = 10;
  for (let index = 0; index < applications.length; index += concurrency) {
    const group = applications.slice(index, index + concurrency);
    const groupResults = await Promise.all(group.map(async (application) => {
      if (!application.id) return { applicationId: null, status: 'invalid' as const };
      const delivery = await deliverApplicationToPeople(application.id, application, batch);
      await updateApplicationPeopleDeliveryFirestore(application.id, {
        status: delivery.status,
        leadId: delivery.status === 'delivered' ? delivery.leadId : null,
        error: delivery.status === 'delivered' ? null : delivery.error,
      });
      return { applicationId: application.id, status: delivery.status };
    }));
    results.push(...groupResults);
  }

  return NextResponse.json({
    success: true,
    processed: results.length,
    delivered: results.filter((result) => result.status === 'delivered').length,
    failed: results.filter((result) => result.status === 'failed').length,
    skipped: results.filter((result) => result.status === 'skipped').length,
    fromDate,
    toDate,
  });
}
