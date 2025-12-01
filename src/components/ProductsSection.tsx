import { ProductCard } from "./ProductCard";

const products = [
  {
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=550&h=331&fit=crop",
    title: "Für 1-Phasen Trafos bis 32 A Nennstrom",
    linkText: "Zum Produkt TSRL",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=550&h=331&fit=crop",
    title: "Für 1-Phasen Trafos mit externem Stellglied",
    linkText: "Zum Produkt TSRLF",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?w=550&h=331&fit=crop",
    title: "Ohne Gehäuse, kompakte Bauweise",
    linkText: "Zum Produkt TSR01",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=550&h=331&fit=crop",
    title: "Hoher Inrush und spezielle Anforderungen?",
    linkText: "Zu den Kundenlösungen",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=550&h=331&fit=crop",
    title: "Für 3-Phasen Trafos bis 50 A Nennstrom",
    linkText: "Zum Produkt TSRD",
  },
];

export const ProductsSection = () => {
  return (
    <section id="produkte" className="fsm-section bg-secondary">
      <div className="fsm-container">
        <h2 className="fsm-heading">Übersicht unserer TSR-Produkte</h2>
        <p className="fsm-text max-w-3xl mb-10">
          Durch Verwendung des von uns entwickelten Sanft-Einschalt-Verfahrens können ein oder mehrere 
          Einphasen-Transformatoren im Leerlauf oder unter Last, ohne Einschaltstrom (Inrush) eingeschaltet werden. 
          Unser Produktportfolio umfasst:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};
