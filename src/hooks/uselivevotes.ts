"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function useLiveVotes(pollId: string) {
  const supabase = createClient();
  const [votes, setVotes] = useState<any[]>([]);

  useEffect(() => {
    fetchVotes();

    const channel = supabase
      .channel("votes-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
          filter: `poll_id=eq.${pollId}`,
        },
        () => fetchVotes()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pollId]);

  async function fetchVotes() {
    const { data } = await supabase
      .from("votes")
      .select("option_id")
      .eq("poll_id", pollId);

    setVotes(data || []);
  }

  return votes;
}
