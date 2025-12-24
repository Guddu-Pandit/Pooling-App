"use client";

import PollCard from "./pollcard";

export type Poll = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  poll_options: {
    id: string;
    option_text: string;
  }[];
};

type Props = {
  polls: Poll[];
};

export default function PollList({ polls }: Props) {
  if (!polls.length) {
    return <p className="text-muted-foreground">No active polls</p>;
  }

  return (
    <div className="grid gap-4">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
