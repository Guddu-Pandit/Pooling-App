import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: "user" | "admin" | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles_poll")
      .select("role")
      .eq("id", user.id)
      .single();

    role = data?.role ?? null;
  }

  return (
    <nav className="border-b">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-bold text-xl">
          Polling App
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">Dashboard</Link>

          {/* ✅ ADMIN ONLY */}
          {role === "admin" && (
            <Link href="/admin">
              <Button variant="secondary">Admin Panel</Button>
            </Link>
          )}

          {user && (
            <form action="/auth/signout" method="post">
              <Button variant="destructive">Logout</Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
