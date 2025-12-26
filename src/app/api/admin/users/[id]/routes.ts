import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = params.id;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID missing" },
      { status: 400 }
    );
  }

  /* --------------------------------------------------
     1️⃣ USER-AUTH CLIENT (COOKIE BASED)
  -------------------------------------------------- */
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name, options) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  /* --------------------------------------------------
     2️⃣ CHECK ADMIN ROLE
  -------------------------------------------------- */
  const { data: profile, error: roleError } = await supabase
    .from("profiles_poll")
    .select("role")
    .eq("id", user.id)
    .single();

  if (roleError || profile?.role !== "admin") {
    return NextResponse.json(
      { error: "Admin only action" },
      { status: 403 }
    );
  }

  /* --------------------------------------------------
     3️⃣ SERVICE ROLE CLIENT (NO COOKIES)
  -------------------------------------------------- */
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /* --------------------------------------------------
     4️⃣ DELETE USER DATA (ORDER MATTERS)
  -------------------------------------------------- */

  await supabaseAdmin
    .from("votes")
    .delete()
    .eq("user_id", userId);

  await supabaseAdmin
    .from("polls")
    .delete()
    .eq("created_by", userId);

  await supabaseAdmin
    .from("profiles_poll")
    .delete()
    .eq("id", userId);

  const { error: authError } =
    await supabaseAdmin.auth.admin.deleteUser(userId);

  if (authError) {
    return NextResponse.json(
      { error: authError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
