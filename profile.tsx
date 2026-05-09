import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LogOut, Mail, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — DocuCode" }, { name: "description", content: "Manage your DocuCode account." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState(user?.email || "");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-navy">Profile</h1>
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
            <p className="mt-3 text-sm text-muted-foreground">Registered</p>
            <p className="font-medium">{user.registered}</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-navy"><Mail className="h-4 w-4" /> Update Email</h2>
            <form
              onSubmit={(e) => { e.preventDefault(); if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Invalid email"); return; } login(email); toast.success("Email updated"); }}
              className="flex flex-col gap-3 sm:flex-row"
            >
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" className="bg-brand hover:bg-brand/90 text-brand-foreground">Update</Button>
            </form>
          </div>

          <div className="border-t pt-6">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-navy"><Lock className="h-4 w-4" /> Update Password</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (pw.length < 6) { toast.error("Password must be 6+ characters"); return; }
                if (pw !== pw2) { toast.error("Passwords don't match"); return; }
                setPw(""); setPw2(""); toast.success("Password updated");
              }}
              className="space-y-3"
            >
              <div>
                <Label>New Password</Label>
                <Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} />
              </div>
              <Button type="submit" className="bg-brand hover:bg-brand/90 text-brand-foreground">Update Password</Button>
            </form>
          </div>

          <div className="border-t pt-6">
            <Button variant="destructive" onClick={() => { logout(); navigate({ to: "/" }); toast.success("Logged out"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
