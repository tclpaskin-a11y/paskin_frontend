import { FeaturedProducts } from "@/components/site/FeaturedProducts";
import { SeaBuckthornVideo } from "@/components/site/SeaBuckthornVideo";
import { useEffect } from "react";

export default function AboutPage() {
  useEffect(() => {
    document.title = "About PASKIN — Our Herbal Story";
  }, []);

  return (
    <div className="pt-20">
      <SeaBuckthornVideo />
      <FeaturedProducts />
    </div>
  );
}
