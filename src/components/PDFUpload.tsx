import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { extractTextFromPDF } from "@/lib/pdfExtractor";
import { savePDFs } from "@/lib/pdfStorage";

interface PDFUploadProps {
  onPDFLoaded: (text: string, fileName: string) => void;
  currentPDFNames?: string[];
  className?: string;
}

export const PDFUpload = ({ onPDFLoaded, currentPDFNames = [], className }: PDFUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; text: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync uploadedFiles with currentPDFNames from parent
  useEffect(() => {
    if (currentPDFNames.length === 0 && uploadedFiles.length > 0) {
      setUploadedFiles([]);
    }
  }, [currentPDFNames]);

  const handleFile = async (file: File, existingFiles: { name: string; text: string }[] = []): Promise<{ name: string; text: string } | null> => {
    if (file.type !== "application/pdf") {
      setError("Bitte wählen Sie eine PDF-Datei aus.");
      return null;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`${file.name} ist zu groß. Maximum: 10MB`);
      return null;
    }

    setError(null);

    try {
      const text = await extractTextFromPDF(file);
      
      if (!text || text.trim().length === 0) {
        setError(`${file.name} konnte nicht gelesen werden oder ist leer.`);
        return null;
      }

      return { name: file.name, text };
    } catch (err) {
      console.error("Error processing PDF:", err);
      setError(
        err instanceof Error 
          ? `${file.name}: ${err.message}` 
          : `Fehler beim Verarbeiten von ${file.name}. Bitte versuchen Sie es erneut.`
      );
      return null;
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      f => f.type === "application/pdf"
    );
    
    if (files.length === 0) {
      setError("Bitte wählen Sie PDF-Dateien aus.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const processedFiles: { name: string; text: string }[] = [...uploadedFiles];
      
      for (const file of files) {
        const result = await handleFile(file, processedFiles);
        if (result) {
          processedFiles.push(result);
        }
      }

      if (processedFiles.length > uploadedFiles.length) {
        setUploadedFiles(processedFiles);
        const combinedText = processedFiles.map(f => f.text).join('\n\n---\n\n');
        const combinedNames = processedFiles.map(f => f.name).join(', ');
        onPDFLoaded(combinedText, combinedNames);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      f => f.type === "application/pdf"
    );
    
    if (files.length === 0) {
      setError("Bitte wählen Sie PDF-Dateien aus.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const processedFiles: { name: string; text: string }[] = [...uploadedFiles];
      
      for (const file of files) {
        const result = await handleFile(file, processedFiles);
        if (result) {
          processedFiles.push(result);
        }
      }

      if (processedFiles.length > uploadedFiles.length) {
        setUploadedFiles(processedFiles);
        const combinedText = processedFiles.map(f => f.text).join('\n\n---\n\n');
        const combinedNames = processedFiles.map(f => f.name).join(', ');
        onPDFLoaded(combinedText, combinedNames);
      }
    } finally {
      setIsProcessing(false);
      // Reset file input to allow selecting same files again
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const handleRemove = (fileNameToRemove?: string) => {
    if (fileNameToRemove) {
      // Remove specific file
      const updatedFiles = uploadedFiles.filter(f => f.name !== fileNameToRemove);
      setUploadedFiles(updatedFiles);
      
      if (updatedFiles.length === 0) {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        savePDFs("", []);
        onPDFLoaded("", "");
      } else {
        const combinedText = updatedFiles.map(f => f.text).join('\n\n---\n\n');
        const combinedNames = updatedFiles.map(f => f.name).join(', ');
        const namesArray = combinedNames ? combinedNames.split(',').map(n => n.trim()) : [];
        savePDFs(combinedText, namesArray);
        onPDFLoaded(combinedText, combinedNames);
      }
    } else {
      // Remove all files
      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      savePDFs("", []);
      onPDFLoaded("", "");
    }
    setError(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {currentPDFNames && currentPDFNames.length > 0 ? (
        <div className="space-y-2">
          {currentPDFNames.map((fileName, index) => (
            <div key={index} className="flex items-center gap-2 p-3 border border-border rounded-md bg-muted/50">
              <FileText className="h-4 w-4 text-accent flex-shrink-0" />
              <span className="text-sm flex-1 truncate">{fileName}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleRemove(fileName)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {currentPDFNames.length > 1 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleRemove()}
            >
              Alle PDFs entfernen
            </Button>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-accent bg-accent/5"
              : "border-muted-foreground/25 hover:border-accent/50",
            isProcessing && "opacity-50 cursor-not-allowed"
          )}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={isProcessing}
          />

          {isProcessing ? (
            <>
              <Loader2 className="h-8 w-8 mx-auto mb-2 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground">
                PDF wird verarbeitet...
              </p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                PDF-Dokument(e) hochladen
              </p>
              <p className="text-xs text-muted-foreground">
                Klicken Sie hier oder ziehen Sie PDF-Dateien hinein
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Mehrere PDFs möglich • Maximal 10MB pro Datei
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};

