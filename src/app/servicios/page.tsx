"use client";
import { useState, useEffect } from "react";
import ServiceCard from "@/components/ServiceCard";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function ServiciosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("0");
  const [categorias, setCategorias] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoriasResponse, serviciosResponse] = await Promise.all([
          fetch('/api/servicios/categorias'),
          fetch('/api/servicios/servicios')
        ]);
        const [categoriasData, serviciosData] = await Promise.all([
          categoriasResponse.json(),
          serviciosResponse.json()
        ]);
        setCategorias(categoriasData);
        setServicios(serviciosData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const filteredServicios = selectedCategory === "0" 
    ? servicios 
    : servicios.filter(servicio => servicio.id_categoria === parseInt(selectedCategory));

  const categoriasToShow = selectedCategory === "0" 
    ? categorias 
    : categorias.filter(categoria => categoria.id_categoria === parseInt(selectedCategory));

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] font-sans">
      <Navbar />
      <main className="min-h-[60vh]">
        <Header 
          title="Nuestros servicios"
          subtitle="Elige una categoría para explorar las opciones disponibles."
        />

        {/* Contenido */}
        <section className="bg-[--brand-secondary]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="rounded-2xl bg-[--brand-primary]/30 p-6 shadow-sm mb-8">
              <CategoriesSelect 
                categorias={categorias} 
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </div>
            {isLoading ? (
              <p className="mt-4 text-sm text-[--foreground]/70">Cargando servicios…</p>
            ) : (
              <ServicesByCategory 
                categorias={categoriasToShow}
                servicios={filteredServicios}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ServicesByCategory({ categorias, servicios }: { categorias: any[], servicios: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {categorias.map((categoria) => {
        const serviciosCategoria = servicios.filter(servicio => servicio.id_categoria === categoria.id_categoria);
        
        if (serviciosCategoria.length === 0) return null;

        return (
          <ServiceCard
            key={categoria.id_categoria}
            categoria={categoria.nombre_categoria}
            servicios={serviciosCategoria}
          />
        );
      })}
    </div>
  );
}

function CategoriesSelect({ categorias, selectedCategory, onCategoryChange }: { 
  categorias: any[], 
  selectedCategory: string, 
  onCategoryChange: (value: string) => void 
}) {
  return (
    <div className="mt-6">
      <label htmlFor="categoria" className="block text-sm font-medium text-[--foreground]">
        Filtrar por categoría
      </label>
      <select 
        id="categoria" 
        name="categoria" 
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="mt-2 w-full max-w-sm rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground]"
      >
        <option value="0">Todas</option>
        {categorias.map((c) => (
          <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
        ))}
      </select>
    </div>
  );
}

