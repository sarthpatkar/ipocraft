"use server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function deleteIpoAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ipos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteBrokerAction(id: string) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("brokers").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function duplicateIpoAction(ipo: any) {
  const supabase = await createSupabaseServerClient();
  const { id, created_at, updated_at, ...rest } = ipo;
  const payload = {
    ...rest,
    name: `${ipo.name} (Copy)`,
    slug: `${ipo.slug}-copy-${Date.now()}`,
  };

  const { error } = await supabase.from("ipos").insert(payload);
  if (error) throw new Error(error.message);
  return { success: true };
}

export async function updateGmpAction(ipoId: string, gmp: number) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("ipos").update({ gmp }).eq("id", ipoId);
  
  if (error) throw new Error(error.message);

  // Attempt to insert history
  const { error: historyError } = await supabase.from("gmp_history").insert({
    ipo_id: ipoId,
    gmp,
  });

  return { success: true, historyError: historyError?.message };
}

export async function saveBrokerAction(broker: any) {
  const supabase = await createSupabaseServerClient();
  
  if (broker.id) {
    const { error } = await supabase.from("brokers").update(broker).eq("id", broker.id);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabase.from("brokers").insert(broker);
    if (error) throw new Error(error.message);
  }
  return { success: true };
}

export async function saveIpoAction(payload: any, isUpdate: boolean, ipoId?: string) {
  const supabase = await createSupabaseServerClient();
  
  if (isUpdate && ipoId) {
    const { data, error } = await supabase.from("ipos").update(payload).eq("id", ipoId).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data };
  } else {
    const { data, error } = await supabase.from("ipos").insert([payload]).select().single();
    if (error) throw new Error(error.message);
    return { success: true, data };
  }
}
