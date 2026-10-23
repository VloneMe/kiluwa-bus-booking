import { BusRoutes } from "@/components/bus/BusRoutes";
import { HeroSection } from "@/components/heroSection";
import { Instructions } from "@/components/instructions";
import { CTASection } from "@/components/mainsection/CTASection";
import { FeaturesSection } from "@/components/mainsection/FeaturesSection";
import { PopularDestinationsSection } from "@/components/mainsection/PopularDestinationsSection";
import { PopularRoutesSection } from "@/components/mainsection/PopularRoutesSection";
import { TestimonialsSection } from "@/components/mainsection/TestimonialsSection";

export const Home = () => {
  return (
    <div className="home-page home-page--mobile-comfort">
      <a href="#mabasi-leo" className="home-skip-link">
        Ruka hadi mabasi ya leo
      </a>

      <HeroSection />

      <div className="home-page__content">
        <section
          id="mabasi-leo"
          className="home-page__routes-region"
          aria-label="Mabasi yanayoendesha leo"
        >
          <BusRoutes />
        </section>

        <div className="home-page__section-band">
          <Instructions />
        </div>

        <div hidden className="home-page__section-band home-page__section-band--alt">
          <FeaturesSection />
        </div>

        <div hidden className="home-page__section-band">
          <PopularRoutesSection />
        </div>

        <div hidden className="home-page__section-band home-page__section-band--alt">
          <PopularDestinationsSection />
        </div>

        <div hidden className="home-page__section-band">
          <TestimonialsSection />
        </div>

        <div className="home-page__section-band home-page__section-band--alt">
          <CTASection />
        </div>
      </div>
    </div>
  );
};
