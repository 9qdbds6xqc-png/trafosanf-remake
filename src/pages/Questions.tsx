import { ChatInterface } from "@/components/ChatInterface";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MessageCircle, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const Questions = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent)/0.08),transparent_50%)]" />
      
      {/* Cursor glow effect */}
      <div 
        className="pointer-events-none fixed h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-3xl transition-all duration-500 ease-out" 
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`
        }} 
      />

      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <div className="flex flex-col items-center mb-12 fade-in">
          {/* Icon */}
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <div className="relative bg-gradient-to-br from-primary/20 to-accent/20 p-4 rounded-2xl border border-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="mb-6 text-4xl font-light tracking-tight sm:text-5xl md:text-6xl text-center bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
            Sprich mit unserem Produkt
          </h1>

          {/* Description */}
          <p className="text-muted-foreground text-center max-w-3xl text-lg leading-relaxed font-light">
            Stellen Sie technische oder allgemeine Fragen, um mehr über unser Produkt zu erfahren. 
            <span className="block mt-3 text-base">
              Wenn Sie anschließend Kontakt aufnehmen möchten, schreiben Sie einfach, dass Sie eine Nachricht versenden wollen. 
              Unser Kundendienst erhält dann automatisch den Kontext dieser Unterhaltung und kann ein passendes Angebot für Sie vorbereiten.
            </span>
          </p>
        </div>

        {/* Chat Interface */}
        <div className="w-full fade-in-delay">
          <ChatInterface />
        </div>
      </main>
      <Footer />
      
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Questions;

