import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Package,
  Users,
  MessageSquare,
  Trash2,
  Pencil,
  X,
  Inbox,
} from "lucide-react";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { getAdminStats, getEnquiries, deleteEnquiry } from "../api/admin";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { formatINR } from "../utils/whatsapp";

const CATEGORIES = ["Rings", "Necklaces", "Earrings", "Bracelets", "God's Jewelry"];

const emptyForm = {
  name: "",
  category: "Rings",
  metal: "",
  stone: "",
  price: "",
  description: "",
  image: null,
};

const ENQUIRY_LABELS = {
  PRODUCT: { label: "Product ask", tone: "text-gold-500" },
  ORDER: { label: "WhatsApp order", tone: "text-gold-500" },
  CONTACT: { label: "Contact form", tone: "text-gold-500" },
};

function timeAgo(iso) {
  if (!iso) return "";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AdminDashboard() {
  const { token, user } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading");

  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesStatus, setEnquiriesStatus] = useState("loading");

  const loadListings = () => {
    setStatus("loading");
    getProducts()
      .then((data) => {
        setListings(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  };

  const loadStats = () => {
    setStatsStatus("loading");
    getAdminStats(token)
      .then((data) => {
        setStats(data);
        setStatsStatus("ready");
      })
      .catch(() => setStatsStatus("error"));
  };

  const loadEnquiries = () => {
    setEnquiriesStatus("loading");
    getEnquiries(token)
      .then((data) => {
        setEnquiries(data);
        setEnquiriesStatus("ready");
      })
      .catch(() => setEnquiriesStatus("error"));
  };

  useEffect(() => {
    loadListings();
    loadStats();
    loadEnquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    setForm({ ...form, image: file || null });
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      category: product.category || "Rings",
      metal: product.metal || "",
      stone: product.stone || "",
      price: String(product.price ?? ""),
      description: product.description || "",
      image: null,
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!editingId && !form.image) {
      setFormError("Please choose an image for this piece.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const updated = await updateProduct(token, editingId, form);
        setListings(listings.map((p) => (p.id === editingId ? updated : p)));
        showToast("Listing updated.", "success");
        cancelEdit();
      } else {
        const created = await createProduct(token, form);
        setListings([created, ...listings]);
        setForm(emptyForm);
        showToast("Added to the catalog.", "success");
        loadStats();
      }
      e.target.reset();
    } catch (err) {
      const message = err.message || "Couldn't save this piece. Try again.";
      setFormError(message);
      showToast(message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const previous = listings;
    setListings(listings.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
    try {
      await deleteProduct(token, id);
      showToast("Listing removed.", "success");
      loadStats();
    } catch (err) {
      setListings(previous); // roll back on failure
      showToast(err.message || "Couldn't delete this piece.", "error");
    }
  };

  const handleDeleteEnquiry = async (id) => {
    const previous = enquiries;
    setEnquiries(enquiries.filter((en) => en.id !== id));
    try {
      await deleteEnquiry(token, id);
      loadStats();
    } catch (err) {
      setEnquiries(previous);
      showToast(err.message || "Couldn't remove this enquiry.", "error");
    }
  };

  const categoryOptions =
    form.category && !CATEGORIES.includes(form.category)
      ? [...CATEGORIES, form.category]
      : CATEGORIES;

  const statTiles = [
    {
      icon: Package,
      label: "Listings",
      value: statsStatus === "ready" ? stats.listings : status === "ready" ? listings.length : "—",
    },
    { icon: Users, label: "Signups", value: statsStatus === "ready" ? stats.signups : "—" },
    { icon: MessageSquare, label: "Enquiries", value: statsStatus === "ready" ? stats.enquiries : "—" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
        Admin
      </p>
      <h1 className="mt-2 font-display text-4xl">Dashboard</h1>
      <p className="mt-1 text-sm text-current/60">Signed in as {user?.name}</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statTiles.map(({ icon: Icon, label, value }) => (
          <div key={label} className="glass flex items-center gap-4 rounded-2xl p-5">
            <Icon size={22} className="text-gold-500" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-current/50">
                {label}
              </p>
              {value === "—" && statsStatus === "error" ? (
                <button onClick={loadStats} className="font-display text-sm underline text-current/60">
                  Retry
                </button>
              ) : (
                <p className="font-display text-2xl">{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      {statsStatus === "error" && (
        <p className="mt-2 text-xs text-current/40">
          Some stats couldn't load — this can happen if the admin session needs refreshing.
        </p>
      )}

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="glass h-fit rounded-3xl p-6 shadow-glass"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">
              {editingId ? "Edit model" : "Upload a new model"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                aria-label="Cancel edit"
                className="text-current/40 hover:text-current/70"
              >
                <X size={16} />
              </button>
            )}
          </div>

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
              {categoryOptions.map((c) => (
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
              {form.image
                ? form.image.name
                : editingId
                ? "Replace image (optional)"
                : "Upload model image"}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={handleImage} className="hidden" />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 w-full rounded-full bg-gold-500 py-2.5 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {submitting
              ? editingId
                ? "Saving…"
                : "Uploading…"
              : editingId
              ? "Save changes"
              : "Add to catalog"}
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
                    loading="lazy"
                    decoding="async"
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
                    onClick={() => startEdit(p)}
                    aria-label={`Edit ${p.name}`}
                    className="ml-1 text-current/40 hover:text-gold-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                    className="text-current/40 hover:text-red-400"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Enquiries — every product ask, WhatsApp order, and contact-form
          message lands here, so this stat is never a guess. */}
      <div className="glass mt-8 rounded-3xl p-4 shadow-glass">
        <h2 className="mb-4 px-2 font-display text-xl">Recent enquiries</h2>

        {enquiriesStatus === "loading" && (
          <p className="px-2 py-6 text-sm text-current/50">Loading…</p>
        )}
        {enquiriesStatus === "error" && (
          <p className="px-2 py-6 text-sm text-current/50">
            Couldn't load enquiries. <button onClick={loadEnquiries} className="underline">Retry</button>
          </p>
        )}
        {enquiriesStatus === "ready" && enquiries.length === 0 && (
          <div className="flex flex-col items-center gap-2 px-2 py-10 text-center">
            <Inbox size={28} className="text-current/30" />
            <p className="text-sm text-current/50">
              No enquiries yet — product asks, WhatsApp orders, and contact-form
              messages will show up here.
            </p>
          </div>
        )}
        {enquiriesStatus === "ready" && enquiries.length > 0 && (
          <div className="flex flex-col divide-y divide-current/10">
            <AnimatePresence initial={false}>
              {enquiries.map((en) => {
                const meta = ENQUIRY_LABELS[en.type] || { label: en.type, tone: "text-current/60" };
                return (
                  <motion.div
                    key={en.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-4 px-2 py-3"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`font-mono text-[10px] uppercase tracking-widest ${meta.tone}`}>
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-current/40">{timeAgo(en.createdAt)}</span>
                      </div>
                      {en.productName && (
                        <p className="mt-1 text-sm">{en.productName}</p>
                      )}
                      {(en.customerName || en.customerContact) && (
                        <p className="mt-0.5 text-xs text-current/60">
                          {[en.customerName, en.customerContact].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {en.message && (
                        <p className="mt-1 text-xs text-current/50">{en.message}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteEnquiry(en.id)}
                      aria-label="Dismiss enquiry"
                      className="mt-1 text-current/30 hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
