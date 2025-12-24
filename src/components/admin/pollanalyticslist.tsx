"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export default function PollAnalyticsList() {
  const [polls, setPolls] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/analytics/polls")
      .then((res) => res.json())
      .then(setPolls);
  }, []);

  return (
    <div className="space-y-3">
      {polls.map((poll) => (
        <Link key={poll.id} href={`/admin/analytics/${poll.id}`}>
          <Card className="hover:bg-muted cursor-pointer">
            <CardContent className="flex justify-between p-4">
              <span className="font-medium">{poll.title}</span>
              <span className="text-sm text-muted-foreground">
                {poll.totalVotes} votes
              </span>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
