import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Package, Users, IndianRupee } from "lucide-react";
import { products as seedProducts } from "../data/products";

const stats = [
  { icon: Package, label: "Listings", value: seedProducts.length },
  { icon: Users, label: "Signups", value: "\u2014" },
  { icon: IndianRupee, label: "Enquiries", value: "\u2014" },
];

export default function AdminDashboard() {
  const [form, setForm] = useState({
    name: "",
    category: "Rings",
    metal: "",
    stone: "",
    price: "",
    description: "",
    image: null,
  });
  const [listings, setListings] = useState(seedProducts);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setForm({ ...form, image: file || null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: multipart POST to Spring Boot /api/admin/products once backend is ready
    const preview = form.image ? URL.createObjectURL(form.image) : seedProducts[0].image;
    const newProduct = {
      id: `draft-${Date.now()}`,
      name: form.name || "Untitled piece",
      category: form.category,
      metal: form.metal,
      stone: form.stone,
      price: Number(form.price) || 0,
      description: form.description,
      image: preview,
    };
    setListings([newProduct, ...listings]);
    setForm({ name: "", category: "Rings", metal: "", stone: "", price: "", description: "", image: null });
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Admin
      </p>
      <h1 className="mt-2 font-display text-4xl">Dashboard</h1>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass flex items-center gap-4 rounded-2xl p-5">
            <Icon size={22} className="text-gold-500" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                {label}
              </p>
              <p className="font-display text-2xl">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass h-fit rounded-3xl p-6 shadow-glass"
        >
          <h2 className="mb-4 font-display text-xl">Upload a new model</h2>

          <div className="flex flex-col gap-3">
            <input
              placeholder="Piece name"
              value={form.name}
              onChange={handleChange("name")}
              required
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
            />
            <select
              value={form.category}
              onChange={handleChange("category")}
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none"
            >
              {["Rings", "Necklaces", "Earrings", "Bracelets"].map((c) => (
                <option key={c} value={c} className="bg-ink-900">
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="Metal (e.g. 18k Yellow Gold)"
              value={form.metal}
              onChange={handleChange("metal")}
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
            />
            <input
              placeholder="Stone"
              value={form.stone}
              onChange={handleChange("stone")}
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
            />
            <input
              type="number"
              placeholder="Price (INR)"
              value={form.price}
              onChange={handleChange("price")}
              required
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
            />
            <textarea
              placeholder="Description"
              rows={3}
              value={form.description}
              onChange={handleChange("description")}
              className="glass rounded-xl bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-current/40"
            />
            <label className="glass flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs text-current/60 hover:text-gold-500">
              <Upload size={16} />
              {form.image ? form.image.name : "Upload model image"}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            className="mt-5 w-full rounded-full bg-gold-500 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01]"
          >
            Add to catalog
          </button>
        </motion.form>

        <div className="glass rounded-3xl p-4 shadow-glass">
          <h2 className="mb-4 px-2 font-display text-xl">Current listings</h2>
          <div className="flex flex-col divide-y divide-current/10">
            {listings.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-2 py-3">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm">{p.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                    {p.category}
                  </p>
                </div>
                <p className="font-mono text-sm text-gold-500">
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                  }).format(p.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
