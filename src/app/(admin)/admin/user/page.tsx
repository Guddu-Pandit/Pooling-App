"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "user" | "admin";
  poll_count: number;
  vote_count: number;
};

export default function AdminUsersPage() {
  const supabase = createClient();
  const router = useRouter();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 🔄 Fetch current user
  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setCurrentUserId(user.id);
      fetchUsers();
    };

    init();
  }, []);

  // 📊 Fetch users + stats
  const fetchUsers = async () => {
    setLoading(true);

    const { data: profiles, error } = await supabase
      .from("profiles_poll")
      .select("id, name, email, role");

    if (error || !profiles) {
      console.error(error);
      setLoading(false);
      return;
    }

    const enriched: UserRow[] = [];

    for (const u of profiles) {
      const { count: pollCount } = await supabase
        .from("polls")
        .select("*", { count: "exact", head: true })
        .eq("created_by", u.id);

      const { count: voteCount } = await supabase
        .from("votes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id);

      enriched.push({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        poll_count: pollCount || 0,
        vote_count: voteCount || 0,
      });
    }

    setUsers(enriched);
    setLoading(false);
  };

  // 👑 Make admin
  const makeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("profiles_poll")
      .update({ role: "admin" })
      .eq("id", userId);

    if (error) {
      alert(error.message);
      return;
    }

    fetchUsers();
  };

  // 🗑 Delete user (SAME STYLE AS VOTEFORM DELETE)
  const deleteUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { error: text };
      }

      console.log("DELETE USER RESPONSE:", res.status, data);

      if (!res.ok) {
        alert(data.error || "Failed to delete user");
        return;
      }

      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Network error while deleting user");
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-500">Loading users...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Polls</th>
              <th className="p-3 text-center">Votes</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => {
              const isSelf = u.id === currentUserId;

              return (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name || "—"}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-center">{u.poll_count}</td>
                  <td className="p-3 text-center">{u.vote_count}</td>
                  <td className="p-3 text-center capitalize">{u.role}</td>

                  <td className="p-3 flex gap-2 justify-center">
                    {/* Make Admin */}
                    {u.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => makeAdmin(u.id)}
                      >
                        Make Admin
                      </Button>
                    )}

                    {/* Delete User */}
                    {!isSelf && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete user?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user,
                              their polls, and all votes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteUser(u.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}

                    {isSelf && (
                      <span className="text-xs text-gray-400">
                        You
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
