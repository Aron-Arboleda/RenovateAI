export type LeadPayload = {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  budget: string;
  location: string;
  timeline: string;
  description: string;
  website?: string;
};

export type BookingPayload = {
  name: string;
  email: string;
  startsAt: string;
  notes: string;
};

type WebhookSuccess = {
  ok?: boolean;
  message?: string;
  errors?: string[];
  [key: string]: unknown;
};

function getWebhookUrl(): string {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;

  if (!webhookUrl || !webhookUrl.trim()) {
    throw new Error(
      "Missing VITE_N8N_WEBHOOK_URL. Set it in frontend/.env before submitting leads.",
    );
  }

  return webhookUrl.trim();
}

function getBookingWebhookUrl(): string {
  const webhookUrl = import.meta.env.VITE_N8N_BOOKING_WEBHOOK_URL as string | undefined;
  if (!webhookUrl?.trim()) {
    throw new Error("Missing VITE_N8N_BOOKING_WEBHOOK_URL. Add it to Vercel before accepting bookings.");
  }
  return webhookUrl.trim();
}

export async function submitLead(
  payload: LeadPayload,
): Promise<WebhookSuccess> {
  const response = await fetch(getWebhookUrl(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const bodyText = await response.text();
  let parsed: WebhookSuccess = {};

  if (bodyText) {
    try {
      parsed = JSON.parse(bodyText) as WebhookSuccess;
    } catch {
      parsed = {message: bodyText};
    }
  }

  if (!response.ok) {
    const validationDetails =
      parsed.errors && parsed.errors.length > 0
        ? ` ${parsed.errors.join(", ")}`
        : "";

    throw new Error(
      (parsed.message ? `${parsed.message}.${validationDetails}` : "") ||
        `Webhook request failed with status ${response.status}.`,
    );
  }

  return parsed;
}

export async function submitBooking(payload: BookingPayload): Promise<WebhookSuccess> {
  const response = await fetch(getBookingWebhookUrl(), {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });
  const bodyText = await response.text();
  let parsed: WebhookSuccess = {};
  try { parsed = bodyText ? JSON.parse(bodyText) as WebhookSuccess : {}; }
  catch { parsed = {message: bodyText}; }
  if (!response.ok) throw new Error(parsed.message ?? "We could not reserve that consultation time.");
  return parsed;
}
