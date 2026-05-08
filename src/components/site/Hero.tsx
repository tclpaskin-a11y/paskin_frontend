import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import hero1 from "@/assets/hero-1.png";
import hero2 from "@/assets/hero-2.png";
import hero3 from "@/assets/hero-3.png";
import heroBerries from "@/assets/hero-berries.png";

type Slide = { type: "image"; src: string };

const slides: Slide[] = [
  { type: "image", src: heroBerries },
  { type: "image", src: hero1 },
  { type: "image", src: hero2 },


];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative h-[60vh] min-h-[600px] w-full overflow-hidden mt-[76px]">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[700ms] ease-in-out ${i === active ? "opacity-100" : "opacity-0"
            }`}
        >
          <img
            src={slide.src}
            alt=""
            className="h-full w-full object-cover scale-100 transition-transform duration-[10s] ease-linear"
            style={{ transform: i === active ? 'scale(1.1)' : 'scale(1)' }}
            width={1920}
            height={1080}
          />
        </div>
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/30 to-foreground/70" />

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col justify-center max-w-4xl">


        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium text-background mt-6 leading-[1.05] text-balance animate-fade-up">
          Pure Herbal Wellness
          <span className="block italic font-light text-accent"> for a better life.</span>
        </h1>

        <p className="text-background/85 text-lg md:text-xl mt-6 max-w-xl animate-fade-up [animation-delay:120ms]">
          100% Organic. Trusted Ayurvedic care, hand-crafted from the purest
          botanicals nature has to offer.
        </p>

        <div className="flex flex-wrap gap-3 mt-10 animate-fade-up [animation-delay:240ms]">
          <a
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold hover:bg-primary-glow transition shadow-elegant"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>

        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-6 right-6 container mx-auto flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${i === active ? "w-12 bg-background" : "w-6 bg-background/40"
                }`}
            />
          ))}
        </div>
      </div>
    </section >
  );
}
