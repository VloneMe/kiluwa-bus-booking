import { BusSearchForm } from "../bus/BusSearchForm";
import { HeroSlides } from "./slides";

export const HeroSection = () => {
  return (
    <section className="home-hero" aria-label="Utangulizi na utafutaji wa safari">
      <div className="home-hero__slides">
        <HeroSlides />
      </div>
      <div className="home-hero__search">
        <BusSearchForm />
      </div>
    </section>
  );
};
