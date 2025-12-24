"use client";

import { useState } from "react";

type PollVoteButtonProps = {
  pollId: string;
  optionId: string;
  text: string;
};

export default function PollVoteButton({
  pollId,
  optionId,
  text,
}: PollVoteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    setLoading(true);

    const res = await fetch("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, optionId }),
    });

    if (res.ok) {
      setVoted(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading || voted}
      className="w-full border rounded px-4 py-2 hover:bg-muted disabled:opacity-50"
    >
      {text}
    </button>
  );
}
