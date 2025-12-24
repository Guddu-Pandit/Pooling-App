import { NextResponse } from "next/server";
import {createAdminClient}  from "@/utils/supabase/admin";

export async function GET(
  _: Request,
  { params }: { params: { pollId: string } }
) {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("polls")
    .select(`
      id,
      title,
      poll_options (
        id,
        option_text,
        votes (
          id,
          user_id,
          profiles_poll ( name, email )
        )
      )
    `)
    .eq("id", params.pollId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
