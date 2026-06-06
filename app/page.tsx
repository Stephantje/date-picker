"use client";
import { useState, useRef, useEffect } from "react";

const ACTIVITIES = [
  { id: "dinner",   emoji: "🍝", label: "Uit eten" },
  { id: "coffee",   emoji: "☕", label: "Koffie" },
  { id: "drinks",   emoji: "🍹", label: "Drankjes" },
  { id: "walk",     emoji: "🌸", label: "Wandelen" },
  { id: "movie",    emoji: "🎬", label: "Filmavond" },
  { id: "bowling",  emoji: "🎳", label: "Bowlen" },
  { id: "museum",   emoji: "🖼️", label: "Museum" },
  { id: "gallery",  emoji: "🎨", label: "Kunstgalerie" },
  { id: "theater",  emoji: "🎭", label: "Theater" },
  { id: "concert",  emoji: "🎶", label: "Concert" },
  { id: "cinema",   emoji: "🍿", label: "Bioscoop" },
  { id: "zoo",      emoji: "🦁", label: "Dierentuin" },
  { id: "aquarium", emoji: "🐠", label: "Aquarium" },
  { id: "park",     emoji: "🎢", label: "Pretpark" },
  { id: "escape",   emoji: "🧩", label: "Escape room" },
  { id: "golf",     emoji: "⛳", label: "Mini golf" },
  { id: "arcade",   emoji: "🕹️", label: "Arcade" },
  { id: "cooking",  emoji: "👨‍🍳", label: "Samen koken" },
  { id: "baking",   emoji: "🍪", label: "Bakken" },
  { id: "brunch",   emoji: "🥞", label: "Brunch" },
  { id: "icecream", emoji: "🍦", label: "IJs eten" },
  { id: "shopping", emoji: "🛍️", label: "Shoppen" },
  { id: "market",   emoji: "🧺", label: "Markt" },
  { id: "chill",    emoji: "🏠", label: "Thuis chillen" },
];

/* ── confetti ── */
function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<
    { id: number; left: number; dur: number; delay: number; emoji: string; size: number }[]
  >([]);

  useEffect(() => {
    if (!active) return;
    const pool = ["🌸","💕","✨","💗","🌺","💖","🎉","🥂","⭐"];
    const arr = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 2.8 + Math.random() * 2.5,
      delay: Math.random() * 1.8,
      emoji: pool[Math.floor(Math.random() * pool.length)],
      size: 0.9 + Math.random() * 0.9,
    }));
    setPieces(arr);
    setTimeout(() => setPieces([]), 7000);
  }, [active]);

  return (
    <>
      {pieces.map((p) => (
        <span key={p.id} className="petal" style={{
          left: `${p.left}%`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          fontSize: `${p.size}rem`,
        }}>
          {p.emoji}
        </span>
      ))}
    </>
  );
}

/* ── floating bg blobs ── */
function Blobs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      <div style={{ position: "absolute", top: "-80px", right: "-80px", width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle, rgba(253,164,175,.22) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(251,113,133,.15) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", top: "40%", left: "-40px", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,63,94,.08) 0%, transparent 70%)" }} />
    </div>
  );
}

