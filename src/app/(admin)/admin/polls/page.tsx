import CreatePollForm from "@/components/admin/createpollform";
import AdminPollTable from "@/components/admin/polltable";
import {createAdminClient} from "@/utils/supabase/admin"

export default async function AdminPollsPage() {
  // Fetch polls using server-side admin client
  const supabase = createAdminClient();

  const { data: polls } = await supabase
    .from("polls")
    .select("id, title, description, is_active")
    .order("created_at", { ascending: false });

  const pollsList = JSON.parse(JSON.stringify(polls ?? []));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin – Polls</h1>

      {/* Create poll */}
      <CreatePollForm />

      {/* Existing polls */}
      <AdminPollTable polls={pollsList} />
    </div>
  );
}
