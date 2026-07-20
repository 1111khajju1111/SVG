import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate("/");
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 w-[92%] max-w-5xl -translate-x-1/2">
      <nav className="glass flex items-center justify-between rounded-2xl px-5 py-3 shadow-glass">
        <Link to="/" className="font-display text-lg tracking-wide">
          SSS <span className="text-gold-500">JEWELRY</span>
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 transition-colors hover:bg-gold-500/10"
          >
            <ShoppingBag size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 font-mono text-[9px] text-ink-950">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Account (desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setAccountOpen((o) => !o)}
              aria-label="Account"
              className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gold-500/10"
            >
              {isAuthenticated ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold-500 font-mono text-[11px] text-ink-950">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={18} />
              )}
            </button>

            {accountOpen && (
              <div className="glass-strong absolute right-0 top-12 w-52 rounded-2xl p-2 shadow-glass">
                {isAuthenticated ? (
                  <>
                    <p className="truncate px-3 py-2 text-xs text-current/60">
                      Signed in as <span className="text-current">{user.name}</span>
                    </p>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
                      >
                        <LayoutDashboard size={15} /> Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm hover:bg-gold-500/10"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setAccountOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
                    >
                      Create account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

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

          {isAuthenticated ? (
            <>
              <p className="truncate px-3 py-2 text-xs text-current/60">
                Signed in as <span className="text-current">{user.name}</span>
              </p>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
                >
                  Admin dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setOpen(false);
                }}
                className="rounded-lg px-3 py-2 text-left text-sm hover:bg-gold-500/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm hover:bg-gold-500/10"
              >
                Create account
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
