/**
 * Reusable service card component for displaying services by category
 */

interface Service {
  id_servicio: number;
  nombre_servicio: string;
  precio: number;
  duracion: number;
}

interface ServiceCardProps {
  categoria: string;
  servicios: Service[];
}

export default function ServiceCard({ categoria, servicios }: ServiceCardProps) {
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

  return (
    <div className="bg-[--brand-primary]/30 rounded-2xl p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-white bg-[#F0D0DE] px-4 py-2 rounded-lg mb-6">{categoria}</h2>
      <div className="space-y-3">
        {servicios.map((servicio) => (
          <div key={servicio.id_servicio} className="flex justify-between items-center py-2 border-b border-[--brand-tertiary]/20 last:border-b-0">
            <span className="text-[--foreground]">{servicio.nombre_servicio}</span>
            <div className="text-right">
              <div className="text-[--foreground] font-medium">${servicio.precio}</div>
              <div className="text-sm text-[--foreground]/70">{formatDuration(servicio.duracion)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
