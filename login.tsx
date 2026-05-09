import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — DocuCode" }, { name: "description", content: "Sign in to DocuCode." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { login, loginGuest } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "Enter a valid email";
    if (password.length < 6) errs.password = "Password must be 6+ characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    login(email);
    toast.success("Welcome back!");
    navigate({ to: "/editor" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary to-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white">
            <Code2 className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-navy">DocuCode</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>
          <Button type="submit" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Login</Button>
        </form>
        <button
          type="button"
          className="mt-3 w-full text-center text-sm text-brand hover:underline"
          onClick={() => { loginGuest(); toast.success("Continuing as guest"); navigate({ to: "/editor" }); }}
        >
          Continue as Guest
        </button>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="font-medium text-brand hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
