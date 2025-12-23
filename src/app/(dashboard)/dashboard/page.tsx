import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect("/");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Polling Dashboard</h1>
      <p className="text-muted-foreground">
        View and participate in ongoing polls
      </p>
    </div>
  );
}
