import { Mail, Phone, MapPin } from "lucide-react";

export function ContactCTA() {
  return (
    <section id="contact" className="py-24 container mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-start bg-card rounded-3xl border border-border p-8 md:p-14 shadow-soft">
        <div>
          <p className="text-primary text-sm uppercase tracking-[0.2em] mb-3">Get in touch</p>
          <h2 className="font-display text-4xl md:text-5xl font-medium leading-tight text-balance">
            We'd love to hear from you.
          </h2>
          <p className="text-muted-foreground mt-5 leading-relaxed">
            Questions about a product, an order, or our herbal philosophy? Our
            care team replies within 24 hours.
          </p>

          <ul className="mt-8 space-y-4">
            <li className="flex items-center gap-4">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-secondary text-primary"><Phone className="h-4 w-4" /></span>
              <span className="text-sm">+91 9582824383</span>
            </li>
            <li className="flex items-center gap-4">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-secondary text-primary"><Mail className="h-4 w-4" /></span>
              <span className="text-sm">Paskin.info@gmail.com</span>
            </li>

          </ul>
        </div>

        <form className="space-y-4">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</label>
            <input type="text" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary transition" placeholder="Your name" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
            <input type="email" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary transition" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Message</label>
            <textarea rows={5} className="mt-1.5 w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:border-primary transition resize-none" placeholder="How can we help?" />
          </div>
          <button type="submit" className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-glow transition shadow-soft">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
