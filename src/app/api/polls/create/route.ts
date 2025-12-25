import { NextResponse } from "next/server";
import  {createAdminClient}  from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server"; // For auth check


export async function POST(req: Request) {
    const supabase = await createClient();

  const adminsupabase = createAdminClient(); // server-only
  const { data: { user } } = await supabase.auth.getUser();
 if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, options } = body;

  // Insert poll
  const { data: poll, error } = await supabase
    .from("polls")
    .insert({
      title,
      description,
      created_by: user.id,
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
