import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, AtSign, Send, Check } from "lucide-react";
import { owner } from "../data/owner";
import { logEnquiry } from "../api/enquiries";
import { useToast } from "../context/ToastContext";

const items = [
  { icon: Mail, label: "Email", value: owner.email, href: `mailto:${owner.email}` },
  { icon: Phone, label: "Phone", value: owner.phone, href: `tel:${owner.phone}` },
  { icon: MapPin, label: "Studio", value: owner.location, href: null },
  { icon: AtSign, label: "Instagram", value: owner.instagram, href: "#" },
];

const emptyForm = { name: "", contact: "", message: "" };

export default function ContactSection() {
  const { showToast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitting(true);
    await logEnquiry({
      type: "CONTACT",
      customerName: form.name,
      customerContact: form.contact,
      message: form.message,
    });
    setSubmitting(false);
    setSent(true);
    setForm(emptyForm);
    showToast("Message sent — the studio will get back to you soon.", "success");
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 py-24">
      <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Get in touch
      </p>
      <h2 className="mb-10 font-display text-3xl sm:text-4xl">
        Visit the studio, or write to us
      </h2>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass flex h-fit flex-col gap-3 rounded-2xl p-5"
        >
          <h3 className="mb-1 font-display text-lg">Send a message</h3>
          <input
            placeholder="Your name"
            value={form.name}
            onChange={handleChange("name")}
            className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
          />
          <input
            placeholder="Email or phone"
            value={form.contact}
            onChange={handleChange("contact")}
            className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
          />
          <textarea
            placeholder="What are you looking for?"
            rows={3}
            required
            value={form.message}
            onChange={handleChange("message")}
            className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
          />
          <button
            type="submit"
            disabled={submitting}
            className={`mt-1 flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-mono text-xs uppercase tracking-widest transition-transform hover:scale-[1.01] disabled:opacity-60 ${
              sent ? "bg-gold-300 text-ink-950" : "bg-gold-500 text-ink-950"
            }`}
          >
            {sent ? <Check size={14} /> : <Send size={14} />}
            {submitting ? "Sending…" : sent ? "Sent" : "Send message"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
