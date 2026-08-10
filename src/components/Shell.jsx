import React, { useEffect, useState } from "react";
import { Wallet, Users, CalendarDays, Receipt, LogOut, Sparkles, CreditCard, Menu, X, HelpCircle } from "lucide-react";
import { T, BRAND_NAME } from "../theme.jsx";
import { TONTINE } from "../data/mock.js";
import { fetchTontineSettings } from "../data/api.js";
import logoUrl from "../assets/logo.png";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 760 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 760);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function Shell({ role, active, onNav, onLogout, onChat, onHelp, children }) {
  const [name, setName] = useState(TONTINE.name);
  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(!isMobile);

  useEffect(() => {
    fetchTontineSettings().then((t) => setName(t.name)).catch(() => {});
  }, []);

  // Sur ordinateur le menu reste ouvert par défaut ; sur mobile il démarre
  // fermé (tiroir masqué, seul le bouton ☰ est visible).
  useEffect(() => {
    setNavOpen(!isMobile);
  }, [isMobile]);

  const handleNav = (key) => {
    onNav(key);
    if (isMobile) setNavOpen(false);
  };

  const adminNav = [
    { key: "dashboard", label: "Tableau de bord", icon: Wallet },
    { key: "members", label: "Membres", icon: Users },
    { key: "payments", label: "Versements", icon: CreditCard },
    { key: "calendar", label: "Calendrier", icon: CalendarDays },
    { key: "receipts", label: "Reçus", icon: Receipt },
  ];
  const memberNav = [
    { key: "dashboard", label: "Ma situation", icon: Wallet },
    { key: "calendar", label: "Calendrier du groupe", icon: CalendarDays },
    { key: "receipts", label: "Mes reçus", icon: Receipt },
  ];
  const nav = role === "admin" ? adminNav : memberNav;

  const NavButtons = ({ compact }) => (
    <div className={compact ? undefined : "app-nav-list"} style={compact ? { display: "flex", flexDirection: "column", gap: 6, alignItems: "center" } : undefined}>
      {nav.map((n) => (
        <button key={n.key} onClick={() => handleNav(n.key)} title={compact ? n.label : undefined} style={compact ? {
          width: 36, height: 36, borderRadius: 9, border: "none", cursor: "pointer",
          background: active === n.key ? T.inkPanel : "transparent",
          color: active === n.key ? "#fff" : "#9AA1C4",
          display: "flex", alignItems: "center", justifyContent: "center",
        } : {
          display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9,
          border: "none", cursor: "pointer", textAlign: "left",
          background: active === n.key ? T.inkPanel : "transparent",
          color: active === n.key ? "#fff" : "#9AA1C4", fontSize: 13.5, fontWeight: 500,
        }}>
          <n.icon size={16} />
          {!compact && n.label}
        </button>
      ))}
    </div>
  );

  const FooterButtons = () => (
    <div className="app-sidebar-footer" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => { onChat(); if (isMobile) setNavOpen(false); }} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 8px", borderRadius: 9,
          border: `1px solid ${T.inkLine}`, cursor: "pointer", background: "transparent",
          color: T.gold, fontSize: 13, fontWeight: 600,
        }}>
          <Sparkles size={15} /> Assistant
        </button>
        <button onClick={() => { onHelp(); if (isMobile) setNavOpen(false); }} style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "9px 8px", borderRadius: 9,
          border: `1px solid ${T.inkLine}`, cursor: "pointer", background: "transparent",
          color: "#9AA1C4", fontSize: 13, fontWeight: 600,
        }}>
          <HelpCircle size={15} /> Aide
        </button>
      </div>
      <button onClick={onLogout} style={{
        display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 9,
        border: "none", cursor: "pointer", background: "transparent", color: "#8B93B8", fontSize: 13,
      }}>
        <LogOut size={15} /> Se déconnecter
      </button>
      <p style={{ color: "#4A527A", fontSize: 9.5, letterSpacing: 1.2, textTransform: "uppercase", textAlign: "center", margin: "6px 0 0" }}>
        {BRAND_NAME}
      </p>
    </div>
  );

  // ---- Mobile : barre du haut fixe + tiroir qui glisse par-dessus ----------
  if (isMobile) {
    return (
      <div className="f-body" style={{ minHeight: "100vh", background: T.stone }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
          background: T.ink, position: "sticky", top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => setNavOpen(true)}
            aria-label="Afficher le menu"
            style={{
              background: "transparent", border: `1px solid ${T.inkLine}`, borderRadius: 8, width: 34, height: 34,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
            }}
          >
            <Menu size={17} color="#C7CCE3" />
          </button>
          <img src={logoUrl} alt="" style={{ width: 26, height: 26, objectFit: "contain", flexShrink: 0 }} />
          <span className="f-display" style={{ color: "#fff", fontSize: 14.5, fontStyle: "italic", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {name}
          </span>
        </div>

        <div style={{ padding: "18px 16px" }}>{children}</div>

        {navOpen && (
          <div
            onClick={() => setNavOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(12,16,32,0.55)", zIndex: 40 }}
          />
        )}

        <div style={{
          position: "fixed", top: 0, left: 0, height: "100vh", width: "78%", maxWidth: 280,
          background: T.ink, zIndex: 50, padding: "20px 16px", display: "flex", flexDirection: "column",
          transform: navOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform .25s ease",
          boxShadow: navOpen ? "6px 0 24px rgba(0,0,0,0.35)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <img src={logoUrl} alt="" style={{ width: 30, height: 30, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p className="f-display" style={{ color: "#fff", fontSize: 14.5, fontStyle: "italic", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                <p style={{ color: "#8B93B8", fontSize: 10, margin: 0, whiteSpace: "nowrap" }}>
                  {role === "admin" ? "Espace administrateur" : "Espace membre · lecture seule"}
                </p>
              </div>
            </div>
            <button onClick={() => setNavOpen(false)} aria-label="Fermer le menu" style={{
              background: "transparent", border: `1px solid ${T.inkLine}`, borderRadius: 8, width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
            }}>
              <X size={15} color="#C7CCE3" />
            </button>
          </div>

          <NavButtons compact={false} />
          <FooterButtons />
        </div>
      </div>
    );
  }

  // ---- Ordinateur : menu fixe à gauche, réductible en rail d'icônes -------
  return (
    <div className="f-body app-shell" style={{ background: T.stone }}>
      <div
        className="app-sidebar"
        style={{
          background: T.ink,
          padding: navOpen ? "22px 16px" : "14px 10px",
          display: "flex",
          flexDirection: "column",
          width: !navOpen ? 64 : undefined,
          transition: "width .15s ease, padding .15s ease",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: navOpen ? "space-between" : "center",
          gap: 8, padding: navOpen ? "0 8px 22px" : "0 0 14px",
        }}>
          {navOpen && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <img src={logoUrl} alt="" style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p className="f-display" style={{ color: "#fff", fontSize: 15, fontStyle: "italic", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                <p style={{ color: "#8B93B8", fontSize: 10.5, margin: 0, whiteSpace: "nowrap" }}>
                  {role === "admin" ? "Espace administrateur" : "Espace membre · lecture seule"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setNavOpen((o) => !o)}
            aria-label={navOpen ? "Réduire le menu" : "Afficher le menu"}
            title={navOpen ? "Réduire le menu" : "Afficher le menu"}
            style={{
              background: "transparent", border: `1px solid ${T.inkLine}`, borderRadius: 8, width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0,
            }}
          >
            {navOpen ? <X size={15} color="#C7CCE3" /> : <Menu size={16} color="#C7CCE3" />}
          </button>
        </div>

        {navOpen ? (
          <>
            <NavButtons compact={false} />
            <FooterButtons />
          </>
        ) : (
          <NavButtons compact />
        )}
      </div>
      <div className="app-main">{children}</div>
    </div>
  );
}
