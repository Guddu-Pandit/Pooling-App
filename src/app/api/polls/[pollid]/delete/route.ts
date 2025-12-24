import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // 🔐 Get logged-in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 📌 Fetch poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("created_by")
    .eq("id", params.id)
    .single();

  if (pollError || !poll) {
    return NextResponse.json(
      { error: "Poll not found" },
      { status: 404 }
    );
  }

  // 👤 Check role
  const { data: profile } = await supabase
    .from("profiles_poll")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const isOwner = poll.created_by === user.id;

  if (!isAdmin && !isOwner) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // ❌ Delete poll (CASCADE deletes options + votes)
  const { error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", params.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
