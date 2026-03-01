import { createBrowserClient } from "@supabase/ssr";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function fetchIpos() {
  const { data } = await supabase
    .from("ipos")
    .select("*")
    .order("created_at", { ascending: false });

  return data || [];
}

export async function deleteIpo(id: string) {
  await supabase.from("ipos").delete().eq("id", id);
}

export async function fetchBrokers() {
  const { data } = await supabase
    .from("brokers")
    .select("*")
    .order("sort_order", { ascending: true });

  return data || [];
}

export async function deleteBroker(id: string) {
  await supabase.from("brokers").delete().eq("id", id);
}