import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const IntroSection = () => {
  return (
    <section className="fsm-section">
      <div className="fsm-container">
        <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-8">
          Trafosanfteinschalter
        </h1>

        <div className="max-w-4xl space-y-6">
          <p className="fsm-text text-lg">
            Seit über 25 Jahren entwickeln und fertigen wir Trafosanfteinschalter für die Forschung 
            sowie für medizinische und industrielle Anwendungen. Von einfachen Einphasen-Transformatoren, 
            bis hin zu großen Drehstrom­transformatoren, die Einsatzgebiete für unsere Trafoschaltrelais 
            sind aufgrund der verschiedenen Transformatorentypen und deren unterschiedlichen Lasten sehr vielseitig.
          </p>

          <p className="fsm-text text-lg">
            Durch Verwendung des von uns entwickelten Sanft-Einschalt-Verfahrens können ein oder mehrere 
            Einphasen-Transformatoren im Leerlauf oder unter Last, ohne Einschaltstromstoß (sog. Inrush current) 
            eingeschaltet werden.
          </p>

          <p className="fsm-text text-lg">
            Mit unserer langjährigen Erfahrung in der Entwicklung und Fertigung von Trafosanfteinschaltern 
            sind wir besonders stark in der Durchführung kundenspezifischer Projekte für hohe Ansprüche. 
            Agile Projektteams, eine flexible Fertigung, sowie eine ausgeprägte Kundenorientierung sind dabei 
            die Basis für eine schnelle, prozesssichere und hochqualitative Umsetzung deiner Anforderungen.
          </p>

          <p className="fsm-text text-lg">
            Für medizinische Geräte verfügen unsere Trafoschaltrelais optional über die sogenannte 
            Halbwellenausfallerkennung gemäß der <strong className="text-foreground">EN 61000-4-11</strong>.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            Individuelle Beratung zu deinem Projekt:
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Jetzt Kontakt aufnehmen!
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Zu unserer TSR-Broschüre
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
