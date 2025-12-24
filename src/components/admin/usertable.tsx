"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  const removeUser = async (id: string) => {
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id }),
    });

    setUsers((u) => u.filter((x) => x.id !== id));
  };

  return (
    <table className="w-full border">
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>{u.email}</td>
            <td>{u.role}</td>
            <td>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeUser(u.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
