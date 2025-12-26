import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ChartColumn, LogOut } from "lucide-react";

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
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl  cursor-pointer">       
           <Link href="/dashboard" className="flex gap-2">
          <ChartColumn  className="mt-1 "/>Polling App
        </Link>
        </div>

        <div className="flex items-center gap-4 cursor-pointer ">
          {/* <Link href="/dashboard" className="text-black font-semibold">Dashboard</Link> */}
         {/* <Link href="/polls" className="text-black font-semibold">All Polls</Link> */}


          {/* ✅ ADMIN ONLY */}
          {role === "admin" && (
            <Link href="/admin">
              <Button variant="secondary" className="cursor-pointer text-1xl bg-white text-black ">Admin Panel</Button>
            </Link>
          )}

          {user && (
            <form action="/auth/signout" method="post">
              <Button variant="destructive" className="cursor-pointer text-red-500 bg-white hover:bg-red-200"><LogOut />Logout</Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
