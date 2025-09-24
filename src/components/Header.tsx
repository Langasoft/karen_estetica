/**
 * Reusable header component for pages
 */

interface HeaderProps {
  title: string;
  subtitle: string;
  className?: string;
}

export default function Header({ title, subtitle, className = "" }: HeaderProps) {
  return (
    <section className={`brand-gradient ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 text-center">
        <h1 className="text-4xl font-semibold text-[--brand-secondary] tracking-tight">{title}</h1>
        <p className="mt-3 text-sm sm:text-base text-[--brand-secondary]/90 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
