import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import VoteForm from "@/components/polls/voteform";

export default async function PollPage({
  params,
}: {
  params: { pollId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const { data: poll } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      description,
      poll_options (
        id,
        option_text
      )
    `)
    .eq("id", params.pollId)
    .single();

  if (!poll) {
    return <p>Poll not found</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{poll.title}</h1>

      {poll.description && (
        <p className="text-muted-foreground">{poll.description}</p>
      )}

      <VoteForm poll={poll} />
    </div>
  );
}
