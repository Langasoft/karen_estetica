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
        <div className="flex items-center gap-3">
          {/* Icono de configuración (corporativo) → /admin */}
          <a href="/admin" aria-label="Administración" className="inline-flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg
              className="h-4 w-4 text-[--brand-quaternary]"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.5 1.5 0 0 1-2.1 2.1l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V19a1.5 1.5 0 0 1-3 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.5 1.5 0 1 1-2.1-2.1l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H5a1.5 1.5 0 0 1 0-3h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A1.5 1.5 0 0 1 7.8 5l.1.1a1 1 0 0 0 1.1.2H9a1 1 0 0 0 .6-.9V4a1.5 1.5 0 0 1 3 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.5 1.5 0 0 1 2.1 2.1l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H19a1.5 1.5 0 0 1 0 3h-.1a1 1 0 0 0-.9.6Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <a href="/" className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[--brand-quaternary] tracking-tight">Karen</span>
            <span className="text-2xl font-light text-[--brand-tertiary]">Estética Integral</span>
          </a>
        </div>
        <nav className="hidden sm:flex gap-6 text-sm text-[--foreground]/80">
          <a href="/servicios" className="hover:text-[--brand-quaternary] transition-colors">Servicios</a>
          <a href="/#testimonios" className="hover:text-[--brand-quaternary] transition-colors">Testimonios</a>
          <a href="/#contacto" className="hover:text-[--brand-quaternary] transition-colors">Contacto</a>
        </nav>
      </div>
    </header>
  );
}
