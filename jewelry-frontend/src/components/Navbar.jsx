import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2">
      <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3 shadow-glass">
        <Link to="/" className="font-display text-lg tracking-wide">
          SVG <span className="text-gold-500">JEWELRY</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-body text-sm tracking-wide transition-colors hover:text-gold-500 ${
                  isActive ? "text-gold-500" : "text-current/80"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden rounded-full p-2 transition-colors hover:bg-gold-500/10 md:block"
            aria-label="Account"
          >
            <User size={18} />
          </Link>
          <button
            className="rounded-full p-2 transition-colors hover:bg-gold-500/10 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 md:hidden">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
            >
              {l.label}
            </NavLink>
          ))}
          <NavLink
            to="/login"
            onClick={() => setOpen(false)}
            className="rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
          >
            Account
          </NavLink>
        </div>
      )}
    </header>
  );
}
