import Link from "next/link";
import { Button } from "@/components/ui/button";
import AdminUsersPage from "./user/page";

export default function AdminPage() {
  return (
    <div className="p-6 space-y-4">
      <AdminUsersPage />

      {/* <div className="flex gap-4">
        <Link href="/admin/users">
          <Button>Manage Users</Button>
        </Link>

        <Link href="/admin/polls">
          <Button>Manage Polls</Button>
        </Link>

        <Link href="/admin/analytics">
          <Button>Analytics</Button>
        </Link>
      </div> */}
    </div>
  );
}
