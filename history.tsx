import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Trash2, Download, FileCode2, FolderOpen } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockHistory } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — DocuCode" }, { name: "description", content: "Past documentation sessions." }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState(mockHistory);
  const [q, setQ] = useState("");
  const filtered = items.filter((i) => i.fileName.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-navy">History</h1>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => { setItems([]); toast.success("History cleared"); }}
            disabled={items.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All History
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search by file name..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
            <FileCode2 className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No saved sessions yet.</p>
            <Link to="/editor"><Button className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground">Start documenting</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((it) => (
              <div key={it.id} className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-brand shrink-0" />
                      <h3 className="font-semibold text-navy truncate">{it.fileName}</h3>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{it.date}</p>
                    <pre className="mt-3 overflow-x-auto rounded bg-muted p-2 text-xs text-muted-foreground">{it.preview}</pre>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Link to="/editor"><Button size="sm" variant="outline"><FolderOpen className="mr-1 h-4 w-4" />Open</Button></Link>
                    <Button size="sm" variant="outline" onClick={() => toast.success("Downloaded")}><Download className="mr-1 h-4 w-4" />Download</Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                      onClick={() => { setItems(items.filter((x) => x.id !== it.id)); toast.success("Deleted"); }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
