"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";

export default function VoteForm({ poll }: any) {
  const supabase = createClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submitVote = async () => {
    if (!selected) {
      alert("Select an option");
      return;
    }

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

    if (error) alert(error.message);
    else alert("Vote submitted ✅");

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      {poll.poll_options.map((opt: any) => (
        <label key={opt.id} className="flex gap-2 items-center">
          <input
            type="radio"
            name={`poll-${poll.id}`}
            onChange={() => setSelected(opt.id)}
          />
          {opt.option_text}
        </label>
      ))}

      <Button onClick={submitVote} disabled={loading}>
        {loading ? "Submitting..." : "Vote"}
      </Button>
    </div>
  );
}
