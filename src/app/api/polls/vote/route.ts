import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { pollId, optionId } = await req.json();

  // 1. Check poll status
  const { data: poll } = await supabase
    .from("polls")
    .select("is_active")
    .eq("id", pollId)
    .single();

  if (!poll?.is_active) {
    return NextResponse.json(
      { error: "Poll is closed" },
      { status: 403 }
    );
  }

  // 2. Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 3. Check if user already voted
  const { data: existingVote } = await supabase
    .from("votes")
    .select("id")
    .eq("poll_id", pollId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingVote) {
    return NextResponse.json(
      { error: "You have already voted" },
      { status: 409 }
    );
  }

  // 4. Insert vote
  const { error } = await supabase.from("votes").insert({
    poll_id: pollId,
    option_id: optionId,
    user_id: user.id,
  });

  // 5. Handle DB-level duplicate protection
  if (error) {
    // 23505 = unique constraint violation (Postgres)
    if ((error as any).code === "23505") {
      return NextResponse.json(
        { error: "You have already voted" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
