interface HeroSectionProps {
  imageUrl: string;
}

export const HeroSection = ({ imageUrl }: HeroSectionProps) => {
  return (
    <section className="relative">
      <div className="fsm-container py-6">
        <div className="relative overflow-hidden rounded-sm">
          <img
            src={imageUrl}
            alt="Trafosanfteinschalter - Elektrische Energie"
            className="w-full h-[300px] md:h-[450px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};
