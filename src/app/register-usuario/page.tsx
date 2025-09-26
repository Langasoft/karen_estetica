"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function RegisterUsuarioPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [ciRaw, setCiRaw] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) router.push("/login");
  }, [router]);

  const ciMasked = ciRaw.length > 1
    ? `${ciRaw.slice(0, -1)}-${ciRaw.slice(-1)}`
    : ciRaw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      if (!ciRaw || !nombre || !apellido || !telefono || !email) {
        setMessage("Completa todos los campos");
      } else if (ciRaw.length < 2) {
        setMessage("La cédula debe tener al menos 2 dígitos");
      } else if (!/^\d{9}$/.test(telefono)) {
        setMessage("El teléfono debe tener 9 dígitos");
      } else if (!/^\S+@\S+\.[A-Za-z]{2,}$/.test(email)) {
        setMessage("Email inválido");
      } else {
        const res = await fetch('/api/usuarios/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ci: ciRaw, nombre, apellido, telefono, email })
        });
        const data = await res.json();
        if (data.exists === true) {
          setMessage("El usuario ya existe. Por favor, inicie sesión.");
        } else if (data.success) {
          setMessage("Usuario registrado correctamente");
          setCiRaw("");
          setNombre("");
          setApellido("");
          setTelefono("");
          setEmail("");
        } else {
          setMessage(data.message || 'Error al registrar');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[--brand-primary]/20">
      <Navbar />
      <section className="brand-gradient">
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-[--brand-secondary] tracking-tight">
            Registro de Cliente
          </h1>
          <p className="mt-3 text-sm text-[--brand-secondary]/90">
            Completa con tus datos para registrarte.
          </p>
        </div>
      </section>

      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-md px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* CI */}
            <div>
              <label htmlFor="ci" className="block text-sm font-medium text-[--foreground]">
                Cédula de identidad
              </label>
              <input
                id="ci"
                inputMode="numeric"
                value={ciMasked}
                onChange={(e) => {
                  const onlyDigits = e.target.value.replace(/\D/g, "");
                  setCiRaw(onlyDigits);
                }}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                placeholder=""
                required
              />
            </div>

            {/* Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-[--foreground]">
                Nombre
              </label>
              <input
                id="nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-[--foreground]">
                Apellido
              </label>
              <input
                id="apellido"
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label htmlFor="telefono" className="block text-sm font-medium text-[--foreground]">
                Teléfono de contacto
              </label>
              <input
                id="telefono"
                inputMode="numeric"
                pattern="\d{9}"
                placeholder="Ejemplo 098999999"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value.replace(/\D/g, "").slice(0, 9))}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[--foreground]">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? "Guardando..." : "Registrarme"}
            </button>

            {message && (
              <div className={`mt-4 rounded-md p-3 text-sm ${
                message.includes("correctamente")
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}


