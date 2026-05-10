import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Code2, Sparkles, FileCheck2, GitCompare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DocuCode — AI Python Documentation Generator" },
      { name: "description", content: "Document your Python code in seconds with AI. PEP 257 compliant docstrings and inline comments." },
      { property: "og:title", content: "DocuCode — AI Python Documentation Generator" },
      { property: "og:description", content: "Document your Python code in seconds with AI." },
    ],
  }),
  component: Index,
});

function Index() {
  const { loginGuest } = useAuth();
  const navigate = useNavigate();

  const features = [
    { icon: Sparkles, title: "AI-Powered Comments", desc: "Generate context-aware docstrings and inline comments tailored to your code." },
    { icon: FileCheck2, title: "PEP 257 Compliant", desc: "Strictly follows Python documentation conventions for clean, idiomatic output." },
    { icon: GitCompare, title: "Side-by-Side Diff Viewer", desc: "Review every added line and accept or reject changes before downloading." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden bg-gradient-to-br from-navy via-navy to-brand text-white">
        <div className="mx-auto max-w-5xl px-4 py-24 text-center md:py-32">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <Code2 className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">DocuCode</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
            Document your Python code in seconds with AI.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full bg-brand hover:bg-brand/90 text-brand-foreground sm:w-auto">Get Started</Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white sm:w-auto"
              onClick={() => { loginGuest(); navigate({ to: "/editor" }); }}
            >
              Continue as Guest
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-xl border bg-card p-6 shadow-sm transition hover:shadow-md">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-navy">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        © 2026 DocuCode. Built for Python developers.
      </footer>
    </div>
  );
}
