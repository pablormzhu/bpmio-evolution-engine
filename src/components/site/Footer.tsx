import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Transformamos empresas mexicanas con cimientos firmes: procesos,
            datos, automatización e inteligencia artificial.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary">Navegar</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary">Inicio</Link></li>
            <li><Link to="/servicios" className="hover:text-primary">Servicios</Link></li>
            <li><Link to="/filosofia" className="hover:text-primary">Filosofía</Link></li>
            <li><Link to="/ai-partner" className="hover:text-primary">AI Partner</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-primary">Contacto</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><a href="mailto:info@bpmio.com.mx" className="hover:text-primary">info@bpmio.com.mx</a></li>
            <li><a href="tel:+525580100974" className="hover:text-primary">+52 55 8010 0974</a></li>
            <li><a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground lg:px-10">
          <span>© {new Date().getFullYear()} BPM.io · Todos los derechos reservados.</span>
          <span>Hecho en México</span>
        </div>
      </div>
    </footer>
  );
}
