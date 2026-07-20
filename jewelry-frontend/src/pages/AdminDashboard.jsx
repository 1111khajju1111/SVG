import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Upload, Package, Users, IndianRupee, Trash2 } from "lucide-react";
import { getProducts, createProduct, deleteProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import { formatINR } from "../utils/whatsapp";

const emptyForm = {
  name: "",
  category: "Rings",
  metal: "",
  stone: "",
  price: "",
  description: "",
  image: null,
};

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadListings = () => {
    setStatus("loading");
    getProducts()
      .then((data) => {
        setListings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  useEffect(loadListings, []);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setForm({ ...form, image: file || null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.image) {
      setFormError("Please choose an image for this piece.");
      return;
    }

    setSubmitting(true);
    try {
      const created = await createProduct(token, form);
      setListings([created, ...listings]);
      setForm(emptyForm);
      e.target.reset();
    } catch (err) {
      setFormError(err.message || "Couldn't add this piece. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = listings;
    setListings(listings.filter((p) => p.id !== id));
    try {
      await deleteProduct(token, id);
    } catch (err) {
      setListings(previous); // roll back on failure
      alert(err.message || "Couldn't delete this piece.");
    }
  };

  const stats = [
    { icon: Package, label: "Listings", value: status === "ready" ? listings.length : "—" },
    { icon: Users, label: "Signups", value: "—" },
    { icon: IndianRupee, label: "Enquiries", value: "—" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Admin
      </p>
      <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-current/60">Signed in as {user?.name}</p>

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

          {formError && (
            <p className="mb-4 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {formError}
            </p>
          )}

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
              {["Rings", "Necklaces", "Earrings", "Bracelets","god's jewelry"].map((c) => (
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
              min="0"
              step="1"
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
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-gold-500 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting ? "Uploading…" : "Add to catalog"}
          </button>
        </motion.form>

        <div className="glass rounded-3xl p-4 shadow-glass">
          <h2 className="mb-4 px-2 font-display text-xl">Current listings</h2>

          {status === "loading" && (
            <p className="px-2 py-6 text-sm text-current/50">Loading…</p>
          )}
          {status === "error" && (
            <p className="px-2 py-6 text-sm text-current/50">
              Couldn't load listings. <button onClick={loadListings} className="underline">Retry</button>
            </p>
          )}
          {status === "ready" && listings.length === 0 && (
            <p className="px-2 py-6 text-sm text-current/50">Nothing listed yet.</p>
          )}

          {status === "ready" && listings.length > 0 && (
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
                  <p className="font-mono text-sm text-gold-500">{formatINR(p.price)}</p>
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="ml-1 text-current/40 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
