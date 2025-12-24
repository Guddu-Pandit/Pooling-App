import { NextResponse } from "next/server";
import  { createAdminClient }  from "@/utils/supabase/admin";

export async function DELETE(req: Request) {
  const { userId } = await req.json();

  const supabase = createAdminClient();

  await supabase.auth.admin.deleteUser(userId);

  return NextResponse.json({ success: true });
}
