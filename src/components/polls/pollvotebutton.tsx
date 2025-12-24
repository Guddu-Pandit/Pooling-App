"use client";

import { useEffect, useState } from "react";

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
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const checkVote = async () => {
      const res = await fetch(`/api/polls/check-vote?pollId=${pollId}`);
      if (res.ok) setHasVoted(true);
    };

    checkVote();
  }, [pollId]);

  const handleVote = async () => {
    setLoading(true);

    const res = await fetch("/api/polls/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId, optionId }),
    });

    if (res.ok) {
      setHasVoted(true);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading || hasVoted}
      className="w-full border rounded px-4 py-2 hover:bg-muted disabled:opacity-50"
    >
      {hasVoted ? "Voted" : text}
    </button>
  );
}
