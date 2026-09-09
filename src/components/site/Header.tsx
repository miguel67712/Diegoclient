import { useState } from "react";
import { Menu, X, MessageCircle } from "lucide-react";
import logo from "@/assets/diego-logo.png";
import { ENTERPRISE } from "@/lib/diego";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "#top", label: "Accueil" },
  { href: "#devis", label: "Devis" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:flex sm:justify-between">
        <a href="#top" className="flex min-w-0 items-center gap-3">
          <img
            src={logo}
            alt={`Logo ${ENTERPRISE.name}`}
            width={1152}
            height={576}
            className="h-9 w-auto shrink-0 sm:h-10"
          />
          <span className="sr-only">{ENTERPRISE.name}</span>
        </a>

        <nav className="hidden items-center gap-1 sm:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <Button asChild className="ml-2 gap-2">
            <a href="#devis">
              <MessageCircle className="size-4" />
              Demander un devis
            </a>
          </Button>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border text-primary sm:hidden"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-card px-4 py-3 sm:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-base font-semibold text-foreground hover:bg-secondary"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
