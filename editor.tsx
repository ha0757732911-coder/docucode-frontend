import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Upload, Eraser, Download, Check, X, Loader2, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sampleCode, documentedCode, highlightPython } from "@/lib/mock";
import { toast } from "sonner";

export const Route = createFileRoute("/editor")({
  head: () => ({ meta: [{ title: "Editor — DocuCode" }, { name: "description", content: "AI-powered Python documentation editor." }] }),
  component: EditorPage,
});

type Diff = { text: string; added: boolean; rejected?: boolean }[];

function buildDiff(orig: string, doc: string): Diff {
  const o = new Set(orig.split("\n").map((l) => l.trim()));
  return doc.split("\n").map((line) => ({
    text: line,
    added: line.trim() !== "" && !o.has(line.trim()),
  }));
}

function EditorPage() {
  const [code, setCode] = useState(sampleCode);
  const [style, setStyle] = useState("pep257");
  const [diff, setDiff] = useState<Diff | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"split" | "unified">("split");
  const fileRef = useRef<HTMLInputElement>(null);

  const generate = () => {
    if (!code.trim()) { toast.error("Please enter some code first"); return; }
    setLoading(true);
    setDiff(null);
    setTimeout(() => {
      setDiff(buildDiff(code, documentedCode));
      setLoading(false);
      toast.success("Documentation generated");
    }, 1200);
  };

  const acceptAll = () => {
    if (!diff) return;
    setDiff(diff.map((d) => ({ ...d, rejected: false })));
    toast.success("All suggestions accepted");
  };

  const toggleLine = (i: number) => {
    if (!diff) return;
    setDiff(diff.map((d, idx) => idx === i ? { ...d, rejected: !d.rejected } : d));
  };

  const finalCode = useMemo(
    () => diff ? diff.filter((d) => !(d.added && d.rejected)).map((d) => d.text).join("\n") : "",
    [diff]
  );

  const download = () => {
    if (!diff) return;
    const blob = new Blob([finalCode], { type: "text/x-python" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "documented.py"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded documented.py");
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { setCode(String(r.result || "")); toast.success(`Loaded ${f.name}`); };
    r.readAsText(f);
  };

  const lines = code.split("\n");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* LEFT */}
          <div className="flex flex-col rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="text-sm font-semibold text-navy">Original Code</h2>
              <span className="text-xs text-muted-foreground">{lines.length} lines</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 p-3">
              <input ref={fileRef} type="file" accept=".py" hidden onChange={handleFile} />
              <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" /> Upload .py File
              </Button>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pep257">PEP 257</SelectItem>
                  <SelectItem value="google">Google Style</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm" variant="ghost" onClick={() => { setCode(""); setDiff(null); }}>
                <Eraser className="mr-2 h-4 w-4" /> Clear
              </Button>
            </div>

            <div className="code-editor relative flex min-h-[400px] flex-1 overflow-auto">
              <div className="select-none border-r border-white/10 bg-black/20 px-3 py-3 text-right text-xs leading-relaxed text-white/40">
                {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="code-editor w-full resize-none bg-transparent p-3 outline-none"
                style={{ minHeight: 400 }}
              />
            </div>

            <div className="border-t p-3">
              <Button onClick={generate} disabled={loading} className="w-full bg-brand hover:bg-brand/90 text-brand-foreground" size="lg">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Documentation
              </Button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col rounded-xl border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <h2 className="text-sm font-semibold text-navy">Documented Code</h2>
              {diff && <span className="text-xs text-muted-foreground">{diff.filter((d) => d.added).length} additions</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2 border-b bg-muted/40 p-3">
              <Button size="sm" variant="outline" onClick={acceptAll} disabled={!diff}>
                <Check className="mr-2 h-4 w-4" /> Accept All
              </Button>
              <Button size="sm" variant="outline" onClick={download} disabled={!diff}>
                <Download className="mr-2 h-4 w-4" /> Download .py
              </Button>
              <div className="ml-auto flex overflow-hidden rounded-md border">
                <button onClick={() => setView("split")} className={`px-3 py-1 text-xs ${view === "split" ? "bg-navy text-white" : "bg-background"}`}>Split</button>
                <button onClick={() => setView("unified")} className={`px-3 py-1 text-xs ${view === "unified" ? "bg-navy text-white" : "bg-background"}`}>Unified</button>
              </div>
            </div>

            <div className="code-editor relative flex min-h-[400px] flex-1 overflow-auto">
              {loading ? (
                <div className="flex w-full items-center justify-center text-white/70">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating documentation...
                </div>
              ) : !diff ? (
                <div className="flex w-full items-center justify-center px-6 text-center text-white/40">
                  Your documented code will appear here
                </div>
              ) : (
                <div className="w-full">
                  {diff.map((d, i) => (
                    <div
                      key={i}
                      className={`group flex items-center gap-2 px-3 ${d.added && !d.rejected ? "bg-[#C6EFC8]/90 text-[#0a3]" : ""} ${d.rejected ? "bg-destructive/10 line-through opacity-60" : ""}`}
                    >
                      <span className="w-8 select-none text-right text-xs text-white/30">{i + 1}</span>
                      <pre
                        className="flex-1 whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightPython(d.text || " ") }}
                      />
                      {d.added && (
                        <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                          <button onClick={() => toggleLine(i)} className="rounded bg-green-600 p-0.5 text-white" title="Accept">
                            <Check className="h-3 w-3" />
                          </button>
                          <button onClick={() => toggleLine(i)} className="rounded bg-red-600 p-0.5 text-white" title="Reject">
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
