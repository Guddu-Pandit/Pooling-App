import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();

  // 1️⃣ Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
    console.log("🔍 Deleting poll:", (await params).id, "by user:", user.id);


  // 2️⃣ Fetch poll owner
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .select("created_by")
    .eq("id", (await params).id)
    .single();

  if (pollError || !poll) {
    return NextResponse.json(
      { error: "Poll not found" },
      { status: 404 }
    );
  }

  // 3️⃣ Fetch user role
  const { data: profile, error: roleError } = await supabase
    .from("profiles_poll")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError) {
    return NextResponse.json(
      { error: "Role check failed" },
      { status: 500 }
    );
  }

  const isAdmin = profile?.role === "admin";
  const isOwner = poll.created_by === user.id;

  console.log(isOwner,"owner is")

  // 4️⃣ Permission check
  if (!isAdmin && !isOwner) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  console.log((await params).id)
  // 5️⃣ Delete poll (FK CASCADE handles options + votes)
  const { error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", (await params).id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
