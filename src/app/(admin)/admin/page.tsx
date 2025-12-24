import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="flex gap-4">
        <Link href="/admin/users">
          <Button>Manage Users</Button>
        </Link>

        <Link href="/admin/polls">
          <Button>Manage Polls</Button>
        </Link>

        <Link href="/admin/analytics">
          <Button>Analytics</Button>
        </Link>
      </div>
    </div>
  );
}
