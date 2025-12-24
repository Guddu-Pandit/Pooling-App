"use client";

export default function AdminPollTable({ polls }: { polls: any[] }) {
  const closePoll = async (pollId: string) => {
    await fetch("/api/polls/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    });
    location.reload();
  };
  const deletePoll = async (pollId: string) => {
    const ok = confirm("Delete this poll permanently?");
    if (!ok) return;

    await fetch("/api/polls/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pollId }),
    });

    location.reload();
  };

  return (
    <div className="space-y-4">
      {polls.map((poll) => (
        <div key={poll.id} className="border p-4 rounded flex justify-between">
          <div>
            <p className="font-medium">{poll.title}</p>
            <p className="text-sm text-muted-foreground">
              {poll.is_active ? "Active" : "Closed"}
            </p>
          </div>

          {poll.is_active && (
            <button onClick={() => closePoll(poll.id)} className="text-red-500">
              Close
            </button>
          )}
          <button onClick={() => deletePoll(poll.id)} className="text-red-600">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
