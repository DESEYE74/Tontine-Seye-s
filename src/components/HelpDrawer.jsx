import React, { useState } from "react";
import { X, HelpCircle, ChevronDown } from "lucide-react";
import { T, BRAND_NAME } from "../theme.jsx";

const SECTIONS = [
  {
    title: "Se connecter",
    content: [
      "L'administrateur se connecte avec un identifiant (email) et un mot de passe.",
      "Chaque membre se connecte avec son code personnel à 6 chiffres, communiqué par l'administrateur — sans mot de passe.",
      "Un membre qui a oublié son code doit le redemander à l'administrateur.",
    ],
  },
  {
    title: "Tableau de bord",
    content: [
      "Vue d'ensemble du tour en cours : montant collecté, membres en retard, bénéficiaire du tour, commission encaissée.",
      "La roue de rotation montre visuellement l'ordre des membres ; le membre en doré est le bénéficiaire actuel.",
      "La liste \"Ordre des tours\" indique pour chacun s'il a déjà Reçu, s'il est le Bénéficiaire du tour, ou s'il est encore À venir.",
    ],
  },
  {
    title: "Membres",
    adminOnly: true,
    content: [
      "\"Ajouter un membre\" génère automatiquement un code personnel à 6 chiffres (régénérable) à communiquer au membre concerné.",
      "Le crayon permet de modifier un membre (nom, téléphone, position dans l'ordre des tours) ; la corbeille le supprime (avec confirmation).",
      "L'icône éclair ⚡, visible sur un membre \"À venir\", permet de lui donner la priorité (cas d'urgence) : il devient bénéficiaire du tour en cours, et les membres intercalés sont simplement décalés d'un cran. Cette action nécessite une connexion internet.",
    ],
  },
  {
    title: "Versements",
    adminOnly: true,
    content: [
      "Le montant de la cotisation et la commission du trésorier se règlent ensemble, en haut de l'écran — la commission peut être à 0.",
      "Le formulaire \"Enregistrer un versement\" ne propose que les membres n'ayant pas encore payé ce tour, pour éviter toute double saisie.",
      "\"Commissions du trésorier\" cumule, pour chaque membre, le total des commissions versées depuis le début — utile pour connaître ce que le trésorier a perçu au total.",
      "\"Historique des versements\" liste tous les versements enregistrés, du plus récent au plus ancien.",
    ],
  },
  {
    title: "Calendrier et rotation des tours",
    content: [
      "La liste \"Ordre des tours\" reprend les mêmes statuts que le tableau de bord (Reçu / Bénéficiaire du tour / À venir).",
      "Le bouton \"Passer au tour suivant\" (administrateur) fait avancer la tontine d'un cran, une fois la cotisation collectée et remise au bénéficiaire.",
      "Une fois que tous les membres ont eu leur tour, le bouton devient \"Clôturer et recommencer un tour\" : la tontine repart au tour 1, et le compteur de cycle avance (Cycle 2, Cycle 3...).",
    ],
  },
  {
    title: "Reçus",
    content: [
      "Chaque versement génère un reçu PDF avec une référence au format code-personnel + tour + cycle (ex : 123456T1C1).",
      "Le bouton \"Partager sur WhatsApp\" ouvre directement l'application WhatsApp avec le PDF prêt à envoyer ; \"Télécharger\" l'enregistre sur l'appareil.",
      "L'onglet \"Reçu de remise\" (visible par l'administrateur, et par le bénéficiaire du tour) génère un document séparé attestant la remise de la caisse complète au bénéficiaire.",
    ],
  },
  {
    title: "Assistant",
    content: [
      "L'assistant répond aux questions sur la tontine (qui est en retard, quand est mon tour, état de la caisse...) à partir des vraies données, en temps réel.",
      "Utilisez les suggestions rapides ou tapez votre question librement.",
    ],
  },
  {
    title: "Sécurité",
    content: [
      "Le code personnel d'un membre ne donne accès qu'à la consultation de sa propre situation — jamais de modification.",
      "Ne partagez jamais votre mot de passe administrateur ni le code personnel d'un autre membre.",
    ],
  },
];

export default function HelpDrawer({ open, onClose, role }) {
  const [openSection, setOpenSection] = useState(null);
  const sections = SECTIONS.filter((s) => !s.adminOnly || role === "admin");

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(12,16,32,0.55)", zIndex: 60,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="f-body"
        style={{
          background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "85vh",
          display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        }}
      >
        <div style={{ background: T.ink, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <HelpCircle size={17} color={T.gold} />
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>Guide d'utilisation</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <X size={17} color="#C7CCE3" />
          </button>
        </div>

        <div style={{ padding: "14px 18px", overflowY: "auto" }}>
          {sections.map((s, i) => {
            const isOpen = openSection === i;
            return (
              <div key={s.title} style={{ borderBottom: i < sections.length - 1 ? `1px solid ${T.line}` : "none" }}>
                <button
                  onClick={() => setOpenSection(isOpen ? null : i)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "none", border: "none", cursor: "pointer", padding: "12px 4px", textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{s.title}</span>
                  <ChevronDown size={16} color={T.textSoft} style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s" }} />
                </button>
                {isOpen && (
                  <div style={{ paddingBottom: 12 }}>
                    {s.content.map((line, j) => (
                      <p key={j} style={{ fontSize: 13, color: T.textSoft, lineHeight: 1.5, margin: "0 0 8px" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ padding: "10px 18px", borderTop: `1px solid ${T.line}`, textAlign: "center" }}>
          <p style={{ fontSize: 9.5, letterSpacing: 1.2, textTransform: "uppercase", color: T.textSoft, margin: 0 }}>{BRAND_NAME}</p>
        </div>
      </div>
    </div>
  );
}
