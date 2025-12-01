import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { IntroSection } from "@/components/IntroSection";
import { ProductsSection } from "@/components/ProductsSection";
import { BenefitSection } from "@/components/BenefitSection";
import { ApplicationsSection } from "@/components/ApplicationsSection";
import { SolutionsSection } from "@/components/SolutionsSection";
import { ContactSection } from "@/components/ContactSection";
import { NewsletterSection } from "@/components/NewsletterSection";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import heroImage from "@/assets/hero-lightning.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection imageUrl={heroImage} />
        <IntroSection />
        <ProductsSection />
        <BenefitSection />
        <ApplicationsSection />
        <SolutionsSection />
        <ContactSection />
        <NewsletterSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
