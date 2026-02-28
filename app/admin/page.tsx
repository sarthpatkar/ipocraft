import AdminForm from "@/components/AdminForm";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import AdminSessionGuard from "@/components/AdminSessionGuard";

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/");
  }

  return (
  <div className="max-w-xl mx-auto p-6">

    <AdminSessionGuard />

    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-semibold">
        Admin — Add IPO
      </h1>

      <AdminLogoutButton />
    </div>

    <AdminForm />
  </div>
);
}
