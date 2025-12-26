"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function VoteForm({ poll }: any) {
  const supabase = createClient();
  const router = useRouter();

  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [canDelete, setCanDelete] = useState(false);

  // ✅ Check if user already voted
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

  // ✅ Check delete permission (owner / admin)
  useEffect(() => {
    const checkPermission = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles_poll")
        .select("role")
        .eq("id", user.id)
        .single();

      if (poll.created_by === user.id || profile?.role === "admin") {
        setCanDelete(true);
      }
    };

    checkPermission();
  }, [poll.created_by, supabase]);

  // ✅ Fetch results after voting
  useEffect(() => {
    if (!hasVoted) return;

    const fetchResults = async () => {
      const { data } = await supabase
        .from("votes")
        .select("option_id")
        .eq("poll_id", poll.id);

      if (!data) return;

      const count: Record<string, number> = {};
      data.forEach((v) => {
        count[v.option_id] = (count[v.option_id] || 0) + 1;
      });

      setResults(count);
      setTotalVotes(data.length);
    };

    fetchResults();
  }, [hasVoted, poll.id, supabase]);

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

    if (!error) {
      setHasVoted(true);
    } else {
      alert(error.message);
    }

    setLoading(false);
  };

  // ✅ Delete poll
  const deletePoll = async () => {
    if (!confirm("Are you sure you want to delete this poll?")) return;

    const res = await fetch(`/api/polls/${poll.id}/delete`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to delete poll");
      return;
    }

    router.refresh();
  };

  return (
    <div className="space-y-4">
      {poll.poll_options.map((opt: any) => {
        const votes = results[opt.id] || 0;
        const percent =
          totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

        const isSelected = selected === opt.id;

        return (
          <div
            key={opt.id}
            onClick={() => !hasVoted && setSelected(opt.id)}
            className={`
              relative overflow-hidden rounded-xl border max-w-md px-4 py-4 cursor-pointer transition
              ${
                hasVoted
                  ? "border-teal-300"
                  : isSelected
                  ? "border-teal-400 bg-teal-50"
                  : "border-slate-300 hover:border-teal-300 hover:bg-slate-50"
              }
            `}
          >
            {hasVoted && (
              <div
                className="absolute inset-y-0 left-0 bg-teal-100"
                style={{ width: `${percent}%` }}
              />
            )}

            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {hasVoted && isSelected ? (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-500 text-white text-sm">
                    ✓
                  </span>
                ) : (
                  <span
                    className={`h-6 w-6 rounded-full border-2 ${
                      isSelected
                        ? "border-teal-400"
                        : "border-slate-400"
                    }`}
                  />
                )}

                <span className="font-medium text-slate-900">
                  {opt.option_text}
                </span>
              </div>

              {hasVoted && (
                <span className="font-semibold text-teal-500">
                  {percent}%
                </span>
              )}
            </div>
          </div>
        );
      })}


<div className=" flex justify-between gap-2">
      {/* Vote Button */}
      <Button
        onClick={submitVote}
        disabled={loading || hasVoted}
        className="max-w-md rounded-xl bg-teal-700 py-5 text-white hover:bg-teal-600 cursor-pointer"
      >
        {hasVoted ? "Voted !" : loading ? "Submitting..." : "Vote"}
      </Button>

      {/* ✅ DELETE BUTTON (moved here) */}
      {canDelete && (
        <Button
          variant="destructive"
          size="sm"
          className="max-w-md p-5 cursor-pointer text-red-500 bg-red-200 hover:text-white hover:bg-red-500 "
          onClick={deletePoll}
        >
          Delete Poll
        </Button>
      )}
      </div>
    </div>
  );
}
