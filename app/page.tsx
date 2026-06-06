"use client";
import { useState, useRef, useEffect } from "react";

const ACTIVITIES = [
  { id: "dinner", emoji: "🍝", label: "Uit eten" },
  { id: "coffee", emoji: "☕", label: "Koffie" },
  { id: "drinks", emoji: "🍹", label: "Drankjes" },
  { id: "walk", emoji: "🌿", label: "Wandelen" },
  { id: "movie", emoji: "🎬", label: "Filmavond" },
  { id: "bowling", emoji: "🎳", label: "Bowlen" },
  { id: "museum", emoji: "🖼️", label: "Museum" },
  { id: "gallery", emoji: "🎨", label: "Kunstgalerie" },
  { id: "theater", emoji: "🎭", label: "Theater" },
  { id: "concert", emoji: "🎶", label: "Concert" },
  { id: "cinema", emoji: "🍿", label: "Bioscoop" },
  { id: "zoo", emoji: "🦁", label: "Dierentuin" },
  { id: "aquarium", emoji: "🐠", label: "Aquarium" },
  { id: "park", emoji: "🎢", label: "Pretpark" },
  { id: "escape", emoji: "🧩", label: "Escape room" },
  { id: "golf", emoji: "⛳", label: "Mini golf" },
  { id: "arcade", emoji: "🕹️", label: "Arcade" },
  { id: "cooking", emoji: "👨‍🍳", label: "Samen koken" },
  { id: "baking", emoji: "🍪", label: "Bakken" },
  { id: "brunch", emoji: "🥞", label: "Brunch" },
  { id: "icecream", emoji: "🍦", label: "IJs eten" },
  { id: "shopping", emoji: "🛍️", label: "Shoppen" },
  { id: "market", emoji: "🧺", label: "Markt" },
  { id: "chill", emoji: "🏠", label: "Thuis chillen" },
];

function Petals({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; dur: number; delay: number; char: string }[]>([]);
  useEffect(() => {
    if (!active) return;
    const chars = ["✦", "✧", "·", "✸", "✹", "◆", "◇"];
    const arr = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 2.5 + Math.random() * 2.5,
      delay: Math.random() * 1.5,
      char: chars[Math.floor(Math.random() * chars.length)],
    }));
    setPieces(arr);
    setTimeout(() => setPieces([]), 6000);
  }, [active]);

  return (
    <>
      {pieces.map((p) => (
        <span key={p.id} className="petal" style={{
          left: `${p.left}%`,
          animationDuration: `${p.dur}s`,
          animationDelay: `${p.delay}s`,
          fontSize: `${0.6 + Math.random() * 0.8}rem`,
          color: ["#e11d48", "#f43f5e", "#fb7185", "#fda4af"][Math.floor(Math.random() * 4)],
        }}>
          {p.char}
        </span>
      ))}
    </>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="progress-bar">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`prog-seg ${i === step ? "active" : i < step ? "done" : ""}`} />
      ))}
    </div>
  );
}

function AskStep({ onYes }: { onYes: () => void }) {
  const noRef = useRef<HTMLButtonElement>(null);

  function moveNo(e: React.MouseEvent) {
    const btn = noRef.current;
    if (!btn) return;
    const bw = window.innerWidth, bh = window.innerHeight;
    let nx: number, ny: number;
    do {
      nx = Math.random() * (bw - 140);
      ny = Math.random() * (bh - 60);
    } while (Math.abs(nx - e.clientX) < 150 || Math.abs(ny - e.clientY) < 100);
    btn.style.position = "fixed";
    btn.style.left = nx + "px";
    btn.style.top = ny + "px";
    btn.style.zIndex = "50";
  }

  return (
    <div className="step-card" style={{ textAlign: "center" }}>
      {/* Unsplash — romantic city lights, free to use */}
      <div style={{
        width: "100%",
        height: "200px",
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "2rem",
        position: "relative",
      }}>
        <img
          src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80&fit=crop"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
        }} />
        <p className="font-display" style={{
          position: "absolute", bottom: "1rem", left: "1.25rem",
          color: "white", fontSize: "1.5rem", fontStyle: "italic",
          textShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}>
          Hey hey 💌
        </p>
      </div>

      <h1 className="font-display" style={{ fontSize: "2rem", lineHeight: 1.2, marginBottom: "0.6rem" }}>
        Wil je op date
        <br />met mij?
      </h1>
      <p style={{ color: "var(--mid)", fontSize: "0.95rem", marginBottom: "2rem" }}>
        Kies zelf wat we gaan doen & wanneer.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={onYes}>
          Ja, natuurlijk 🥰
        </button>
        <button ref={noRef} className="btn-no" onMouseEnter={moveNo} onClick={moveNo}>
          Nee...
        </button>
      </div>
    </div>
  );
}

