import "server-only";

import { createHmac } from "node:crypto";
import type { ApplicationData } from "@/lib/firebase-db";

const DEFAULT_ENDPOINT = "https://people.edubh.com/api/integrations/edubh/leads";
const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

function getRequestTimeoutMs() {
  const configured = Number(process.env.PEOPLE_CRM_LEAD_TIMEOUT_MS);
  if (!Number.isFinite(configured) || configured < 8_000) return DEFAULT_REQUEST_TIMEOUT_MS;
  return Math.min(configured, 120_000);
}

export type PeopleDeliveryResult =
  | { status: "delivered"; leadId: string; created: boolean; duplicateFlag: boolean }
  | { status: "skipped"; error: string }
  | { status: "failed"; error: string };

export type PeopleImportBatch = {
  batchId: string;
  batchName: string;
  sourceTag: string;
  campaignName: string | null;
  batchTags: string[];
};

export function signPeopleLeadRequest(rawBody: string, timestamp: string, secret: string) {
  return `sha256=${createHmac("sha256", secret)
    .update(`${timestamp}.${rawBody}`, "utf8")
    .digest("hex")}`;
}

export async function deliverApplicationToPeople(
  applicationId: string,
  application: ApplicationData,
  batch?: PeopleImportBatch,
): Promise<PeopleDeliveryResult> {
  const secret = process.env.EDUBH_PEOPLE_INTEGRATION_SECRET?.trim();
  if (!secret) {
    return { status: "skipped", error: "EDUBH_PEOPLE_INTEGRATION_SECRET is not configured" };
  }

  const endpoint = process.env.PEOPLE_CRM_LEAD_ENDPOINT?.trim() || DEFAULT_ENDPOINT;
  const payload = {
    version: 1 as const,
    applicationId,
    submittedAt: application.timestamp,
    batch: batch ?? undefined,
    application: {
      fullName: application.fullName,
      email: application.email,
      phone: application.phone,
      state: application.state,
      program: application.program,
      qualification: application.qualification,
      preferredUniversity: application.preferredUniversity,
      budget: application.budget,
      customBudget: application.customBudget,
      preferredSession: application.preferredSession,
      customPreferredSession: application.customPreferredSession,
      lastPassingPercentage: application.lastPassingPercentage,
      callbackDate: application.callbackDate,
      callbackTime: application.callbackTime,
      leadSource: application.leadSource || "edubh.com",
      utmAttribution: application.utmAttribution,
    },
  };
  const rawBody = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = signPeopleLeadRequest(rawBody, timestamp, secret);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-edubh-timestamp": timestamp,
        "x-edubh-signature": signature,
      },
      body: rawBody,
      cache: "no-store",
      signal: AbortSignal.timeout(getRequestTimeoutMs()),
    });
    const result = (await response.json().catch(() => ({}))) as {
      leadId?: string;
      created?: boolean;
      duplicateFlag?: boolean;
      error?: string;
    };

    if (!response.ok || !result.leadId) {
      return {
        status: "failed",
        error: result.error || `People CRM returned HTTP ${response.status}`,
      };
    }

    return {
      status: "delivered",
      leadId: result.leadId,
      created: Boolean(result.created),
      duplicateFlag: Boolean(result.duplicateFlag),
    };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "People CRM delivery failed",
    };
  }
}
