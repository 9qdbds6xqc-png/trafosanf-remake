import { PDFUpload } from "@/components/PDFUpload";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PasswordProtection } from "@/components/PasswordProtection";
import { Upload, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { savePDFs, getPDFs } from "@/lib/pdfStorage";
import { isAuthenticated } from "@/lib/auth";

const UploadPage = () => {
  const navigate = useNavigate();
  const [hasPDFs, setHasPDFs] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const pdfs = getPDFs();
    setHasPDFs(pdfs !== null && pdfs.text.length > 0);
  }, []);

  const handlePDFLoaded = (text: string, fileNames: string) => {
    const names = fileNames ? fileNames.split(',').map(n => n.trim()) : [];
    savePDFs(text, names);
    setHasPDFs(text.length > 0);
  };

  const handleContinueToChat = () => {
    navigate('/');
  };

  const pdfs = getPDFs();
  const currentPDFNames = pdfs?.fileNames || [];

  if (!authenticated) {
    return <PasswordProtection onSuccess={() => setAuthenticated(true)} pageName="Upload" />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 flex items-center justify-center">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            PDF-Dokumente hochladen
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Laden Sie ein oder mehrere PDF-Dokumente hoch, um Fragen basierend auf diesen Dokumenten zu stellen.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto space-y-6">
          {/* Upload Component */}
          <div className="border border-border rounded-lg p-6 bg-card">
            <PDFUpload 
              onPDFLoaded={handlePDFLoaded}
              currentPDFNames={currentPDFNames}
            />
          </div>

          {/* Status and Continue Button */}
          {hasPDFs && (
            <div className="border border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    PDF(s) erfolgreich hochgeladen!
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200 mb-4">
                    {currentPDFNames.length === 1 
                      ? `Das Dokument "${currentPDFNames[0]}" ist bereit.`
                      : `${currentPDFNames.length} Dokumente sind bereit: ${currentPDFNames.join(', ')}`
                    }
                  </p>
                  <Button 
                    onClick={handleContinueToChat}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Zum Chat gehen
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="border border-border rounded-lg p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>Tipp:</strong> Sie können mehrere PDF-Dateien gleichzeitig hochladen, 
              indem Sie mehrere Dateien auswählen oder per Drag & Drop hinzufügen. 
              Nach dem Hochladen können Sie zum Chat zurückkehren und Fragen stellen.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UploadPage;