function ActivityStep({ onNext }: { onNext: (a: string) => void }) {
  const [selected, setSelected] = useState("");

  return (
    <div className="step-card">
      <ProgressBar step={0} />
      <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Wat gaan we doen?</h2>
      <p style={{ color: "var(--mid)", fontSize: "0.88rem", marginBottom: "1.25rem" }}>Scroll voor meer opties</p>

      <div className="activity-grid">
        {ACTIVITIES.map((a) => (
          <div
            key={a.id}
            className={`activity-card ${selected === a.id ? "selected" : ""}`}
            onClick={() => setSelected(a.id)}
          >
            <span className="act-emoji">{a.emoji}</span>
            <span className="act-label">{a.label}</span>
          </div>
        ))}
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%" }}
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
      >
        Volgende →
      </button>
    </div>
  );
}

function DateTimeStep({ onNext }: { onNext: (d: string, t: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="step-card">
      <ProgressBar step={1} />
      <h2 className="font-display" style={{ fontSize: "1.6rem", marginBottom: "0.25rem" }}>Wanneer?</h2>
      <p style={{ color: "var(--mid)", fontSize: "0.88rem", marginBottom: "1.75rem" }}>Kies een datum & tijd</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
        <div>
          <label className="field-label">Datum</label>
          <input type="date" className="date-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="field-label">Tijd</label>
          <input type="time" className="time-input" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <button
        className="btn-primary"
        style={{ width: "100%" }}
        onClick={() => date && time && onNext(date, time)}
        disabled={!date || !time}
      >
        Bevestig →
      </button>
    </div>
  );
}

function ConfirmModal({ activity, date, time, onConfirm, onBack, loading }: {
  activity: string; date: string; time: string;
  onConfirm: () => void; onBack: () => void; loading: boolean;
}) {
  const act = ACTIVITIES.find((a) => a.id === activity)!;
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long"
  });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", {
    hour: "2-digit", minute: "2-digit"
  });

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <p style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--mid)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
          Bevestig je date
        </p>
        <h2 className="font-display" style={{ fontSize: "1.7rem", marginBottom: "1.5rem" }}>
          Ziet dit er goed uit?
        </h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <div className="summary-row">
            <span style={{ fontSize: "1.4rem", width: "32px", textAlign: "center" }}>{act.emoji}</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--mid)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Activiteit</div>
              <div style={{ fontWeight: 500 }}>{act.label}</div>
            </div>
          </div>
          <div className="summary-row">
            <span style={{ fontSize: "1.2rem", width: "32px", textAlign: "center" }}>📅</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--mid)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Datum</div>
              <div style={{ fontWeight: 500, textTransform: "capitalize" }}>{dateStr}</div>
            </div>
          </div>
          <div className="summary-row">
            <span style={{ fontSize: "1.2rem", width: "32px", textAlign: "center" }}>⏰</span>
            <div>
              <div style={{ fontSize: "0.75rem", color: "var(--mid)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Tijd</div>
              <div style={{ fontWeight: 500 }}>{timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button onClick={onBack} style={{
            flex: 1, background: "none", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "0.85rem", cursor: "pointer",
            fontFamily: "inherit", color: "var(--mid)", fontSize: "0.9rem"
          }}>
            ← Terug
          </button>
          <button className="btn-primary" style={{ flex: 2 }} onClick={onConfirm} disabled={loading}>
            {loading ? "Opslaan..." : "Het is een date! 💖"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="step-card" style={{ textAlign: "center" }}>
      <div style={{
        width: "100%", height: "180px",
        borderRadius: "14px", overflow: "hidden",
        marginBottom: "2rem", position: "relative",
      }}>
        <img
          src="https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80&fit=crop"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)",
        }} />
      </div>

      <h2 className="font-display" style={{ fontSize: "2rem", marginBottom: "0.6rem" }}>
        Het is een date 🎉
      </h2>
      <p style={{ color: "var(--mid)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
        Ik zorg dat het een goede avond wordt.
      </p>
      <div style={{
        background: "#f9fafb", borderRadius: "12px",
        padding: "1rem 1.25rem", fontSize: "0.88rem", color: "var(--mid)",
        border: "1px solid var(--border)"
      }}>
        ✓ Opgeslagen — ik tel de dagen af
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<"ask" | "activity" | "datetime" | "success">("ask");
  const [activity, setActivity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPetals, setShowPetals] = useState(false);

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
    setShowPetals(true);
    setStep("success");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <Petals active={showPetals} />

      {step === "ask" && <AskStep onYes={() => setStep("activity")} />}
      {step === "activity" && <ActivityStep onNext={(a) => { setActivity(a); setStep("datetime"); }} />}
      {step === "datetime" && <DateTimeStep onNext={(d, t) => { setDate(d); setTime(t); setShowModal(true); }} />}

      {showModal && (
        <ConfirmModal
          activity={activity} date={date} time={time}
          onConfirm={handleConfirm}
          onBack={() => setShowModal(false)}
          loading={loading}
        />
      )}
      {step === "success" && <SuccessStep />}
    </main>
  );
}