/* ── progress bar ── */
function ProgBar({ step }: { step: number }) {
  return (
    <div className="prog-wrap">
      {[0,1,2].map((i) => (
        <div key={i} className={`prog-seg ${i === step ? "on" : i < step ? "done" : ""}`} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 0 — Ask
───────────────────────────────────────── */
function AskStep({ onYes }: { onYes: () => void }) {
  const noRef = useRef<HTMLButtonElement>(null);

  function flee(e: React.MouseEvent) {
    const btn = noRef.current; if (!btn) return;
    const bw = window.innerWidth, bh = window.innerHeight;
    let nx: number, ny: number;
    do {
      nx = Math.random() * (bw - 150);
      ny = Math.random() * (bh - 60);
    } while (Math.abs(nx - e.clientX) < 160 || Math.abs(ny - e.clientY) < 100);
    Object.assign(btn.style, { position: "fixed", left: nx + "px", top: ny + "px", zIndex: "50" });
  }

  return (
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      {/* animated gradient banner */}
      <div className="hero-banner">
        <span>💝</span>
      </div>

      <h1 className="font-display" style={{ fontSize: "2rem", lineHeight: 1.25, marginBottom: "0.65rem" }}>
        Hey, ik heb een<br />
        <em style={{ color: "var(--pink)" }}>belangrijke vraag</em>...
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: "2.25rem", lineHeight: 1.6 }}>
        Wil je op date met mij? 🥺
      </p>

      <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-yes" onClick={onYes}>
          Ja, natuurlijk! 🥰
        </button>
        <button ref={noRef} className="btn-no" onMouseEnter={flee} onClick={flee}>
          Nee... 😢
        </button>
      </div>

      <p style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "#d1d5db" }}>
        (er is maar één goed antwoord 😉)
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 1 — Activity
───────────────────────────────────────── */
function ActivityStep({ onNext }: { onNext: (a: string) => void }) {
  const [sel, setSel] = useState("");

  return (
    <div className="step-card" style={{ position: "relative", zIndex: 1 }}>
      <ProgBar step={0} />

      <div style={{ marginBottom: "1.25rem" }}>
        <h2 className="font-display" style={{ fontSize: "1.65rem" }}>Wat gaan we doen? 🗺️</h2>
      </div>

      <div className="activity-grid">
        {ACTIVITIES.map((a) => (
          <div key={a.id} className={`act-card ${sel === a.id ? "sel" : ""}`} onClick={() => setSel(a.id)}>
            <span className="act-ico">{a.emoji}</span>
            <span className="act-lbl">{a.label}</span>
          </div>
        ))}
      </div>

      <button className="btn-next" disabled={!sel} onClick={() => sel && onNext(sel)}>
        Volgende ✨
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 2 — Date & Time
───────────────────────────────────────── */
function DateTimeStep({ onNext }: { onNext: (d: string, t: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="step-card" style={{ position: "relative", zIndex: 1 }}>
      <ProgBar step={1} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h2 className="font-display" style={{ fontSize: "1.65rem" }}>Wanneer? 📅</h2>
        <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "0.3rem" }}>
          Kies een datum & tijd die jou uitkomt
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        <div className="field-wrap">
          <label className="field-label">Datum</label>
          <input type="date" className="field-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field-wrap">
          <label className="field-label">Tijd</label>
          <input type="time" className="field-input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <button className="btn-next" disabled={!date || !time} onClick={() => date && time && onNext(date, time)}>
        Bijna klaar 💕
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   MODAL — Confirm
───────────────────────────────────────── */
function ConfirmModal({ activity, date, time, onConfirm, onBack, loading }: {
  activity: string; date: string; time: string;
  onConfirm: () => void; onBack: () => void; loading: boolean;
}) {
  const act = ACTIVITIES.find((a) => a.id === activity)!;
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long",
  });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="modal-bg">
      <div className="modal-box">
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.8rem", marginBottom: "0.5rem" }}>🎉</div>
          <h2 className="font-display" style={{ fontSize: "1.7rem" }}>Ons dateplan!</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "0.3rem" }}>
            Even checken — klopt dit?
          </p>
        </div>

        <div style={{ background: "#fff8f9", borderRadius: "16px", padding: "0.25rem 1rem", marginBottom: "1.75rem", border: "1.5px solid var(--border)" }}>
          <div className="sum-row">
            <span className="sum-ico">{act.emoji}</span>
            <div>
              <div className="sum-label">Activiteit</div>
              <div className="sum-val">{act.label}</div>
            </div>
          </div>
          <div className="sum-row">
            <span className="sum-ico">📅</span>
            <div>
              <div className="sum-label">Datum</div>
              <div className="sum-val" style={{ textTransform: "capitalize" }}>{dateStr}</div>
            </div>
          </div>
          <div className="sum-row">
            <span className="sum-ico">⏰</span>
            <div>
              <div className="sum-label">Tijd</div>
              <div className="sum-val">{timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onBack} style={{
            flex: 1, background: "none", border: "1.5px solid var(--border)",
            borderRadius: "14px", padding: "0.85rem", cursor: "pointer",
            fontFamily: "inherit", color: "var(--muted)", fontSize: "0.92rem", fontWeight: 500,
          }}>
            ← Terug
          </button>
          <button className="btn-yes" style={{ flex: 2, borderRadius: "14px" }} onClick={onConfirm} disabled={loading}>
            {loading ? "Opslaan... 💾" : "Het is een date! 💖"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 3 — Success
───────────────────────────────────────── */
function SuccessStep() {
  return (
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: "4.5rem", marginBottom: "1.25rem" }}>🥰</div>
      <h2 className="font-display" style={{ fontSize: "2rem", color: "var(--pink)", marginBottom: "0.6rem" }}>
        Het is een date!
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
        Ik kan niet wachten! Ik zorg ervoor dat alles
        <br />
        <strong className="font-display" style={{ color: "var(--text)", fontSize: "1.1rem", fontStyle: "italic" }}>
          absoluut perfect wordt voor jou 💕
        </strong>
      </p>
      <div style={{
        background: "#fff8f9", borderRadius: "14px",
        padding: "1rem 1.25rem", fontSize: "0.9rem",
        color: "var(--muted)", border: "1.5px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
      }}>
        <span>✅</span>
        <span>Onze date is opgeslagen — ik tel de dagen af 🗓️</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
export default function Home() {
  const [step, setStep] = useState<"ask" | "activity" | "datetime" | "success">("ask");
  const [activity, setActivity] = useState("");
  const [date, setDate]         = useState("");
  const [time, setTime]         = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await fetch("/api/save-date", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity, date, time }),
      });
    } catch (e) { console.error(e); }
    setLoading(false);
    setShowModal(false);
    setShowConfetti(true);
    setStep("success");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", position: "relative" }}>
      <Blobs />
      <Confetti active={showConfetti} />

      {step === "ask"      && <AskStep onYes={() => setStep("activity")} />}
      {step === "activity" && <ActivityStep onNext={(a) => { setActivity(a); setStep("datetime"); }} />}
      {step === "datetime" && <DateTimeStep onNext={(d, t) => { setDate(d); setTime(t); setShowModal(true); }} />}
      {step === "success"  && <SuccessStep />}

      {showModal && (
        <ConfirmModal
          activity={activity} date={date} time={time}
          onConfirm={handleConfirm}
          onBack={() => setShowModal(false)}
          loading={loading}
        />
      )}
    </main>
  );
}
