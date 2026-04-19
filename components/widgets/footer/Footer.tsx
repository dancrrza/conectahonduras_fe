import Link from "next/link";
import { Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-border text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-white.png" alt="Conecta Honduras" style={{ height: 28 }} />
            <p className="text-sm text-muted-foreground max-w-xs">
              Descubre y comparte eventos en Honduras.
            </p>
          </div>

          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Explorar</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><Link href="/events" className="text-muted-foreground hover:text-white transition-colors">Eventos</Link></li>
                <li><Link href="/events?type=experience" className="text-muted-foreground hover:text-white transition-colors">Experiencias</Link></li>
                <li><Link href="/events?view=organizers" className="text-muted-foreground hover:text-white transition-colors">Organizadores</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Organizadores</h4>
              <ul className="flex flex-col gap-2 text-sm">
                <li><Link href="/profile" className="text-muted-foreground hover:text-white transition-colors">Aplicar</Link></li>
                <li><Link href="/events/create" className="text-muted-foreground hover:text-white transition-colors">Crear evento</Link></li>
                <li><Link href="/dashboard" className="text-muted-foreground hover:text-white transition-colors">Mi panel</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Conecta Honduras. Todos los derechos reservados.</p>
          <a href="https://instagram.com/conectahonduras" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-white transition-colors">
            <Instagram size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
