import { MessageCircle } from "lucide-react";
import logo from "@/assets/diego-logo.png";
import { ENTERPRISE, SERVICES } from "@/lib/diego";

export function Footer() {
  return (
    <footer className="hero-surface text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="inline-flex rounded-xl bg-primary-foreground px-3 py-2">
              <img
                src={logo}
                alt={`Logo ${ENTERPRISE.name}`}
                loading="lazy"
                width={1152}
                height={576}
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-3 text-sm font-bold">{ENTERPRISE.name}</p>
            <p className="text-sm text-primary-foreground/70">{ENTERPRISE.tagline}</p>
            <p className="mt-2 text-sm italic text-primary-foreground/60">{ENTERPRISE.slogan}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Services</h3>
            <ul className="mt-3 space-y-1.5 text-sm text-primary-foreground/70">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.title}>{s.title}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wide">Contact</h3>
            <p className="mt-3 text-sm text-primary-foreground/70">
              {ENTERPRISE.address}
              <br />
              {ENTERPRISE.email}
            </p>
            <a
              href={`https://wa.me/${ENTERPRISE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary-foreground/30 px-3 py-2 text-sm font-semibold transition-colors hover:bg-primary-foreground/10"
            >
              <MessageCircle className="size-4" />
              {ENTERPRISE.whatsappDisplay}
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-primary-foreground/15 pt-6 text-xs text-primary-foreground/60">
          <p>Responsable : {ENTERPRISE.bossWhatsappDisplay}</p>
          <p className="mt-1">
            RCCM : {ENTERPRISE.rccm} — NIU : {ENTERPRISE.niu}
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} {ENTERPRISE.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
