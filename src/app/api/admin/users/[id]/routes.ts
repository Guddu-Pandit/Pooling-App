import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  // 1️⃣ Normal user client (cookie-based)
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2️⃣ Prevent self delete
  if (user.id === params.id) {
    return NextResponse.json(
      { error: "Admin cannot delete self" },
      { status: 400 }
    );
  }

  // 3️⃣ OPTIONAL: check admin role (recommended)
  const { data: profile, error: roleError } = await supabase
    .from("profiles_poll")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // 4️⃣ Admin client (SERVICE ROLE)
  const supabaseAdmin = createAdminClient();

  // 5️⃣ DELETE USER (auth.users)
  const { error } =
    await supabaseAdmin.auth.admin.deleteUser(params.id);

  if (error) {
    console.error("ADMIN DELETE USER ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true },
    { status: 200 }
  );
}
