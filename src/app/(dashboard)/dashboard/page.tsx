import { createClient } from "@/utils/supabase/server";
import PollList from "@/components/polls/polllist";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // ✅ FETCH POLLS WITH OPTIONS
  const { data: polls, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      created_by,
      poll_options (
        id,
        option_text
      )
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <Link
          href="/polls/create"
          className="px-4 py-2 bg-primary text-white rounded"
        >
          Create Poll
        </Link>
      </div>

      {/* ✅ SEND OPTIONS ALSO */}
      <PollList polls={polls ?? []} />
    </div>
  );
}
