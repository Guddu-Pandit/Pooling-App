import { NextResponse } from "next/server";
import  {createAdminClient}  from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const supabase = createAdminClient(); // server-only

  const body = await req.json();
  const { title, description, options } = body;

  // Insert poll
  const { data: poll, error } = await supabase
    .from("polls")
    .insert({
      title,
      description,
      is_active: true, // admin polls active immediately
    })
    .select()
    .single();

  if (error || !poll) {
    return NextResponse.json({ error: error?.message || "Failed to create poll" }, { status: 400 });
  }

  // Insert poll options
  const optionRows = options.map((text: string) => ({
    poll_id: poll.id,
    option_text: text,
  }));

  const { error: optionsError } = await supabase.from("poll_options").insert(optionRows);

  if (optionsError) {
    return NextResponse.json({ error: optionsError.message }, { status: 400 });
  }

  return NextResponse.json({ poll });
}
