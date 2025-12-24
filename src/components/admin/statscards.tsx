"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Stats = {
  users: number;
  polls: number;
  votes: number;
};

export default function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!stats) return <p>Loading analytics...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Users</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats.users}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Polls</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats.polls}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total Votes</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats.votes}
        </CardContent>
      </Card>
    </div>
  );
}
