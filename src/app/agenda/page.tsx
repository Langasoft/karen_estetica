"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroupLabel, SidebarProvider, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function AgendaPage() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('0');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [showSidebar, setShowSidebar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStartIndex, setSelectedStartIndex] = useState<number | null>(null);

  useEffect(() => {
    loadCategorias();
    loadServicios();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await fetch('/api/servicios/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadServicios = async () => {
    try {
      const response = await fetch('/api/servicios/servicios');
      if (response.ok) {
        const data = await response.json();
        setServicios(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedService(''); // Reset service when category changes
  };

  const handleServiceChange = (value: string) => {
    setSelectedService(value);
  };

  const filteredServicios = selectedCategory === '0' 
    ? servicios 
    : servicios.filter(servicio => servicio.id_categoria.toString() === selectedCategory);

  // Datos del servicio seleccionado
  const selectedServiceObj = servicios.find((s) => s.id_servicio.toString() === selectedService);
  const selectedServiceDurationMin = selectedServiceObj?.duracion ?? 0; // viene en minutos desde API
  const selectedServiceName = selectedServiceObj?.nombre_servicio ?? '';
  const slotsNeeded = Math.max(1, Math.ceil(selectedServiceDurationMin / 5));

  // Reset selección al cambiar servicio
  useEffect(() => {
    setSelectedStartIndex(null);
  }, [selectedService]);

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
            <div className="space-y-6">
              {/* Filtros */}
              <div className="flex items-center gap-4">
                <Select
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Todas las categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Todas las categorías</SelectItem>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id_categoria} value={categoria.id_categoria.toString()}>
                        {categoria.nombre_categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedService}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredServicios.map((servicio) => (
                      <SelectItem key={servicio.id_servicio} value={servicio.id_servicio.toString()}>
                        {servicio.nombre_servicio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Calendario - Solo se muestra cuando hay un servicio seleccionado */}
              {selectedService && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[--brand-quaternary]">
                    Selecciona una fecha
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-4">
                    {/* Month Selector */}
                    <Select
                      value={calendarMonth.getMonth().toString()}
                      onValueChange={(val) => {
                        const idx = parseInt(val);
                        const months = [
                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                        ];
                        const next = new Date(calendarMonth);
                        next.setMonth(idx);
                        setCalendarMonth(next);
                      }}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }).map((_, idx) => {
                          const months = [
                            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                          ];
                          return <SelectItem key={idx} value={idx.toString()}>{months[idx]}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>

                    {/* Year Selector */}
                    <Select
                      value={calendarMonth.getFullYear().toString()}
                      onValueChange={(val) => {
                        const y = parseInt(val);
                        const next = new Date(calendarMonth);
                        next.setFullYear(y);
                        setCalendarMonth(next);
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 11 }).map((_, i) => {
                          const year = new Date().getFullYear() - 5 + i;
                          return <SelectItem key={year} value={year.toString()}>{year}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div
                    className="rounded-2xl border border-[--brand-tertiary]/20 bg-[--brand-secondary] p-4"
                    style={{
                      ['--rdp-accent-color' as any]: 'var(--brand-primary)',
                      ['--rdp-accent-background' as any]: 'var(--brand-primary)'
                    }}
                  >
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setShowSidebar(true);
                      }}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      initialFocus
                      className="mx-auto"
                    />
                  </div>
                </div>
              )}

              {!selectedService && (
                <div className="text-center">
                  <p className="text-[--foreground]/70">Selecciona un servicio para ver el calendario</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar para horarios */}
        {showSidebar && selectedDate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
            <div className="bg-white h-screen w-60 shadow-xl flex flex-col">
              <SidebarProvider defaultOpen={true}>
                <Sidebar side="right" collapsible="none" className="h-full">
                  <SidebarHeader className="bg-[--brand-quaternary] text-white">
                    <SidebarGroupLabel className="!text-[--brand-quaternary] text-lg font-semibold">
                      {(() => {
                        const fullDateString = selectedDate.toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        });
                        const parts = fullDateString.split(', ');
                        if (parts.length > 1) {
                          const dayName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
                          return `${dayName}, ${parts.slice(1).join(', ')}`;
                        }
                        return fullDateString.charAt(0).toUpperCase() + fullDateString.slice(1).toLowerCase();
                      })()}
                    </SidebarGroupLabel>
                  </SidebarHeader>
                  <SidebarContent className="p-4 overflow-y-auto flex-1">
                    <div className="space-y-1">
                      {Array.from({ length: 97 }, (_, i) => {
                        const totalMinutes = 600 + (i * 5); // 10:00 a 18:00 en pasos de 5 minutos
                        const hours = Math.floor(totalMinutes / 60);
                        const minutes = totalMinutes % 60;
                        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                        const inSelection =
                          selectedStartIndex !== null &&
                          i >= selectedStartIndex &&
                          i < Math.min(97, selectedStartIndex + slotsNeeded);

                        return (
                          <div
                            key={i}
                            onClick={() => setSelectedStartIndex(i)}
                            className={
                              `p-2 border rounded-md cursor-pointer transition-colors ` +
                              (inSelection
                                ? `border-[--brand-tertiary]`
                                : `border-[--brand-tertiary]/20 hover:bg-[--brand-primary]/10`)
                            }
                            style={
                              inSelection
                                ? { backgroundColor: 'var(--brand-tertiary)', borderColor: 'var(--brand-tertiary)' }
                                : undefined
                            }
                          >
                            <div
                              className={`text-xs font-medium ${inSelection ? '' : 'text-[--brand-quaternary]'}`}
                              style={inSelection ? { color: 'var(--brand-primary)' } : undefined}
                            >
                              {timeString}
                            </div>
                            <div
                              className={`text-xs ${inSelection ? '' : 'text-gray-500'}`}
                              style={inSelection ? { color: 'var(--brand-secondary)' } : undefined}
                            >
                              {inSelection && selectedServiceName ? selectedServiceName : 'Disponible'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </SidebarContent>
                  <SidebarFooter className="p-4 border-t">
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          console.log('Agendar cita:', { selectedService, selectedDate });
                        }}
                        className="h-10 w-full text-white hover:opacity-90"
                        style={{ backgroundColor: "var(--brand-quaternary)" }}
                      >
                        Agendar
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowSidebar(false);
                          setSelectedDate(undefined);
                          setSelectedStartIndex(null);
                        }}
                        className="h-10 w-full bg-gray-500 text-white hover:opacity-90"
                      >
                        Cerrar
                      </Button>
                    </div>
                  </SidebarFooter>
                </Sidebar>
              </SidebarProvider>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
