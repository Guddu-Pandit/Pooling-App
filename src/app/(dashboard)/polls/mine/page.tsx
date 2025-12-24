import { createClient } from "@/utils/supabase/server";

export default async function MyPollsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: polls } = await supabase
    .from("polls")
    .select("id, title, is_active")
    .eq("created_by", user?.id);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">My Polls</h1>

      {polls?.map((p) => (
        <div key={p.id} className="border p-4 rounded">
          <p>{p.title}</p>
          <p className="text-sm text-muted-foreground">
            {p.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      ))}
    </div>
  );
}
