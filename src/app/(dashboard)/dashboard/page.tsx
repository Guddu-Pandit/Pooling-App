import { createClient } from "@/utils/supabase/server";
import PollList from "@/components/polls/polllist";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

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
    <div className="min-h-screen px-6 py-8 ">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              View and manage all active polls
            </p>
          </div>

          <Link
            href="/polls/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-md font-medium text-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-95"
          >
            <Plus />Create Poll
          </Link>
        </div>

        {/* Content Card */}
        <div className="rounded-2xl border grid border-slate-200 bg-slate-80 backdrop-blur p-6 shadow-sm">
          {polls && polls.length > 0 ? (
            <PollList polls={polls} />
          ) : (
            <div className="text-center py-16 ">
              <h3 className="text-lg font-semibold text-slate-800">
                No active polls
              </h3>
              <p className="text-sm text-slate-500 mt-2">
                Create your first poll to get started.
              </p>

              <Link
                href="/polls/create"
                className="inline-block mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white shadow transition hover:shadow-md"
              >
                Create your first poll
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
