import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Trash2, Download, FileCode2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { API, getToken } from "@/lib/auth";

export const Route = createFileRoute("/history")({
  head: () => ({ meta: [{ title: "History — DocuCode" }] }),
  component: HistoryPage,
});

type HistItem = {
  id: number;
  file_name: string;
  style: string;
  original_code: string;
  documented_code: string;
  created_at: string;
};

function HistoryPage() {
  const [items, setItems] = useState<HistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token || token === "guest") { setLoading(false); return; }

    fetch(`${API}/api/history`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setItems(Array.isArray(data) ? data : []); })
      .catch(() => toast.error("Could not load history"))
      .finally(() => setLoading(false));
  }, []);

  const deleteItem = async (id: number) => {
    const token = getToken();
    await fetch(`${API}/api/history/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setItems(items.filter((i) => i.id !== id));
    toast.success("Deleted");
  };

  const downloadItem = (item: HistItem) => {
    const blob = new Blob([item.documented_code], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = item.file_name.replace(".py", "_documented.py");
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded");
  };

  const filtered = items.filter((i) => i.file_name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-navy">History</h1>
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={async () => {
              for (const item of items) await deleteItem(item.id);
              setItems([]);
              toast.success("History cleared");
            }}
            disabled={items.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-10" placeholder="Search by file name..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading history...</p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-20 text-center">
            <FileCode2 className="mb-4 h-16 w-16 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">No saved sessions yet.</p>
            <Link to="/editor">
              <Button className="mt-4 bg-brand hover:bg-brand/90 text-brand-foreground">Start documenting</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((it) => (
              <div key={it.id} className="rounded-xl border bg-card p-4 shadow-sm transition hover:shadow-md">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FileCode2 className="h-4 w-4 text-brand shrink-0" />
                      <h3 className="font-semibold text-navy truncate">{it.file_name}</h3>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{it.style}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(it.created_at).toLocaleString()}</p>
                    <pre className="mt-3 overflow-x-auto rounded bg-muted p-2 text-xs text-muted-foreground line-clamp-2">
                      {it.original_code.slice(0, 150)}...
                    </pre>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button size="sm" variant="outline" onClick={() => downloadItem(it)}>
                      <Download className="mr-1 h-4 w-4" />Download
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteItem(it.id)}>
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
