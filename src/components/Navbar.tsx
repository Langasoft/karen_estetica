/**
 * Reusable navbar component
 */

interface NavbarProps {
  className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
  return (
    <header className={`w-full backdrop-blur bg-[--brand-secondary]/70 border-b border-[--brand-tertiary]/30 ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold text-[--brand-quaternary] tracking-tight">Karen</span>
          <span className="text-2xl font-light text-[--brand-tertiary]">Estética Integral</span>
        </a>
        <nav className="hidden sm:flex gap-6 text-sm text-[--foreground]/80">
          <a href="/servicios" className="hover:text-[--brand-quaternary] transition-colors">Servicios</a>
          <a href="/#testimonios" className="hover:text-[--brand-quaternary] transition-colors">Testimonios</a>
          <a href="/#contacto" className="hover:text-[--brand-quaternary] transition-colors">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
