export default function Footer() {
  return (
    <footer className="border-t border-current/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-current/50 sm:flex-row">
        <p className="font-display text-base text-current/80">
          SSS <span className="text-gold-500">Jewelry Works</span>
        </p>
        <p>&copy; {new Date().getFullYear()} SSS Jewelry Works. All pieces made to order.</p>
      </div>
    </footer>
  );
}
