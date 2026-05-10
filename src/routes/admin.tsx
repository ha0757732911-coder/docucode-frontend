import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutDashboard, Users, Activity, AlertTriangle, BarChart3, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockUsers } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — DocuCode" }, { name: "description", content: "DocuCode administration dashboard." }] }),
  component: AdminPage,
});

function AdminPage() {
  const [users, setUsers] = useState(mockUsers);

  const stats = [
    { label: "Total Users", value: "1,284", color: "bg-brand/10 text-brand" },
    { label: "Daily Active Users", value: "342", color: "bg-green-100 text-green-700" },
    { label: "Total Requests", value: "18,402", color: "bg-purple-100 text-purple-700" },
    { label: "API Errors Today", value: "7", color: "bg-red-100 text-red-700" },
  ];

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Users", icon: Users },
    { label: "Activity Log", icon: Activity },
    { label: "API Errors", icon: AlertTriangle },
    { label: "Usage Stats", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <aside className="hidden w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <Link to="/" className="flex items-center gap-2 border-b border-sidebar-border px-5 py-4 font-bold">
          <Code2 className="h-5 w-5 text-brand" /> DocuCode <span className="ml-1 text-xs font-normal text-white/50">Admin</span>
        </Link>
        <nav className="flex-1 p-3">
          {navItems.map((it, idx) => (
            <button
              key={it.label}
              className={`mb-1 flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition ${idx === 0 ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/60"}`}
            >
              <it.icon className="h-4 w-4" /> {it.label}
            </button>
          ))}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <Link to="/"><Button variant="ghost" size="sm" className="w-full text-white hover:bg-sidebar-accent hover:text-white">← Back to site</Button></Link>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Overview of platform activity</p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${s.color}`}>
                <BarChart3 className="h-4 w-4" />
              </div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="font-semibold text-navy">Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.email} className="border-t">
                    <td className="px-5 py-3 font-medium">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">{u.role}</td>
                    <td className="px-5 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="mr-2"
                        onClick={() => {
                          setUsers(users.map((x, idx) => idx === i ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x));
                          toast.success("User updated");
                        }}
                      >
                        {u.status === "Active" ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => { setUsers(users.filter((_, idx) => idx !== i)); toast.success("User deleted"); }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
