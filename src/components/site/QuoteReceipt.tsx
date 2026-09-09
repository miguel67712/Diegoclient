import { forwardRef } from "react";
import logo from "@/assets/diego-logo.png";
import { ENTERPRISE, type Brand } from "@/lib/diego";

export type QuoteData = {
  fullName: string;
  phone: string;
  address: string;
  objet: string;
  eventPlace: string;
  eventDate: string;
  startTime: string;
  duration: string;
  transport: string;
  notes: string;
  lines: { brand: Brand; qty: number }[];
  totalKegs: number;
  hotesseCount: number;
  machineCount: number;
  cupsCount: number;
  reference: string;
  issuedAt: string;
};

const navy = "#0f2557";
const red = "#e2231a";
const line = "#dbe1ec";

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <tr>
      <td
        style={{
          padding: "6px 10px",
          border: `1px solid ${line}`,
          background: "#f4f6fb",
          fontWeight: 700,
          width: "38%",
          color: navy,
        }}
      >
        {label}
      </td>
      <td style={{ padding: "6px 10px", border: `1px solid ${line}` }}>{value}</td>
    </tr>
  );
}

const cell: React.CSSProperties = {
  padding: "7px 10px",
  border: `1px solid ${line}`,
};

export const QuoteReceipt = forwardRef<HTMLDivElement, { data: QuoteData | null }>(
  function QuoteReceipt({ data }, ref) {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "-10000px",
          width: "760px",
          pointerEvents: "none",
        }}
      >
        <div
          ref={ref}
          style={{
            position: "relative",
            width: "760px",
            background: "#ffffff",
            color: "#101828",
            fontFamily: "Manrope, Arial, sans-serif",
            fontSize: "14px",
            padding: "32px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {/* filigrane / watermark */}
          <img
            src={logo}
            alt=""
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "560px",
              transform: "translate(-50%, -50%) rotate(-20deg)",
              opacity: 0.07,
              pointerEvents: "none",
            }}
          />

          {data && (
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  borderBottom: `4px solid ${navy}`,
                  paddingBottom: "14px",
                }}
              >
                <div>
                  <img src={logo} alt="" style={{ height: "46px", width: "auto" }} />
                  <div style={{ marginTop: "6px", fontWeight: 800, color: navy }}>
                    {ENTERPRISE.legal} — {ENTERPRISE.name}
                  </div>
                  <div style={{ color: "#475467" }}>{ENTERPRISE.tagline}</div>
                  <div style={{ marginTop: "8px", fontWeight: 800, color: red }}>
                    RÉFÉRENCE : {data.reference}
                  </div>
                </div>
                <div style={{ textAlign: "right", color: "#475467" }}>
                  <div style={{ fontWeight: 800, color: red, fontSize: "16px" }}>
                    DEMANDE DE DEVIS
                  </div>
                  <div>Date : {data.issuedAt}</div>
                  <div>Secrétariat : {ENTERPRISE.secretaryWhatsappDisplay}</div>
                </div>
              </div>

              <h2 style={{ fontSize: "15px", color: navy, margin: "20px 0 8px" }}>CLIENT</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Row label="Nom et prénom" value={data.fullName} />
                  <Row label="Téléphone" value={data.phone} />
                  <Row label="Adresse / Ville" value={data.address} />
                </tbody>
              </table>

              <h2 style={{ fontSize: "15px", color: navy, margin: "20px 0 8px" }}>
                SÉLECTION SOUHAITÉE
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: navy, color: "#ffffff" }}>
                    <th style={{ padding: "8px 10px", textAlign: "left" }}>Désignation</th>
                    <th style={{ padding: "8px 10px", textAlign: "center" }}>Qté</th>
                  </tr>
                </thead>
                <tbody>
                  {data.lines.length === 0 && (
                    <tr>
                      <td style={cell} colSpan={2}>
                        À définir avec le client
                      </td>
                    </tr>
                  )}
                  {data.lines.map(({ brand, qty }) => (
                    <tr key={brand.id}>
                      <td style={cell}>
                        {brand.name} — {brand.volume}
                      </td>
                      <td style={{ ...cell, textAlign: "center" }}>{qty}</td>
                    </tr>
                  ))}
                  {data.hotesseCount > 0 && (
                    <tr>
                      <td style={cell}>Hôtesse(s)</td>
                      <td style={{ ...cell, textAlign: "center" }}>{data.hotesseCount}</td>
                    </tr>
                  )}
                  {data.machineCount > 0 && (
                    <tr>
                      <td style={cell}>Machine(s) / tireuse(s) supplémentaire(s)</td>
                      <td style={{ ...cell, textAlign: "center" }}>{data.machineCount}</td>
                    </tr>
                  )}
                  {data.cupsCount > 0 && (
                    <tr>
                      <td style={cell}>Gobelets supplémentaires</td>
                      <td style={{ ...cell, textAlign: "center" }}>{data.cupsCount}</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={{ marginTop: "6px", color: "#475467", fontSize: "12px" }}>
                Total fûts : {data.totalKegs} — Tarifs à confirmer avec le secrétariat.
              </div>

              <h2 style={{ fontSize: "15px", color: navy, margin: "20px 0 8px" }}>PRESTATION</h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tbody>
                  <Row label="Nature de prestation" value={data.objet} />
                  <Row label="Lieu de la prestation" value={data.eventPlace} />
                  <Row label="Date de la prestation" value={data.eventDate} />
                  <Row label="Heure de début" value={data.startTime} />
                  <Row label="Durée" value={data.duration} />
                  <Row label="Moyen de transport" value={data.transport} />
                  <Row label="Informations complémentaires" value={data.notes} />
                </tbody>
              </table>

              <div
                style={{
                  marginTop: "22px",
                  borderTop: `1px solid ${line}`,
                  paddingTop: "10px",
                  color: "#667085",
                  fontSize: "11px",
                }}
              >
                {ENTERPRISE.address} — {ENTERPRISE.bp} — {ENTERPRISE.email}
                <br />
                RCCM : {ENTERPRISE.rccm} — NIU : {ENTERPRISE.niu} — {ENTERPRISE.slogan}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
);
