import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function usePolls() {
  const supabase = createClient();

  const [polls, setPolls] = useState<any[]>([]);
  const [votedPollIds, setVotedPollIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // 1️⃣ Get user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 2️⃣ Fetch polls
      const { data: pollsData } = await supabase
        .from("polls")
        .select(`
          id,
          title,
          description,
          poll_options (
            id,
            option_text,
            votes ( id )
          )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      // 3️⃣ Fetch votes by user
      if (user) {
        const { data: votes } = await supabase
          .from("votes")
          .select("poll_id")
          .eq("user_id", user.id);

        setVotedPollIds(new Set(votes?.map(v => v.poll_id)));
      }

      setPolls(pollsData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { polls, votedPollIds, loading };
}
