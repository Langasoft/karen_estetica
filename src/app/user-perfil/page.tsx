"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";

type Perfil = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
};

export default function UserPerfilPage() {
  const [ci, setCi] = useState("");
  const [perfil, setPerfil] = useState<Perfil>({ nombre: "", apellido: "", email: "", telefono: "" });
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const ciMasked = ci.length > 1 ? `${ci.slice(0, -1)}-${ci.slice(-1)}` : ci;

  useEffect(() => {
    const ciLocal = localStorage.getItem('clientCi') || '';
    setCi(ciLocal);
    (async () => {
      try {
        const res = await fetch(`/api/usuarios/me?ci=${ciLocal}`);
        const data = await res.json();
        setPerfil({ nombre: data?.nombre ?? "", apellido: data?.apellido ?? "", email: data?.email ?? "", telefono: data?.telefono ?? "" });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setMsg("");
    const res = await fetch('/api/usuarios/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ci, ...perfil })
    });
    const data = await res.json();
    if (data.success) {
      setEdit(false);
      setMsg('Datos guardados');
      if (perfil.nombre || perfil.apellido) {
        localStorage.setItem('clientName', `${perfil.nombre} ${perfil.apellido}`.trim());
      }
      if (perfil.email) localStorage.setItem('clientEmail', perfil.email);
    } else {
      setMsg(data.message || 'Error al guardar');
    }
  };

  return (
    <main className="min-h-screen bg-[--brand-primary]/20">
      <Navbar />
      <section className="brand-gradient">
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <h1 className="text-3xl font-semibold text-[--brand-secondary] tracking-tight">Mi Perfil</h1>
        </div>
      </section>
      <section className="bg-[--brand-secondary]">
        <div className="mx-auto max-w-md px-6 py-10">
          {loading ? (
            <p className="text-sm text-[--foreground]/70">Cargando…</p>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[--foreground]">Cédula de identidad</label>
                <input disabled value={ciMasked} className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 px-3 py-2 text-sm text-[--foreground]" style={{ backgroundColor: 'var(--brand-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--foreground]">Nombre</label>
                <input disabled={!edit} value={perfil.nombre} onChange={(e)=>setPerfil({...perfil, nombre:e.target.value})} className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" style={{ backgroundColor: edit ? 'var(--brand-secondary)' : 'var(--brand-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--foreground]">Apellido</label>
                <input disabled={!edit} value={perfil.apellido} onChange={(e)=>setPerfil({...perfil, apellido:e.target.value})} className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" style={{ backgroundColor: edit ? 'var(--brand-secondary)' : 'var(--brand-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--foreground]">Teléfono</label>
                <input disabled={!edit} value={perfil.telefono} onChange={(e)=>setPerfil({...perfil, telefono:e.target.value.replace(/\D/g,'').slice(0,9)})} className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" style={{ backgroundColor: edit ? 'var(--brand-secondary)' : 'var(--brand-primary)' }} />
              </div>
              <div>
                <label className="block text-sm font-medium text-[--foreground]">E-Mail</label>
                <input disabled={!edit} type="email" value={perfil.email} onChange={(e)=>setPerfil({...perfil, email:e.target.value})} className="mt-2 w-full rounded-md border border-[--brand-tertiary]/30 px-3 py-2 text-sm text-[--foreground] focus:border-[--brand-quaternary] focus:outline-none" style={{ backgroundColor: edit ? 'var(--brand-secondary)' : 'var(--brand-primary)' }} />
              </div>

              <div className="pt-2">
                {!edit ? (
                  <button onClick={()=>setEdit(true)} className="btn-primary rounded-md px-4 py-2 text-sm">Editar</button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="rounded-md px-4 py-2 text-sm hover:opacity-90"
                    style={{ backgroundColor: 'var(--brand-primary)', color: 'var(--brand-secondary)' }}
                  >
                    Guardar
                  </button>
                )}
              </div>
              {msg && <p className="text-xs text-[--foreground]/70">{msg}</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}


