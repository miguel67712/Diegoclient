import { useMemo, useRef, useState } from "react";
import {
  MessageCircle,
  Loader2,
  CheckCircle2,
  Minus,
  Plus,
  Users,
  Wrench,
  GlassWater,
} from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { BRANDS, ENTERPRISE, OCCASIONS, TRANSPORT } from "@/lib/diego";
import { QuoteReceipt, type QuoteData } from "./QuoteReceipt";
import hostessesPhoto from "@/assets/diego-hostesses.jpg";
import cart33Export from "@/assets/diego-cart-33export.jpg";
import cartCastel from "@/assets/diego-cart-castel.jpg";

interface Errors {
  fullName?: string;
  phone?: string;
  address?: string;
  occasion?: string;
  occasionOther?: string;
  eventPlace?: string;
  eventDate?: string;
  startTime?: string;
  quantities?: string;
}

const inputClass =
  "w-full rounded-lg border border-input bg-card px-3 py-3 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/25";

function Field({
  label,
  required,
  error,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  error?: string | undefined;
  children: React.ReactNode;
  htmlFor: string;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">
        {label}
        {required && <span className="ml-1 text-brand">*</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** A single row: label (+ optional icon) on the left, a -/count/+ stepper on the right. Used for both brands and add-ons so the whole "Quantités" list reads as one consistent column. */
function StepperRow({
  icon: Icon,
  label,
  sub,
  value,
  onChange,
  min = 0,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  sub?: string;
  value: number;
  onChange: (next: number) => void;
  min?: number;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-3 rounded-xl border border-border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <div className="flex min-w-0 items-center gap-3">
        {Icon && (
          <span className="brand-surface inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-brand-foreground">
            <Icon className="size-4" />
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-balance sm:text-base">{label}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2">
        <button
          type="button"
          aria-label={`Retirer — ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-secondary"
        >
          <Minus className="size-4" />
        </button>
        <input
          aria-label={label}
          inputMode="numeric"
          className="w-14 rounded-lg border border-input bg-card py-2 text-center text-base font-bold"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value.replace(/\D/g, ""));
            onChange(Number.isFinite(n) ? Math.max(min, n) : min);
          }}
        />
        <button
          type="button"
          aria-label={`Ajouter — ${label}`}
          onClick={() => onChange(value + 1)}
          className="brand-surface inline-flex size-9 items-center justify-center rounded-lg text-brand-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

export function QuoteRequestForm() {
  const [values, setValues] = useState({
    fullName: "",
    phone: "",
    address: "",
    occasion: "",
    occasionOther: "",
    eventPlace: "",
    eventDate: "",
    startTime: "",
    duration: "5h",
    transport: TRANSPORT[0] ?? "Par nos soins (DIEGO)",
    notes: "",
  });
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(BRANDS.map((b) => [b.id, 0])),
  );
  const [hotesseCount, setHotesseCount] = useState(0);
  const [machineCount, setMachineCount] = useState(0);
  const [cupsCount, setCupsCount] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<null | "shared" | "downloaded">(null);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);

  const makeReference = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
    return `DGO-CMD-${code}`;
  };

  const set = (key: keyof typeof values, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      const { [key as keyof Errors]: _drop, ...rest } = e;
      return rest;
    });
  };

  const changeQty = (id: string, next: number) => {
    setQuantities((q) => ({ ...q, [id]: Math.max(0, next) }));
    setErrors((e) => {
      const { quantities: _drop, ...rest } = e;
      return rest;
    });
  };

  const selected = useMemo(() => BRANDS.filter((b) => (quantities[b.id] ?? 0) > 0), [quantities]);
  const totalKegs = selected.reduce((s, b) => s + (quantities[b.id] ?? 0), 0);

  const validate = () => {
    const e: Errors = {};
    if (!values.fullName.trim()) e.fullName = "Veuillez indiquer votre nom complet.";
    if (!/^[\d\s+()-]{8,20}$/.test(values.phone.trim()))
      e.phone = "Numéro de téléphone invalide (ex. 6 40 73 73 73).";
    if (!values.address.trim()) e.address = "Veuillez indiquer votre adresse / ville.";
    if (!values.occasion) e.occasion = "Veuillez sélectionner la nature de prestation.";
    if (values.occasion === "Autre" && !values.occasionOther.trim())
      e.occasionOther = "Veuillez préciser la nature de prestation.";
    if (!values.eventPlace.trim()) e.eventPlace = "Veuillez indiquer le lieu de la prestation.";
    if (!values.eventDate) e.eventDate = "Veuillez choisir la date de la prestation.";
    if (!values.startTime) e.startTime = "Veuillez indiquer l'heure de début.";
    if (totalKegs === 0 && hotesseCount === 0 && machineCount === 0 && cupsCount === 0)
      e.quantities = "Sélectionnez au moins un fût ou une option.";
    setErrors(e);
    return e;
  };

  const buildMessage = () => {
    const objet = values.occasion === "Autre" ? values.occasionOther.trim() : values.occasion;
    const lines: string[] = [
      "🧾 *COMMANDE — SECRÉTARIAT*",
      `_${ENTERPRISE.name}_`,
      "",
      "*👤 CLIENT*",
      `• Nom : ${values.fullName.trim()}`,
      `• Téléphone : ${values.phone.trim()}`,
      `• Adresse : ${values.address.trim()}`,
      "",
      "*🍺 SÉLECTION SOUHAITÉE*",
    ];
    if (selected.length > 0) {
      selected.forEach((b) => {
        lines.push(`• ${b.name} (${b.volume}) — ${quantities[b.id]} fût(s)`);
      });
      lines.push(`• Total fûts : ${totalKegs}`);
    } else {
      lines.push("• Aucun fût sélectionné — à définir avec le client.");
    }
    if (hotesseCount > 0 || machineCount > 0 || cupsCount > 0) {
      lines.push("", "*➕ OPTIONS*");
      if (hotesseCount > 0) lines.push(`• Hôtesse(s) : ${hotesseCount}`);
      if (machineCount > 0)
        lines.push(`• Machine(s) / tireuse(s) supplémentaire(s) : ${machineCount}`);
      if (cupsCount > 0) lines.push(`• Gobelets supplémentaires : ${cupsCount}`);
    }
    lines.push(
      "",
      "*📅 PRESTATION*",
      `• Nature de prestation : ${objet}`,
      `• Lieu : ${values.eventPlace.trim()}`,
      `• Date : ${values.eventDate}`,
      `• Heure de début : ${values.startTime}`,
      `• Durée : ${values.duration}`,
      `• Moyen de transport : ${values.transport}`,
    );
    if (values.notes.trim()) {
      lines.push("", "*📝 Informations complémentaires :*", values.notes.trim());
    }
    lines.push("", "Fiche récapitulative en image ci-jointe — merci de confirmer ma commande.");
    return lines.join("\n");
  };

  const buildQuote = (): QuoteData => ({
    fullName: values.fullName.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    objet: values.occasion === "Autre" ? values.occasionOther.trim() : values.occasion,
    eventPlace: values.eventPlace.trim(),
    eventDate: values.eventDate,
    startTime: values.startTime,
    duration: values.duration,
    transport: values.transport,
    notes: values.notes.trim(),
    lines: selected.map((brand) => ({ brand, qty: quantities[brand.id] ?? 0 })),
    totalKegs,
    hotesseCount,
    machineCount,
    cupsCount,
    issuedAt: new Date().toLocaleDateString("fr-FR"),
    reference: makeReference(),
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) {
      document
        .querySelector("[data-error='true']")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSending(true);
    setSent(null);
    setQuote(buildQuote());
    const waUrl = `https://wa.me/${ENTERPRISE.secretaryWhatsapp}?text=${encodeURIComponent(buildMessage())}`;

    try {
      // let the hidden receipt render before capturing it
      await new Promise((r) => window.setTimeout(r, 160));
      const node = receiptRef.current;
      if (!node) throw new Error("receipt-unavailable");

      const dataUrl = await toPng(node, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "commande-diego-distribution.png", {
        type: "image/png",
      });

      const canShareFiles =
        typeof navigator !== "undefined" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] });

      if (canShareFiles) {
        await navigator.share({
          files: [file],
          text: buildMessage(),
          title: "Commande — DIEGO Distribution",
        });
        setSent("shared");
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "commande-diego-distribution.png";
        link.click();
        window.open(waUrl, "_blank", "noopener,noreferrer");
        setSent("downloaded");
      }
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      if (!aborted) {
        window.open(waUrl, "_blank", "noopener,noreferrer");
        setSent("downloaded");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="commande" className="relative overflow-hidden border-y border-border">
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <img src={cart33Export} alt="" className="size-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-secondary/93" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Commande rapide</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Passez votre commande auprès du secrétariat
          </h2>
          <p className="mt-3 text-muted-foreground">
            Composez votre commande ci-dessous — fûts, hôtesses, matériel, gobelets — et notre
            secrétariat vous recontacte directement sur WhatsApp{" "}
            {ENTERPRISE.secretaryWhatsappDisplay} pour finaliser les détails.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:h-72 sm:grid-cols-[1.6fr_1fr]">
          <div className="card-elevated relative aspect-[16/9] overflow-hidden sm:aspect-auto sm:h-full">
            <img
              src={hostessesPhoto}
              alt="Équipe DIEGO Distribution en tenue d'hôtesses lors d'une prestation"
              width={1600}
              height={1200}
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-bold text-white sm:p-4">
              Notre équipe sur le terrain, prête pour votre événement.
            </p>
          </div>
          <div className="card-elevated relative aspect-[4/3] overflow-hidden sm:aspect-auto sm:h-full">
            <img
              src={cartCastel}
              alt="Stand de bière pression Castel Beer installé par DIEGO Distribution"
              width={800}
              height={1422}
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
          <fieldset className="card-elevated space-y-5 p-5 sm:p-7">
            <legend className="px-1 text-sm font-black uppercase tracking-wide text-primary">
              1. Vos coordonnées
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-error={Boolean(errors.fullName)}>
                <Field label="Nom et prénom" required htmlFor="q-fullName" error={errors.fullName}>
                  <input
                    id="q-fullName"
                    className={inputClass}
                    value={values.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="M. AKAMBA Robert"
                    autoComplete="name"
                  />
                </Field>
              </div>
              <div data-error={Boolean(errors.phone)}>
                <Field label="Téléphone" required htmlFor="q-phone" error={errors.phone}>
                  <input
                    id="q-phone"
                    type="tel"
                    inputMode="tel"
                    className={inputClass}
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="694 24 55 97"
                    autoComplete="tel"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2" data-error={Boolean(errors.address)}>
                <Field label="Adresse / ville" required htmlFor="q-address" error={errors.address}>
                  <input
                    id="q-address"
                    className={inputClass}
                    value={values.address}
                    onChange={(e) => set("address", e.target.value)}
                    placeholder="Yaoundé – Bastos"
                    autoComplete="street-address"
                  />
                </Field>
              </div>
            </div>
          </fieldset>

          <fieldset
            className="card-elevated space-y-5 p-5 sm:p-7"
            data-error={Boolean(errors.quantities)}
          >
            <legend className="px-1 text-sm font-black uppercase tracking-wide text-primary">
              2. Quantités &amp; options
            </legend>
            <p className="text-xs text-muted-foreground">
              Aucun prix à saisir — indiquez simplement ce qu'il vous faut, le secrétariat s'occupe
              du chiffrage.
            </p>
            <div className="space-y-3">
              {BRANDS.map((b) => (
                <StepperRow
                  key={b.id}
                  label={`${b.name} (${b.volume})`}
                  value={quantities[b.id] ?? 0}
                  onChange={(n) => changeQty(b.id, n)}
                />
              ))}
              <StepperRow
                icon={Users}
                label="Hôtesse(s)"
                value={hotesseCount}
                onChange={setHotesseCount}
              />
              <StepperRow
                icon={Wrench}
                label="Machine(s) / tireuse(s) supplémentaire(s)"
                value={machineCount}
                onChange={setMachineCount}
              />
              <StepperRow
                icon={GlassWater}
                label="Gobelets supplémentaires"
                value={cupsCount}
                onChange={setCupsCount}
              />
            </div>
            {errors.quantities && (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {errors.quantities}
              </p>
            )}
          </fieldset>

          <fieldset className="card-elevated space-y-5 p-5 sm:p-7">
            <legend className="px-1 text-sm font-black uppercase tracking-wide text-primary">
              3. Détails de la prestation
            </legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div data-error={Boolean(errors.occasion)}>
                <Field
                  label="Nature de prestation"
                  required
                  htmlFor="q-occasion"
                  error={errors.occasion}
                >
                  <select
                    id="q-occasion"
                    className={inputClass}
                    value={values.occasion}
                    onChange={(e) => set("occasion", e.target.value)}
                  >
                    <option value="">Sélectionnez…</option>
                    {OCCASIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              {values.occasion === "Autre" && (
                <div data-error={Boolean(errors.occasionOther)}>
                  <Field
                    label="Précisez la nature de prestation"
                    required
                    htmlFor="q-occasionOther"
                    error={errors.occasionOther}
                  >
                    <input
                      id="q-occasionOther"
                      className={inputClass}
                      value={values.occasionOther}
                      onChange={(e) => set("occasionOther", e.target.value)}
                    />
                  </Field>
                </div>
              )}
              <div data-error={Boolean(errors.eventPlace)}>
                <Field
                  label="Lieu de la prestation"
                  required
                  htmlFor="q-eventPlace"
                  error={errors.eventPlace}
                >
                  <input
                    id="q-eventPlace"
                    className={inputClass}
                    value={values.eventPlace}
                    onChange={(e) => set("eventPlace", e.target.value)}
                    placeholder="Yaoundé – Nkolndom"
                  />
                </Field>
              </div>
              <div data-error={Boolean(errors.eventDate)}>
                <Field
                  label="Date de la prestation"
                  required
                  htmlFor="q-eventDate"
                  error={errors.eventDate}
                >
                  <input
                    id="q-eventDate"
                    type="date"
                    className={inputClass}
                    value={values.eventDate}
                    onChange={(e) => set("eventDate", e.target.value)}
                  />
                </Field>
              </div>
              <div data-error={Boolean(errors.startTime)}>
                <Field
                  label="Heure de début"
                  required
                  htmlFor="q-startTime"
                  error={errors.startTime}
                >
                  <input
                    id="q-startTime"
                    type="time"
                    className={inputClass}
                    value={values.startTime}
                    onChange={(e) => set("startTime", e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Durée de la prestation" htmlFor="q-duration">
                <select
                  id="q-duration"
                  className={inputClass}
                  value={values.duration}
                  onChange={(e) => set("duration", e.target.value)}
                >
                  {["3h", "4h", "5h", "6h", "7h", "8h"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <p className="mb-1.5 text-sm font-semibold">Moyen de transport</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {TRANSPORT.map((t) => (
                    <label
                      key={t}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm font-semibold transition-colors has-checked:border-brand has-checked:bg-brand/5"
                    >
                      <input
                        type="radio"
                        name="q-transport"
                        value={t}
                        checked={values.transport === t}
                        onChange={(e) => set("transport", e.target.value)}
                        className="size-4 accent-[var(--brand)]"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2">
                <Field label="Informations complémentaires" htmlFor="q-notes">
                  <textarea
                    id="q-notes"
                    rows={4}
                    className={inputClass}
                    value={values.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="Précisions sur le lieu, l'installation, les horaires…"
                  />
                </Field>
              </div>
            </div>
          </fieldset>

          <div className="card-elevated p-5 sm:p-7">
            <Button
              type="submit"
              size="lg"
              disabled={sending}
              className="brand-surface w-full gap-2 py-6 text-base font-bold text-brand-foreground hover:opacity-90"
            >
              {sending ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Préparation de la fiche…
                </>
              ) : (
                <>
                  <MessageCircle className="size-5" />
                  Envoyer ma commande au secrétariat via WhatsApp
                </>
              )}
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Votre commande est générée en image et envoyée directement au secrétariat (
              {ENTERPRISE.secretaryWhatsappDisplay}).
            </p>

            {sent && (
              <div className="fade-up mt-5 space-y-1 rounded-xl border border-success/40 bg-success/10 p-4 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
                  <div className="min-w-0">
                    <p className="font-bold">
                      Votre fiche de commande a été préparée pour WhatsApp.
                    </p>
                    {sent === "shared" ? (
                      <p className="mt-1 text-muted-foreground">
                        Choisissez WhatsApp dans le partage puis le contact{" "}
                        {ENTERPRISE.secretaryWhatsappDisplay}, et appuyez sur{" "}
                        <strong>Envoyer</strong> pour finaliser votre commande.
                      </p>
                    ) : (
                      <p className="mt-1 text-muted-foreground">
                        L'image de votre fiche a été téléchargée et WhatsApp s'est ouvert avec votre
                        message. Joignez l'image téléchargée puis appuyez sur{" "}
                        <strong>Envoyer</strong>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
        <QuoteReceipt ref={receiptRef} data={quote} />
      </div>
    </section>
  );
}
