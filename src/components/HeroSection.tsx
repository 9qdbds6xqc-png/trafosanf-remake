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
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/20 via-black/40 to-black/60">
            <div className="text-center space-y-3 px-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/70">Special Highlight</p>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-amber-300 via-pink-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.35)]">
                  Hello World!
                </span>
              </h1>
              <p className="text-white/80 max-w-2xl mx-auto text-base md:text-lg">
                Eine funkelnde Botschaft, die Innovation und Neugier verbindet – elegant präsentiert mit leuchtendem Glanz.
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent animate-pulse" />
                <span className="h-1 w-16 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse delay-150" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
