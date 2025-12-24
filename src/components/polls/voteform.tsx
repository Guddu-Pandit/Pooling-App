"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function VoteForm({ poll }: any) {
  const supabase = createClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkVote = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("votes")
        .select("option_id")
        .eq("poll_id", poll.id)
        .eq("user_id", user.id)
        .single();

      if (data) {
        setHasVoted(true);
        setSelected(data.option_id);
      }
    };

    checkVote();
  }, [poll.id, supabase]);

  const submitVote = async () => {
    if (!selected) return alert("Select an option");

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("votes").insert({
      poll_id: poll.id,
      option_id: selected,
      user_id: user.id,
    });

    if (error) {
      alert(error.message);
    } else {
      setHasVoted(true);
      alert("Vote submitted ✅");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      {poll.poll_options.map((opt: any) => (
        <label key={opt.id} className="flex gap-2 items-center">
          <input
            type="radio"
            name={`poll-${poll.id}`}
            disabled={hasVoted}
            checked={selected === opt.id}
            onChange={() => setSelected(opt.id)}
          />
          {opt.option_text}
        </label>
      ))}

      <Button onClick={submitVote} disabled={loading || hasVoted}>
        {hasVoted ? "Already Voted" : loading ? "Submitting..." : "Vote"}
      </Button>
    </div>
  );
}
