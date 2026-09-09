export const ENTERPRISE = {
  name: "DIEGO Distribution",
  legal: "DIEGO SAS",
  tagline: "La Vraie Bière Pression des Boissons du Cameroun",
  slogan: "Un monde de performance et d'innovations",
  whatsapp: "237640737373",
  whatsappDisplay: "+237 6 40 73 73 73",
  secretaryWhatsapp: "237681102847",
  secretaryWhatsappDisplay: "+237 6 81 10 28 47",
  bossWhatsapp: "237658077073",
  bossWhatsappDisplay: "+237 6 58 07 70 73",
  phones: ["6 40 73 73 73", "6 40 72 72 72", "6 55 63 63 63"],
  sav: "6 55 63 63 63",
  reclamations: "6 55 63 63 63",
  email: "distribution@diego.sarl",
  address: "Yaoundé – Cité Verte, 100m après l'entrée de la Cité Verte",
  bp: "B.P. : 33318 Yaoundé – Cameroun",
  rccm: "CM-NSI-01-2025-B13-01544",
  niu: "M122518259439N",
};

/** Les 3 numéros WhatsApp joignables depuis le site. */
export const WHATSAPP_CONTACTS = [
  { label: "Diego Distribution 1", number: "237640737373", display: "+237 6 40 73 73 73" },
  { label: "Diego Distribution 2", number: "237640727272", display: "+237 6 40 72 72 72" },
  { label: "Diego Distribution", number: "237655636363", display: "+237 6 55 63 63 63" },
];

export type Brand = { id: string; name: string; volume: string; price: number };

export const BRANDS: Brand[] = [
  { id: "33-export", name: '"33" Export', volume: "50L", price: 58750 },
  { id: "castel", name: "Castel Beer", volume: "50L", price: 58750 },
  { id: "beaufort", name: "Beaufort", volume: "50L", price: 58750 },
  { id: "isenbeck", name: "Isenbeck", volume: "50L", price: 67750 },
  { id: "mutzig", name: "Mützig", volume: "50L", price: 58750 },
];

export const NEW_BRANDS = ["mutzig"];

export const SERVICES = [
  {
    title: "Bière pression en fût",
    description:
      "La Vraie Bière Pression des Boissons du Cameroun, livrée en fûts de 50L pour rendre vos événements inoubliables.",
  },
  {
    title: "Matériel de tirage & gobelets",
    description: "Tireuse à bière installée par nos soins. 50 gobelets offerts par fût acheté.",
  },
  {
    title: "Transport, livraison et service",
    description:
      "Transport gratuit dans la ville de Yaoundé. Livraison, installation et service assurés par notre équipe pendant toute la prestation.",
  },
  {
    title: "Prestation événementielle",
    description:
      "Deuils, mariages, baptêmes, anniversaires, soirées d'entreprise : nous assurons le service pendant toute la durée de la prestation.",
  },
];

export const OCCASIONS = [
  "Deuil",
  "Mariage",
  "Baptême",
  "Anniversaire",
  "Soirée d'entreprise",
  "Fête / Cérémonie traditionnelle",
  "Autre",
];

export const TRANSPORT = ["Par nos soins (DIEGO)", "Par soin du client"];

export type PriceOption = { label: string; amount: number };

/** Caution obligatoire sur le matériel. */
export const CAUTIONS: PriceOption[] = [
  { label: "Caution Yaoundé (ville)", amount: 10000 },
  { label: "Caution hors de la ville", amount: 30000 },
];

/** Hôtesse (optionnel). */
export const HOTESSE_OPTIONS: PriceOption[] = [
  { label: "Sans hôtesse", amount: 0 },
  { label: "Hôtesse — 20 000 FCFA", amount: 20000 },
  { label: "Hôtesse — 25 000 FCFA", amount: 25000 },
];

/** Sirop (optionnel). */
export const SIROP_OPTIONS: PriceOption[] = [
  { label: "Sans sirop", amount: 0 },
  { label: "Sirop — 6 000 FCFA", amount: 6000 },
  { label: "Sirop — 8 000 FCFA", amount: 8000 },
  { label: "Sirop — 10 000 FCFA", amount: 10000 },
];

/** Frais de service supplémentaire. */
export const SERVICE_FEE_OPTIONS: PriceOption[] = [
  { label: "Aucun frais supplémentaire", amount: 0 },
  { label: "Frais de service supplémentaire — 10 000 FCFA", amount: 10000 },
  { label: "Frais de service supplémentaire — 20 000 FCFA", amount: 20000 },
];

export const formatFcfa = (n: number) => new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
