import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="relative">
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920&h=600&fit=crop"
          alt="FSM AG Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="fsm-container">
            <div className="max-w-2xl text-white">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                FSM | Wir stellen uns vor
              </h2>
              <p className="text-white/90 leading-relaxed mb-8">
                Die FSM AG entwickelt und produziert intelligente Elektronik. Wir unterstützen unsere 
                Kunden mit elektronischen Lösungen in den Disziplinen Batterie-Management-Systeme, 
                Messtechnik und Trafosanfteinschalter sowie im Bereich der Entwicklungs- und 
                Fertigungsdienstleistung für elektronische Komponenten (E²MS). Unsere Arbeiten sind 
                meist kundenspezifische Ausführungen und werden Teil eines Endprodukts.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Mehr Infos in unserer Broschüre
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-foreground">
                  Über uns
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
