"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Guardar token/sesión (temporal)
        localStorage.setItem("authToken", "authenticated");
        router.push("/admin");
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[--brand-primary]/20">
      <section className="brand-gradient">
        <div className="mx-auto max-w-md px-6 py-24 text-center">
          <h1 className="text-3xl font-semibold text-[--brand-secondary] tracking-tight">
            Iniciar Sesión
          </h1>
          <p className="mt-3 text-sm text-[--brand-secondary]/90">
            Acceso al mantenedor
          </p>
        </div>
      </section>

      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-md px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[--foreground]">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            {message && (
              <div className="mt-4 rounded-md bg-red-100 p-3 text-sm text-red-800">
                {message}
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
}
