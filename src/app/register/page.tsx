"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación temporal
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setMessage(result.message);
      
      if (result.success) {
        setFormData({ username: "", password: "" });
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
            Registro de Usuario
          </h1>
          <p className="mt-3 text-sm text-[--brand-secondary]/90">
            Crear credenciales para el mantenedor
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
              {isLoading ? "Registrando..." : "Registrar Usuario"}
            </button>

            {message && (
              <div className={`mt-4 rounded-md p-3 text-sm ${
                message.includes("exitosamente") 
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