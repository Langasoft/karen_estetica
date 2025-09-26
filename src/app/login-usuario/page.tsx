"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function LoginUsuarioPage() {
  const [ciRaw, setCiRaw] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const ciMasked = ciRaw.length > 1 ? `${ciRaw.slice(0, -1)}-${ciRaw.slice(-1)}` : ciRaw;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const res = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci: ciRaw, password })
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.message || 'Credenciales inválidas');
      } else {
        if (data.validado !== 1) {
          localStorage.setItem('pendingCi', ciRaw);
          router.push('/change-password');
        } else {
          // Generar token temporal básico para cliente
          localStorage.setItem('clientToken', 'client-temp');
          localStorage.setItem('clientCi', ciRaw);
          // Cargar datos del cliente para el navbar
          try {
            const meRes = await fetch(`/api/usuarios/me?ci=${ciRaw}`);
            const me = await meRes.json();
            if (me?.nombre || me?.apellido) {
              localStorage.setItem('clientName', `${me.nombre ?? ''} ${me.apellido ?? ''}`.trim());
            }
            if (me?.email) localStorage.setItem('clientEmail', me.email);
          } catch {}
          router.push('/');
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
            Iniciar sesión
          </h1>
          <p className="mt-3 text-sm text-[--brand-secondary]/90">
            Accede a tu cuenta de cliente
          </p>
        </div>
      </section>

      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-md px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="ci" className="block text-sm font-medium text-[--foreground]">
                Cédula de identidad
              </label>
              <input
                type="text"
                id="ci"
                inputMode="numeric"
                value={ciMasked}
                onChange={(e) => setCiRaw(e.target.value.replace(/\D/g, ''))}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[--foreground]">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </button>

            {message && (
              <div className="mt-4 rounded-md bg-[--brand-primary]/30 p-3 text-sm text-[--foreground]">
                {message}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}


