import { ProductCard } from "./ProductCard";

const applications = [
  {
    imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=550&h=331&fit=crop",
    title: "Medizintechnik",
    linkText: "Zur Anwendung Medizintechnik",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=550&h=331&fit=crop",
    title: "Trafobauer",
    linkText: "Zur Anwendung Trafobauer",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=550&h=331&fit=crop",
    title: "Kundenspezifische Lösungen",
    linkText: "Zu den kundenspezifischen Lösungen",
  },
];

export const ApplicationsSection = () => {
  return (
    <section id="anwendungen" className="fsm-section bg-secondary">
      <div className="fsm-container">
        <h2 className="fsm-heading">Anwendungen</h2>
        <p className="fsm-text max-w-4xl mb-10">
          FSM AG entwickelt und produziert hochwertige Trafosanfteinschalter (TSR), die in vielfältigen 
          Anwendungen eine zuverlässige und effiziente Energieversorgung gewährleisten. Die Trafosanfteinschalter 
          der FSM AG kommen in verschiedensten Anwendungen zum Einsatz, insbesondere in der Medizintechnik 
          und im Transformatorenbau. Entdecke, wie unsere Lösungen die Leistung und Sicherheit deiner 
          Systeme verbessern können:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app, index) => (
            <ProductCard key={index} {...app} />
          ))}
        </div>
      </div>
    </section>
  );
};
