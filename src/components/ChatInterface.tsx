import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "./ChatMessage";
import { Send, Loader2, Upload } from "lucide-react";
import { askQuestion, preparePDFContext } from "@/lib/openai";
import { findRelevantSections } from "@/lib/pdfExtractor";
import { PricingRequestDialog } from "./PricingRequestDialog";
import { saveToBacklog } from "@/lib/backlog";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getPDFs } from "@/lib/pdfStorage";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

interface ChatInterfaceProps {
  pdfContext?: string;
}

export const ChatInterface = ({ pdfContext: initialPDFContext }: ChatInterfaceProps) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Bitte laden Sie zuerst ein PDF-Dokument hoch, damit ich Ihre Fragen beantworten kann.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pdfContext, setPdfContext] = useState<string>(initialPDFContext || "");
  const [pdfFileNames, setPdfFileNames] = useState<string[]>([]);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [pendingPricingQuestion, setPendingPricingQuestion] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load PDFs from storage on mount
  useEffect(() => {
    const pdfs = getPDFs();
    if (pdfs && pdfs.text) {
      setPdfContext(pdfs.text);
      setPdfFileNames(pdfs.fileNames || []);
    }
  }, []);

  // Update welcome message when PDF is loaded
  useEffect(() => {
    if (pdfContext && pdfContext.trim().length > 0) {
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: `PDF(s) erfolgreich geladen! Ich kann jetzt Fragen basierend auf den hochgeladenen Dokumenten beantworten. Was möchten Sie wissen?`,
        },
      ]);
    }
  }, [pdfContext, pdfFileNames]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);


  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check if PDF is loaded
    if (!pdfContext || pdfContext.trim().length === 0) {
      toast({
        title: "Kein PDF hochgeladen",
        description: "Bitte laden Sie zuerst ein PDF-Dokument hoch, bevor Sie Fragen stellen.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Add loading message
    const loadingMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: loadingMessageId,
        role: "assistant",
        content: "",
        isLoading: true,
      },
    ]);

    try {
      // Get relevant PDF context for this question
      const relevantContext = findRelevantSections(pdfContext, userMessage.content);

      // Prepare full context (use relevant sections if found, otherwise use all)
      const context = relevantContext && relevantContext.length > 50 
        ? relevantContext 
        : preparePDFContext(pdfContext || "", 4000);
      
      // Get chat history for context
      const chatHistory = messages
        .filter(msg => msg.role !== "assistant" || !msg.isLoading)
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Ask OpenAI
      const result = await askQuestion(userMessage.content, context, chatHistory);

      // Check if it's a pricing question
      if (result.isPricingQuestion) {
        setPendingPricingQuestion(userMessage.content);
        setShowPricingDialog(true);
      }

      // Update loading message with answer
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: msg.id,
                role: "assistant",
                content: result.answer,
                isLoading: false,
              }
            : msg
        )
      );

      // Save to backlog (local + database)
      await saveToBacklog(
        userMessage.content,
        result.answer,
        pdfFileNames.join(', ') || undefined,
        result.isPricingQuestion
      );
    } catch (error) {
      console.error("Error getting answer:", error);
      
      // Create error message
      const errorMessage = error instanceof Error
        ? `Fehler: ${error.message}. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.`
        : "Entschuldigung, es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.";

      // Update loading message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMessageId
            ? {
                id: msg.id,
                role: "assistant",
                content: errorMessage,
                isLoading: false,
              }
            : msg
        )
      );

      // Save error to backlog as well
      await saveToBacklog(
        userMessage.content,
        errorMessage,
        pdfFileNames.join(', ') || undefined,
        false,
        errorMessage
      );

      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht verarbeitet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div className="flex flex-col h-full max-h-[700px] border border-border/50 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg shadow-black/5">
        {/* PDF Status Section */}
        {pdfFileNames.length > 0 && (
          <div className="border-b border-border p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Aktive Dokumente:
                </span>
                <span className="text-sm font-medium">
                  {pdfFileNames.length === 1 
                    ? pdfFileNames[0]
                    : `${pdfFileNames.length} Dokumente`
                  }
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Check authentication before navigating
                  if (window.confirm('Bitte Passwort eingeben, um Dokumente zu ändern.')) {
                    navigate('/upload');
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                Dokumente ändern
              </Button>
            </div>
          </div>
        )}

        {pdfFileNames.length === 0 && (
          <div className="border-b border-border p-4 bg-muted/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Keine Dokumente hochgeladen
              </p>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (window.confirm('Bitte Passwort eingeben, um PDFs hochzuladen.')) {
                    navigate('/upload');
                  }
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                PDFs hochladen
              </Button>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              isLoading={message.isLoading}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={
                pdfContext && pdfContext.trim().length > 0
                  ? "Stellen Sie eine Frage basierend auf dem PDF-Dokument..."
                  : "Bitte laden Sie zuerst ein PDF-Dokument hoch..."
              }
              className="min-h-[60px] max-h-[200px] resize-none"
              disabled={isLoading || !pdfContext || pdfContext.trim().length === 0}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || !pdfContext || pdfContext.trim().length === 0}
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Enter zum Senden, Shift+Enter für neue Zeile
          </p>
        </div>
      </div>

      {/* Pricing Request Dialog */}
      <PricingRequestDialog
        open={showPricingDialog}
        onOpenChange={setShowPricingDialog}
        question={pendingPricingQuestion}
      />
    </>
  );
};

