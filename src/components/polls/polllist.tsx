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
    <div className="grid gap-6
     grid-cols-1          /* Mobile: 1 poll */
        md:grid-cols-2       /* ≥768px: 2 polls per row */
        lg:grid-cols-2  ">
      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
}
