"use client";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center items-center py-6 px-4 bg-transparent mt-10">
      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl shadow p-4 w-full max-w-2xl">
        <div className="w-10 h-10 rounded-full border-2 border-yellow-300 bg-yellow-200 overflow-hidden flex items-center justify-center">
  <Image
    src="/alex_dc_avatar.jpg"
    alt="Alex DC"
    width={40}
    height={40}
    className="object-cover w-full h-full"
    priority
  />
</div>
<span className="text-sm text-slate-700 dark:text-slate-200">
  Ey curioso <span role="img" aria-label="Saludo">👋</span> Soy <a href="https://alexdc.com/" className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">Alex DC</a>.
  He creado esta herramienta con <a href="https://programacionia.substack.com/" className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer" tabIndex={0}>Vibe Coding</a>.
  Si quieres saber cómo hacer cosas parecidas únete gratis a <a href="https://aimafia.substack.com/" className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-400" target="_blank" rel="noopener noreferrer">La Mafia IA</a>.
</span>
      </div>
    </footer>
  );
}
