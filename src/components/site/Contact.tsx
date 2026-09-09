import { MessageCircle, Phone, Mail, MapPin, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENTERPRISE, WHATSAPP_CONTACTS } from "@/lib/diego";

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Contact</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">Parlons de votre événement</h2>
          <p className="mt-3 text-muted-foreground">
            Notre équipe vous répond sur WhatsApp et par téléphone du lundi au dimanche.
          </p>
          <p className="mt-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Discuter sur WhatsApp
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {WHATSAPP_CONTACTS.map((c) => (
              <Button
                key={c.number}
                asChild
                size="lg"
                className="brand-surface justify-start gap-2 text-brand-foreground hover:opacity-90"
              >
                <a href={`https://wa.me/${c.number}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-5" />
                  {c.label} — {c.display}
                </a>
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-elevated p-5">
            <Phone className="size-5 text-brand" />
            <h3 className="mt-3 text-base font-bold">Téléphones</h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {ENTERPRISE.phones.map((p) => (
                <li key={p}>
                  <a className="hover:text-brand" href={`tel:+237${p.replace(/\s/g, "")}`}>
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-elevated p-5">
            <Headphones className="size-5 text-brand" />
            <h3 className="mt-3 text-base font-bold">Numéros utiles</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Service après-vente : {ENTERPRISE.sav}
              <br />
              Réclamations : {ENTERPRISE.reclamations}
            </p>
          </div>
          <div className="card-elevated p-5">
            <MapPin className="size-5 text-brand" />
            <h3 className="mt-3 text-base font-bold">Adresse</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {ENTERPRISE.address}
              <br />
              {ENTERPRISE.bp}
            </p>
          </div>
          <div className="card-elevated p-5">
            <Mail className="size-5 text-brand" />
            <h3 className="mt-3 text-base font-bold">E-mail</h3>
            <p className="mt-2 break-all text-sm text-muted-foreground">
              <a className="hover:text-brand" href={`mailto:${ENTERPRISE.email}`}>
                {ENTERPRISE.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
