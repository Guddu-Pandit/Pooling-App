"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
// import { Button } from "@/components/ui/button";
import VoteForm from "./voteform";
import { useRouter } from "next/navigation"; // ✅ CORRECT IMPORT

type Poll = {
  id: string;
  title: string;
  description: string | null;
  created_by: string;
  poll_options: {
    id: string;
    option_text: string;
  }[];
};

export default function PollCard({ poll }: { poll: Poll }) {
  const supabase = createClient();
  const router = useRouter(); // ✅ App Router
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("🔍 Poll ID:", poll.id);
      console.log("Poll created_by:", poll.created_by); // ✅ DEBUG
      if (!user) return;
      console.log("User ID:", user.id); // ✅ DEBUG

      const { data: profile } = await supabase
        .from("profiles_poll")
        .select("role")
        .eq("id", user.id)
        .single();

      if (poll.created_by === user.id || profile?.role === "admin") {
        console.log("✅ USER IS OWNER - Delete button visible");
        setCanDelete(true);
      } else {
        console.log("❌ User is NOT owner");
      }
    };

    checkPermission();
  }, [poll.created_by, supabase]);

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

    router.refresh(); // ✅ WORKS NOW
  };

  return (
    <div className="border max-w-md rounded-lg p-4 space-y-3">
      <div>
        <h2 className="font-semibold">{poll.title}</h2>

        {poll.description && (
          <p className="text-sm text-muted-foreground">{poll.description}</p>
        )}
      </div>
      
      {/* ✅ OPTIONS + VOTE */}
      <VoteForm poll={poll} />

      {/* ✅ DELETE BUTTON */}
      {/* {canDelete && (
        <Button variant="destructive" size="sm" onClick={deletePoll}>
          Delete
        </Button>
      )} */}
    </div>
  );
}
