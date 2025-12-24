"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function LiveResults({ pollId }: { pollId: string }) {
  const supabase = createClient();
  const [options, setOptions] = useState<any[]>([]);

  const fetchResults = async () => {
    const { data } = await supabase
      .from("poll_options")
      .select(
        `
        id,
        option_text,
        votes: votes(count)
      `
      )
      .eq("poll_id", pollId);

    setOptions(data ?? []);
  };

  useEffect(() => {
    fetchResults();

    const channel = supabase
      .channel("votes-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "votes",
        },
        () => {
          fetchResults();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalVotes = options.reduce(
    (sum, o) => sum + o.votes[0].count,
    0
  );

  return (
    <div className="space-y-4">
      {options.map((opt) => {
        const count = opt.votes[0].count;
        const percentage =
          totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);

        return (
          <div key={opt.id} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{opt.option_text}</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-muted h-2 rounded">
              <div
                className="bg-primary h-2 rounded"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
