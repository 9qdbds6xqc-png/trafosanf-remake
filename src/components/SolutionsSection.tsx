import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const SolutionsSection = () => {
  return (
    <section id="kundenloesungen" className="fsm-section">
      <div className="fsm-container">
        <h2 className="fsm-heading">Kundenlösungen</h2>
        <p className="fsm-text max-w-4xl mb-8">
          Unsere Kundenlösungen sind so vielfältig wie deine Herausforderungen. Ob es um die Integration 
          unserer Trafosanfteinschalter in bestehende Systeme geht oder um die Entwicklung maßgeschneiderter 
          Lösungen für spezielle Anwendungen – wir stehen dir mit unserem Know-how zur Seite. Durch enge 
          Zusammenarbeit und umfassende Beratung entwickeln wir Lösungen, die deine Anforderungen optimal 
          erfüllen und dir einen echten Mehrwert bieten. Unsere langjährige Erfahrung und unser Engagement 
          für Qualität und Innovation machen uns zum idealen Partner für deine Projekte.
        </p>

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Zu unseren Kundenlösungen
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};
