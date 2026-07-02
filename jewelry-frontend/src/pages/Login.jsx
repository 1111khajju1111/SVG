import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire to Spring Boot /api/auth/login once backend is ready
    console.log("login submit", form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.form
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="glass w-full max-w-md rounded-3xl p-8 shadow-glass"
      >
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gold-500">
          Welcome back
        </p>
        <h1 className="mt-2 font-display text-3xl">Sign in</h1>

        <div className="mt-8 flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="glass rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-current/40 focus:border-gold-500"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="glass rounded-xl bg-transparent px-4 py-3 text-sm outline-none placeholder:text-current/40 focus:border-gold-500"
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-gold-500 py-3 font-mono text-xs uppercase tracking-widest text-ink-950 transition-transform hover:scale-[1.01]"
        >
          Sign in
        </button>

        <p className="mt-6 text-center text-xs text-current/60">
          New here?{" "}
          <Link to="/signup" className="text-gold-500 underline">
            Create an account
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
