import { Suspense } from "react";
export const runtime = "nodejs";
import { getCategorias } from "./server";

export default function ServiciosPage() {
  return (
    <main className="min-h-[60vh]">
      {/* Hero compacto con degradado de marca */}
      <section className="brand-gradient">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-4xl font-semibold text-[--brand-secondary] tracking-tight">Nuestros servicios</h1>
          <p className="mt-3 text-sm sm:text-base text-[--brand-secondary]/90 max-w-2xl mx-auto">
            Elige una categoría para explorar las opciones disponibles.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="rounded-2xl bg-[--brand-primary]/30 p-6 shadow-sm">
            <Suspense fallback={<p className="mt-4 text-sm text-[--foreground]/70">Cargando categorías…</p>}>
              <CategoriesSelect />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}

async function CategoriesSelect() {
  const categorias = await getCategorias();
  return (
    <div className="mt-6">
      <label htmlFor="categoria" className="block text-sm font-medium text-[--foreground]">
        Filtrar por categoría
      </label>
      <select id="categoria" name="categoria" defaultValue={"0"} className="mt-2 w-full max-w-sm rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground]">
        <option value="0">Todas</option>
        {categorias.map((c) => (
          <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
        ))}
      </select>
    </div>
  );
}


