import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PasswordProtection } from "@/components/PasswordProtection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { isAuthenticated } from "@/lib/auth";
import {
  getBacklogEntries,
  clearBacklog,
  exportBacklog,
  formatTimestamp,
  type BacklogEntry,
} from "@/lib/backlog";
import { Download, Trash2, Search, FileText, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Backlog = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [entries, setEntries] = useState<BacklogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);
  const [filterPDF, setFilterPDF] = useState<string>("all");

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const allEntries = getBacklogEntries();
    setEntries(allEntries);
  };

  const handleExport = () => {
    const json = exportBacklog();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trafosanf_backlog_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    clearBacklog();
    setEntries([]);
  };

  // Get unique PDF names
  const pdfNames = Array.from(
    new Set(entries.map((e) => e.pdfFileName).filter(Boolean))
  ) as string[];

  // Filter entries
  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      searchQuery === "" ||
      entry.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPDF =
      filterPDF === "all" ||
      (filterPDF === "none" && !entry.pdfFileName) ||
      entry.pdfFileName === filterPDF;

    return matchesSearch && matchesPDF;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
                Chat Backlog
              </h1>
              <p className="text-muted-foreground">
                Alle gespeicherten Fragen und Antworten
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportieren
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Leeren
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Backlog wirklich leeren?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Diese Aktion kann nicht rückgängig gemacht werden. Alle
                      gespeicherten Einträge werden gelöscht.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear}>
                      Leeren
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">{entries.length}</span> Einträge
              insgesamt
            </div>
            {filteredEntries.length !== entries.length && (
              <div>
                <span className="font-medium">{filteredEntries.length}</span>{" "}
                gefiltert
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nach Fragen oder Antworten suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterPDF}
              onChange={(e) => setFilterPDF(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Alle PDFs</option>
              <option value="none">Ohne PDF</option>
              {pdfNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Entries List */}
          <ScrollArea className="h-[600px] border border-border rounded-lg p-4">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {entries.length === 0
                  ? "Noch keine Einträge im Backlog"
                  : "Keine Einträge gefunden"}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-border rounded-lg p-4 bg-card hover:bg-accent/5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {entry.isPricingQuestion && (
                          <Badge variant="secondary">Preis-Anfrage</Badge>
                        )}
                        {entry.pdfFileName && (
                          <Badge variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {entry.pdfFileName}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Frage:
                        </div>
                        <div className="text-sm">{entry.question}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">
                          Antwort:
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {entry.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Backlog;

