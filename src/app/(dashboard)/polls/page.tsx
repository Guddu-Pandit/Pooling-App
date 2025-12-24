import { createClient } from "@/utils/supabase/server";
import PollList from "@/components/polls/polllist";
import { redirect } from "next/navigation";

export default async function PollsPage() {
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

  if (error) console.error(error);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Active Polls</h1>
      <PollList polls={polls ?? []} />
    </div>
  );
}
