"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PollAnalyticsDetail({ pollId }: { pollId: string }) {
  const [poll, setPoll] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/analytics/polls/${pollId}`)
      .then((res) => res.json())
      .then(setPoll);
  }, [pollId]);

  if (!poll) return <p>Loading...</p>;

  const winner = poll.poll_options.reduce((prev: any, curr: any) =>
    curr.votes.length > prev.votes.length ? curr : prev
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{poll.title}</h2>

      {poll.poll_options.map((opt: any) => (
        <Card key={opt.id}>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>{opt.option_text}</span>
              <span>{opt.votes.length} votes</span>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {opt.votes.map((v: any) => (
              <div
                key={v.id}
                className="text-sm text-muted-foreground"
              >
                {v.profiles_poll?.name} ({v.profiles_poll?.email})
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="border-green-500">
        <CardHeader>
          <CardTitle>🏆 Winner</CardTitle>
        </CardHeader>
        <CardContent className="font-semibold">
          {winner.option_text} ({winner.votes.length} votes)
        </CardContent>
      </Card>
    </div>
  );
}
