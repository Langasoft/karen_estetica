"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/; // ≥8
    if (!strong.test(password)) {
      setMessage("La contraseña no cumple los requisitos.");
      return;
    }
    if (password !== confirm) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch('/api/usuarios/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, ci: localStorage.getItem('pendingCi') || '' })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('clientToken', 'client-temp');
        setMessage('Contraseña actualizada');
        router.push('/');
      } else {
        setMessage(data.message || 'Error al actualizar');
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
            Cambiar contraseña
          </h1>
          <p className="mt-3 text-sm text-[--brand-secondary]/90">
            Define tu nueva contraseña
          </p>
        </div>
      </section>
      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-md px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[--foreground]">Contraseña</label>
              <input type="password" className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" value={password} onChange={(e)=>setPassword(e.target.value)} required />
              <p className="mt-1 text-xs text-[--foreground]/70">Mínimo 8 caracteres, incluir mayúscula, minúscula, número y especial.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[--foreground]">Repite contraseña</label>
              <input type="password" className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 bg-[--brand-secondary] px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50">{isLoading? 'Cambiando...' : 'Cambiar contraseña'}</button>
            {message && <div className="mt-4 rounded-md bg-[--brand-primary]/30 p-3 text-sm text-[--foreground]">{message}</div>}
          </form>
        </div>
      </section>
    </main>
  );
}


