import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

export default function AgendaPage() {
  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] font-sans">
      <Navbar />
      <main className="min-h-[60vh]">
        <Header 
          title="Agenda tu cita"
          subtitle="Reserva tu espacio de bienestar y cuidado personal."
        />

        {/* Contenido */}
        <section className="bg-[--brand-secondary]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="text-center">
              <p className="text-[--foreground]/70">Página en desarrollo...</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
