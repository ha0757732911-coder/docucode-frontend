import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Code2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = (
    <>
      <Link to="/editor" className="px-3 py-2 text-sm font-medium hover:text-brand" activeProps={{ className: "text-brand" }}>Editor</Link>
      {user && <Link to="/history" className="px-3 py-2 text-sm font-medium hover:text-brand" activeProps={{ className: "text-brand" }}>History</Link>}
      {user && <Link to="/profile" className="px-3 py-2 text-sm font-medium hover:text-brand" activeProps={{ className: "text-brand" }}>Profile</Link>}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-navy">
          <Code2 className="h-6 w-6 text-brand" />
          <span>DocuCode</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">{links}</div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <Button variant="outline" size="sm" onClick={() => { logout(); navigate({ to: "/" }); }}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
              <Link to="/register"><Button size="sm" className="bg-brand hover:bg-brand/90 text-brand-foreground">Register</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="flex flex-col p-4 gap-2">
            <Link to="/editor" onClick={() => setOpen(false)} className="py-2">Editor</Link>
            {user && <Link to="/history" onClick={() => setOpen(false)} className="py-2">History</Link>}
            {user && <Link to="/profile" onClick={() => setOpen(false)} className="py-2">Profile</Link>}
            {user ? (
              <Button variant="outline" className="w-full" onClick={() => { logout(); setOpen(false); navigate({ to: "/" }); }}>Logout</Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setOpen(false)}><Button variant="ghost" className="w-full">Login</Button></Link>
                <Link to="/register" onClick={() => setOpen(false)}><Button className="w-full bg-brand hover:bg-brand/90 text-brand-foreground">Register</Button></Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
