import { Mail, Phone, MapPin, AtSign } from "lucide-react";
import { owner } from "../data/products";

const items = [
  { icon: Mail, label: "Email", value: owner.email, href: `mailto:${owner.email}` },
  { icon: Phone, label: "Phone", value: owner.phone, href: `tel:${owner.phone}` },
  { icon: MapPin, label: "Studio", value: owner.location, href: null },
  { icon: AtSign, label: "Instagram", value: owner.instagram, href: "#" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Get in touch
      </p>
      <h2 className="mb-10 font-display text-3xl sm:text-4xl">
        Visit the studio, or write to us
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value, href }) => {
          const content = (
            <div className="glass flex h-full flex-col gap-3 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1">
              <Icon size={20} className="text-gold-500" />
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                  {label}
                </p>
                <p className="mt-1 text-sm">{value}</p>
              </div>
            </div>
          );
          return href ? (
            <a key={label} href={href}>
              {content}
            </a>
          ) : (
            <div key={label}>{content}</div>
          );
        })}
      </div>
    </section>
  );
}
