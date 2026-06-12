import { Award, Truck, Map, Handshake } from "lucide-react";
import { Link } from "react-router-dom";

export function PartnerBanner() {
  return (
    <section className="container mx-auto px-6 mb-24">
      <div className="bg-[#1B4332] rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 text-white shadow-elegant relative overflow-hidden">
        {/* Abstract Background Detail */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />

        <div className="max-w-md">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-4">
            Partner with Paskin
          </h2>
          <p className="text-white/80 text-lg">
            We are open for distribution, institutional supply and business collaborations.
          </p>
          <br />
          <p className="text-white/80 text-lg">
            <span className="font-bold">Email:</span> Paskin.info@gmail.com
            <br />
            <span className="font-bold">Phone:</span> +91 9582824383
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-10 lg:gap-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium">Premium Quality</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium">Timely Delivery</span>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Map className="h-6 w-6 text-white" />
            </div>
            <span className="text-sm font-medium">Pan India Network</span>
          </div>

          <Link
            to="/partner"
            className="flex items-center gap-3 bg-[#D4A373] hover:bg-[#C08E5F] text-[#1B4332] px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
          >
            <Handshake className="h-5 w-5" />
            Partner With Us
          </Link>
        </div>
      </div>
    </section>
  );
}
