import { NextResponse } from "next/server";
import  {createAdminClient}  from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const { pollId } = await req.json();
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("polls")
    .update({ is_active: false })
    .eq("id", pollId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
