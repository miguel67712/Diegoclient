import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { QuoteRequestForm } from "@/components/site/QuoteRequestForm";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";

const title = "DIEGO Distribution — Demande de devis (Secrétariat)";
const description =
  "Décrivez votre besoin en fûts de bière pression, hôtesses, matériel et gobelets, et recevez un devis personnalisé directement sur WhatsApp auprès du secrétariat DIEGO Distribution.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Header />
      <main>
        <QuoteRequestForm />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
