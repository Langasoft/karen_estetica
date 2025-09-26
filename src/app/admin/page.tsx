"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DataTable from "@/components/DataTable";
import Form from "@/components/Form";
import ConfirmationModal from "@/components/ConfirmationModal";
import SkeletonTable from "@/components/SkeletonTable";
import { useState as useStateReact } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarHeader, SidebarGroupLabel, SidebarProvider } from "@/components/ui/sidebar";
import SearchInput from "@/components/SearchInput";

export default function AdminPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [deletingCategory, setDeletingCategory] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'categories' | 'services' | 'calendar'>('categories');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('0');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [showSidebar, setShowSidebar] = useState(false);
  // Inactivity logout (10 minutes)
  const INACTIVITY_MS = 10 * 60 * 1000;
  let inactivityTimer: number | undefined;

  useEffect(() => {
    // Verificar autenticación temporal
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    } else {
      // Cargar categorías al iniciar
      loadCategories();
    }
  }, [router]);

  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer) window.clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(() => {
        // Cerrar sesión por inactividad
        localStorage.removeItem('authToken');
        router.push('/');
      }, INACTIVITY_MS);
    };

    // Eventos de actividad del usuario
    const events: (keyof DocumentEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];
    events.forEach(e => document.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (inactivityTimer) window.clearTimeout(inactivityTimer);
      events.forEach(e => document.removeEventListener(e, resetTimer));
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadServices = async (categoryId?: string) => {
    setIsLoading(true);
    try {
      const url = categoryId && categoryId !== '0' 
        ? `/api/admin/services?categoria=${categoryId}`
        : "/api/admin/services";
      const response = await fetch(url);
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const handleEditService = async (service: any) => {
    if (categories.length === 0) {
      await loadCategories(); // Solo cargar si no hay categorías
    }
    setEditingService(service);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (formData: Record<string, string>) => {
    if (editingCategory) {
      // Guardar categoría
      if (!formData.nombre_categoria.trim()) return;
      
      try {
        const response = await fetch(`/api/admin/categories/${editingCategory.id_categoria}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre: formData.nombre_categoria }),
        });
        
        const result = await response.json();
        if (result.success) {
          setShowEditModal(false);
          setEditingCategory(null);
          loadCategories();
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("Error al actualizar la categoría");
      }
    } else if (editingService) {
      // Guardar servicio
      if (!formData.nombre_servicio.trim() || !formData.id_categoria || !formData.precio || !formData.duracion) return;
      
      try {
        const response = await fetch(`/api/admin/services/${editingService.id_servicio}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre_servicio: formData.nombre_servicio,
            id_categoria: parseInt(formData.id_categoria),
            precio: parseFloat(formData.precio),
            duracion: parseInt(formData.duracion)
          }),
        });
        
        const result = await response.json();
        if (result.success) {
          setShowEditModal(false);
          setEditingService(null);
          loadServices(selectedCategoryFilter);
        } else {
          alert(result.message);
        }
      } catch (error) {
        alert("Error al actualizar el servicio");
      }
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingCategory(null);
    setEditingService(null);
  };

  const handleDeleteCategory = (category: any) => {
    setDeletingCategory(category);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deletingService) {
        const response = await fetch(`/api/admin/services/${deletingService.id_servicio}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
          setShowDeleteModal(false);
          setDeletingService(null);
          loadServices(selectedCategoryFilter);
          return;
        } else {
          alert(result.message);
          return;
        }
      }

      if (deletingCategory) {
        const response = await fetch(`/api/admin/categories/${deletingCategory.id_categoria}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (result.success) {
          setShowDeleteModal(false);
          setDeletingCategory(null);
          loadCategories();
        } else {
          alert(result.message);
        }
      }
    } catch (error) {
      alert("Error al eliminar");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeletingCategory(null);
    setDeletingService(null);
  };

  const handleAddCategory = () => {
    setShowAddModal(true);
  };

  const handleSaveAdd = async (formData: Record<string, string>) => {
    if (!formData.nombre_categoria.trim()) return;
    
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: formData.nombre_categoria }),
      });
      
      const result = await response.json();
      if (result.success) {
        setShowAddModal(false);
        loadCategories();
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al crear la categoría");
    }
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
  };

  const handleAddService = async () => {
    if (categories.length === 0) {
      await loadCategories(); // Solo cargar si no hay categorías
    }
    setShowAddServiceModal(true);
  };

  const handleSaveService = async (formData: Record<string, string>) => {
    if (!formData.nombre_servicio.trim() || !formData.id_categoria || !formData.precio || !formData.duracion) return;
    
    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre_servicio: formData.nombre_servicio,
          id_categoria: parseInt(formData.id_categoria),
          precio: parseFloat(formData.precio),
          duracion: parseInt(formData.duracion)
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setShowAddServiceModal(false);
        loadServices(selectedCategoryFilter);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al crear el servicio");
    }
  };

  const handleCancelAddService = () => {
    setShowAddServiceModal(false);
  };

  const handleCategoryFilterChange = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    loadServices(categoryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCategories = categories.filter(category =>
    category.nombre_categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredServices = services.filter(service =>
    service.nombre_servicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.nombre_categoria.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes % 60 === 0) {
      return `${minutes / 60}h`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  };

  const categoriesHeaders = [
    { key: "nombre_categoria", label: "Nombre de Categoría" },
  ];

  const servicesHeaders = [
    { key: "nombre_servicio", label: "Servicio" },
    { key: "nombre_categoria", label: "Categoría" },
    { key: "precio_display", label: "Precio" },
    { key: "duracion_formateada", label: "Duración" },
  ];

  const categoriesActions = [
    { label: "Editar", onClick: handleEditCategory },
    { label: "Eliminar", onClick: handleDeleteCategory, className: "bg-red-600 text-white hover:bg-red-700" },
  ];

  const [deletingService, setDeletingService] = useState<any>(null);

  const handleDeleteService = (service: any) => {
    setDeletingService(service);
    setShowDeleteModal(true);
  };

  const servicesActions = [
    { label: "Editar", onClick: handleEditService },
    { label: "Eliminar", onClick: handleDeleteService, className: "bg-red-600 text-white hover:bg-red-700" },
  ];

  return (
    <main className="min-h-screen bg-[--brand-primary]/20">
      <section className="brand-gradient">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h1 className="text-4xl font-semibold text-[--brand-secondary] tracking-tight">
            Panel de Administración
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[--brand-secondary]/90 max-w-2xl mx-auto">
            Bienvenida al mantenedor de Karen Estética Integral
          </p>
          <button
            onClick={handleLogout}
            className="mt-6 rounded-full px-6 py-3 text-sm font-medium bg-[--brand-secondary] text-[--brand-quaternary] border border-[--brand-quaternary]/20 hover:bg-[--brand-quaternary] hover:text-[--brand-secondary] transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </section>

      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setActiveTab('categories');
                setSearchQuery(''); // Limpiar filtro
                loadCategories();
              }}
              className={`px-6 py-3 rounded-md font-medium ${
                activeTab === 'categories' 
                  ? 'bg-[--brand-quaternary] text-[--brand-secondary]' 
                  : 'bg-[--brand-primary] text-[--foreground] hover:bg-[--brand-tertiary] hover:text-[--brand-secondary]'
              }`}
            >
              Categorías
            </button>
            <button
              onClick={async () => {
                setActiveTab('services');
                setSearchQuery(''); // Limpiar filtro
                if (categories.length === 0) {
                  await loadCategories();
                }
                await loadServices();
              }}
              className={`px-6 py-3 rounded-md font-medium ${
                activeTab === 'services' 
                  ? 'bg-[--brand-quaternary] text-[--brand-secondary]' 
                  : 'bg-[--brand-primary] text-[--foreground] hover:bg-[--brand-tertiary] hover:text-[--brand-secondary]'
              }`}
            >
              Servicios
            </button>
            <button
              onClick={() => {
                setActiveTab('calendar');
                setSearchQuery('');
              }}
              className={`px-6 py-3 rounded-md font-medium ${
                activeTab === 'calendar' 
                  ? 'bg-[--brand-quaternary] text-[--brand-secondary]' 
                  : 'bg-[--brand-primary] text-[--foreground] hover:bg-[--brand-tertiary] hover:text-[--brand-secondary]'
              }`}
            >
              Calendario
            </button>
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <SkeletonTable 
                rows={5} 
                columns={activeTab === 'categories' ? 1 : 4} 
              />
            ) : activeTab === 'categories' ? (
              <div className="space-y-4">
                <SearchInput
                  placeholder="Buscar categorías..."
                  onSearch={handleSearch}
                />
                <DataTable
                  headers={categoriesHeaders}
                  data={filteredCategories}
                  actions={categoriesActions}
                  onAdd={handleAddCategory}
                  addLabel="Agregar Categoría"
                />
              </div>
            ) : activeTab === 'services' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-64">
                    <Select
                      value={selectedCategoryFilter}
                      onValueChange={(val) => handleCategoryFilterChange(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Todas las categorías</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id_categoria} value={String(category.id_categoria)}>
                            {category.nombre_categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <SearchInput
                    placeholder="Buscar servicios..."
                    onSearch={handleSearch}
                  />
                </div>
                <DataTable
                  headers={servicesHeaders}
                  data={filteredServices.map(service => ({
                    ...service,
                    duracion_formateada: formatDuration(service.duracion),
                    precio_display: `$${service.precio}`,
                    precio_original: service.precio
                  }))}
                  actions={servicesActions}
                  onAdd={handleAddService}
                  addLabel="Agregar Servicio"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {/* Month Selector - shadcn */}
                  <Select
                    value={(calendarMonth.getMonth()+1).toString()}
                    onValueChange={(val) => {
                      const m = parseInt(val) - 1;
                      const next = new Date(calendarMonth);
                      next.setMonth(m);
                      setCalendarMonth(next);
                    }}
                  >
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'
                      ].map((m, idx) => (
                        <SelectItem key={m} value={(idx+1).toString()}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Year Selector - shadcn */}
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
                    {Array.from({ length: 132 }, (_, i) => {
                      const totalMinutes = 600 + (i * 5); // Empieza a las 10:00 (600 min) y va de 5 en 5
                      const hours = Math.floor(totalMinutes / 60);
                      const minutes = totalMinutes % 60;
                      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                      return (
                        <div 
                          key={i}
                          className="p-2 border border-[--brand-tertiary]/20 rounded-md hover:bg-[--brand-primary]/10 cursor-pointer transition-colors"
                        >
                          <div className="text-xs font-medium text-[--brand-quaternary]">
                            {timeString}
                          </div>
                          <div className="text-xs text-gray-500">
                            Disponible
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SidebarContent>
                <div className="p-4 border-t">
                  <button
                    onClick={() => {
                      setShowSidebar(false);
                      setSelectedDate(undefined);
                    }}
                    className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
                  >
                    Cerrar
                  </button>
                </div>
              </Sidebar>
            </SidebarProvider>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {showEditModal && (editingCategory || editingService) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-white bg-[#AF426B] px-4 py-2 rounded-md mb-4">
              {editingCategory ? 'Editar Categoría' : 'Editar Servicio'}
            </h3>
            <Form
              fields={editingCategory ? [
                {
                  name: "nombre_categoria",
                  label: "Nombre de Categoría",
                  type: "text",
                  required: true,
                  value: editingCategory.nombre_categoria
                }
              ] : [
                {
                  name: "id_categoria",
                  label: "Categoría",
                  type: "select",
                  required: true,
                  options: categories.map(cat => ({
                    value: cat.id_categoria.toString(),
                    label: cat.nombre_categoria
                  }))
                },
                {
                  name: "nombre_servicio",
                  label: "Nombre del Servicio",
                  type: "text",
                  required: true,
                  placeholder: "Ingrese el nombre del servicio"
                },
                {
                  name: "precio",
                  label: "Precio",
                  type: "number",
                  required: true,
                  placeholder: "Ingrese el precio"
                },
                {
                  name: "duracion",
                  label: "Duración (minutos)",
                  type: "number",
                  required: true,
                  placeholder: "Ingrese la duración en minutos"
                }
              ]}
              onSubmit={handleSaveEdit}
              submitLabel="Guardar"
              initialData={editingCategory ? 
                { nombre_categoria: editingCategory.nombre_categoria } :
                { 
                  id_categoria: editingService?.id_categoria?.toString() || '',
                  nombre_servicio: editingService?.nombre_servicio || '',
                  precio: editingService?.precio_original?.toString() || editingService?.precio?.toString() || '',
                  duracion: editingService?.duracion?.toString() || ''
                }
              }
            />
            <button
              onClick={handleCancelEdit}
              className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de agregar categoría */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-white bg-[#AF426B] px-4 py-2 rounded-md mb-4">Agregar Categoría</h3>
            <Form
              fields={[
                {
                  name: "nombre_categoria",
                  label: "Nombre de Categoría",
                  type: "text",
                  required: true,
                  placeholder: "Ingrese el nombre de la categoría"
                }
              ]}
              onSubmit={handleSaveAdd}
              submitLabel="Crear"
            />
            <button
              onClick={handleCancelAdd}
              className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de agregar servicio */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-medium text-white bg-[#AF426B] px-4 py-2 rounded-md mb-4">Agregar Servicio</h3>
            <Form
              fields={[
                {
                  name: "id_categoria",
                  label: "Categoría",
                  type: "select",
                  required: true,
                  options: categories.map(cat => ({
                    value: cat.id_categoria.toString(),
                    label: cat.nombre_categoria
                  }))
                },
                {
                  name: "nombre_servicio",
                  label: "Nombre del Servicio",
                  type: "text",
                  required: true,
                  placeholder: "Ingrese el nombre del servicio"
                },
                {
                  name: "precio",
                  label: "Precio",
                  type: "number",
                  required: true,
                  placeholder: "Ingrese el precio"
                },
                {
                  name: "duracion",
                  label: "Duración (minutos)",
                  type: "number",
                  required: true,
                  placeholder: "Ingrese la duración en minutos"
                }
              ]}
              onSubmit={handleSaveService}
              submitLabel="Crear"
            />
            <button
              onClick={handleCancelAddService}
              className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-md hover:opacity-90"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        message={deletingService ? `¿Estás seguro de que quieres eliminar el servicio "${deletingService?.nombre_servicio}"?` : `¿Estás seguro de que quieres eliminar la categoría "${deletingCategory?.nombre_categoria}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        confirmButtonColor="bg-red-600"
      />
    </main>
  );
}
