export default function Home() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr_auto] font-sans">
      {/* Header */}
      <header className="w-full backdrop-blur bg-[--brand-secondary]/70 border-b border-[--brand-tertiary]/30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-[--brand-quaternary] tracking-tight">Karen</span>
            <span className="text-2xl font-light text-[--brand-tertiary]">Estética Integral</span>
          </div>
          <nav className="hidden sm:flex gap-6 text-sm text-[--foreground]/80">
            <a href="/servicios" className="hover:text-[--brand-quaternary] transition-colors">Servicios</a>
            <a href="#testimonios" className="hover:text-[--brand-quaternary] transition-colors">Testimonios</a>
            <a href="#contacto" className="hover:text-[--brand-quaternary] transition-colors">Contacto</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="brand-gradient">
          <div className="mx-auto max-w-6xl px-6 py-24 sm:py-28 text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-[--brand-secondary] tracking-tight">
              Bienvenida a tu espacio de cuidado integral
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[--brand-secondary]/90 max-w-2xl mx-auto">
              Un lugar cálido y femenino donde tu bienestar es prioridad. Tratamientos faciales y corporales diseñados para resaltar tu esencia.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <a href="#contacto" className="btn-primary rounded-full px-6 py-3 text-sm font-medium shadow-sm">
                Agenda tu cita
              </a>
              <a href="/servicios" className="rounded-full px-6 py-3 text-sm font-medium bg-[--brand-secondary] text-[--brand-quaternary] border border-[--brand-quaternary]/20">
                Ver servicios
              </a>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="bg-[--brand-secondary]">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-[--foreground] text-center">Nuestros servicios</h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Corporales", desc: "Drenaje y bienestar físico integral." },
                { title: "Depilación", desc: "Métodos suaves y efectivos para tu piel." },
                { title: "Masajes", desc: "Descontracturantes para aliviar tensiones." },
                { title: "Peluquería", desc: "Cortes, color, brushing y tratamientos capilares." },
                { title: "Manicura y Pedicura", desc: "Cuidado de manos y pies con esmaltado." },
                { title: "Aparatoterapia", desc: "Electrodos, lipoláser, cavitación y ultrasonido." },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl p-6 border border-[--brand-tertiary]/25 bg-[--brand-primary]/40 shadow-sm">
                  <div className="chip inline-flex rounded-full px-3 py-1 text-xs font-medium text-[--foreground]/80">{s.title}</div>
                  <p className="mt-3 text-sm text-[--foreground]/80">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonios */}
        <section id="testimonios" className="bg-[--brand-primary]/30">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-center text-[--foreground]">Lo que dicen de nosotras</h2>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {["“Salí renovada, la atención es preciosa.”", "“Resultados visibles y un ambiente súper acogedor.”", "“Mi lugar favorito para desconectar.”"].map((t, i) => (
                <blockquote key={i} className="rounded-2xl p-6 bg-[--brand-secondary] border border-[--brand-tertiary]/20 text-sm text-[--foreground]/80">
                  {t}
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contacto" className="bg-[--brand-secondary] border-t border-[--brand-tertiary]/30">
        <div className="mx-auto max-w-6xl px-6 py-10 grid gap-6 sm:grid-cols-2 items-center">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-semibold text-[--brand-quaternary]">Karen</span>
              <span className="text-xl font-light text-[--brand-tertiary]">Estética Integral</span>
            </div>
            <p className="mt-2 text-sm text-[--foreground]/70">Cuidado femenino con calidez y profesionalismo.</p>
          </div>
          <div className="justify-self-start sm:justify-self-end flex gap-3">
            <a className="btn-primary rounded-full px-5 py-2 text-sm" href="mailto:contacto@karenestetica.com">Escríbenos</a>
            <a className="rounded-full px-5 py-2 text-sm bg-[--brand-primary] text-[--foreground]" href="#">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
