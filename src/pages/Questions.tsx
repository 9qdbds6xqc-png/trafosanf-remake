import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageCircle } from "lucide-react";

const Questions = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 flex items-center justify-center">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Sprich mit unserem Produkt
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Stelle technische oder allgemeine Fragen, um mehr über unser Produkt herauszufinden. Wenn sie mehr wissen wo
          </p>
        </div>

        {/* Chat Interface */}
        <div className="w-full">
          <ChatInterface />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Questions;

