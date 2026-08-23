"use server";

import { createClient } from "@supabase/supabase-js";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export interface FeedbackPayload {
  source?: string;
  rating: number;
  first_look?: string;
  found_what_looking?: string;
  data_priorities?: string[];
  retention_features?: string[];
  confusion?: string;
  investor_type?: string;
  missing_features?: string;
  name?: string;
  contact?: string;
}

export async function submitFeedbackAction(payload: FeedbackPayload): Promise<{ success: boolean }> {
  if (!payload.rating || payload.rating < 1 || payload.rating > 5) {
    throw new Error("A rating between 1 and 5 is required.");
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("feedback").insert({
    source: payload.source ?? null,
    rating: payload.rating,
    first_look: payload.first_look ?? null,
    found_what_looking: payload.found_what_looking ?? null,
    data_priorities: payload.data_priorities?.length ? payload.data_priorities : null,
    retention_features: payload.retention_features?.length ? payload.retention_features : null,
    confusion: payload.confusion?.trim() || null,
    investor_type: payload.investor_type ?? null,
    missing_features: payload.missing_features?.trim() || null,
    name: payload.name?.trim() || null,
    contact: payload.contact?.trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
