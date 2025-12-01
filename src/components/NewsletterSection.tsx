import { ProductCard } from "./ProductCard";

const items = [
  {
    imageUrl: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=550&h=331&fit=crop",
    title: "Werde regelmäßig informiert",
    linkText: "Newsletteranmeldung",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=550&h=331&fit=crop",
    title: "Kontaktiere uns persönlich",
    linkText: "Kontakt aufnehmen",
  },
  {
    imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=550&h=331&fit=crop",
    title: "Aktuelle Infos auf LinkedIn",
    linkText: "FSM-LinkedIn-Profil",
  },
];

export const NewsletterSection = () => {
  return (
    <section className="fsm-section">
      <div className="fsm-container">
        <h2 className="fsm-heading">Bleibe informiert!</h2>
        <p className="fsm-text mb-10">
          Ob Produktneuheiten, Fachmessen oder spannende Einblicke in unsere Arbeit – so verpasst du nichts:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <ProductCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};
