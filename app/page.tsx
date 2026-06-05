"use client";
import { useState, useRef, useEffect } from "react";

const ACTIVITIES = [
  { id: "dinner", emoji: "🍝", label: "Dineren", desc: "Gezellig restaurantje" },
  { id: "picnic", emoji: "🧺", label: "Picknick", desc: "Kleedje + lekker eten" },
  { id: "movie", emoji: "🎬", label: "Filmavond", desc: "Popcorn & knuffelen" },
  { id: "walk", emoji: "🌸", label: "Zonsondergang wandeling", desc: "Gouden uurtje samen" },
  { id: "cooking", emoji: "👨‍🍳", label: "Samen koken", desc: "Iets lekkers maken" },
  { id: "bowling", emoji: "🎳", label: "Bowlen", desc: "Vriendelijke competitie" },
  { id: "coffee", emoji: "☕", label: "Koffie & Taart", desc: "Ontspannen middagje" },
  { id: "museum", emoji: "🎨", label: "Museum bezoek", desc: "Kunst & cultuur dag" },
];

function Petals({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<{ id: number; left: number; dur: number; delay: number; emoji: string }[]>([]);

  useEffect(() => {
    if (!active) return;
    const emojis = ["🌸", "💕", "🌹", "✨", "💗", "🌺", "💖"];
    const arr = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      dur: 3 + Math.random() * 3,
      delay: Math.random() * 2,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 7000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <>
      {pieces.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{ left: `${p.left}%`, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s`, fontSize: `${1 + Math.random()}rem` }}
        >
          {p.emoji}
        </span>
      ))}
    </>
  );
}

function FloatingDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="float-a absolute top-16 left-8 text-5xl opacity-20">🌸</div>
      <div className="float-b absolute top-24 right-12 text-4xl opacity-15">💕</div>
      <div className="float-a absolute bottom-32 left-16 text-3xl opacity-20" style={{ animationDelay: "2s" }}>✨</div>
      <div className="float-b absolute bottom-20 right-8 text-4xl opacity-15" style={{ animationDelay: "1s" }}>🌹</div>
      <div className="float-a absolute top-1/2 left-4 text-2xl opacity-10" style={{ animationDelay: "3s" }}>💗</div>
      <div className="float-b absolute top-1/3 right-4 text-2xl opacity-10" style={{ animationDelay: "0.5s" }}>🌺</div>
      <div style={{ position: "absolute", top: "-10%", right: "-5%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(244,63,94,0.07) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: "-10%", left: "-5%", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,113,133,0.07) 0%, transparent 70%)" }} />
    </div>
  );
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="progress-dots">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`dot ${i === step ? "active" : i < step ? "done" : ""}`} />
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
      nx = Math.random() * (bw - 120);
      ny = Math.random() * (bh - 60);
    } while (Math.abs(nx - e.clientX) < 120 || Math.abs(ny - e.clientY) < 80);
    btn.style.position = "fixed";
    btn.style.left = nx + "px";
    btn.style.top = ny + "px";
    btn.style.zIndex = "50";
  }

  return (
    <div className="step-card" style={{ textAlign: "center" }}>
      <div className="heartbeat" style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>💝</div>
      <h1 className="font-display" style={{ fontSize: "2.2rem", color: "var(--charcoal)", lineHeight: 1.2, marginBottom: "0.75rem" }}>
        Hey hey 💕
      </h1>
      <p style={{ color: "var(--warm-gray)", fontSize: "1.1rem", marginBottom: "2.5rem", lineHeight: 1.6 }}>
        <em className="font-display" style={{ color: "var(--rose)", fontSize: "1.3rem" }}>Wil je op date met mij?</em>
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={onYes} style={{ fontSize: "1.1rem", padding: "1rem 3rem" }}>
          Ja, natuurlijk! 🥰
        </button>
        <button
          ref={noRef}
          className="btn-no"
          onMouseEnter={moveNo}
          onClick={moveNo}
        >
          Nee... 😢
        </button>
      </div>
    </div>
  );
}

function ActivityStep({ onNext }: { onNext: (activity: string) => void }) {
  const [selected, setSelected] = useState<string>("");

  return (
    <div className="step-card">
      <ProgressDots step={0} />
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🗺️</div>
        <h2 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
          Wat gaan we doen?
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
        {ACTIVITIES.map((a) => (
          <div
            key={a.id}
            className={`activity-card ${selected === a.id ? "selected" : ""}`}
            onClick={() => setSelected(a.id)}
          >
            <div style={{ fontSize: "2rem", marginBottom: "0.3rem" }}>{a.emoji}</div>
            <div style={{ fontWeight: 500, fontSize: "0.9rem", color: "var(--charcoal)" }}>{a.label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--warm-gray)", marginTop: "0.2rem" }}>{a.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <button
          className="btn-primary"
          onClick={() => selected && onNext(selected)}
          style={{ opacity: selected ? 1 : 0.4, cursor: selected ? "pointer" : "not-allowed" }}
        >
          Volgende stap ✨
        </button>
      </div>
    </div>
  );
}

function DateTimeStep({ onNext }: { onNext: (date: string, time: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="step-card">
      <ProgressDots step={1} />
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📅</div>
        <h2 className="font-display" style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
          Wanneer is onze date?
        </h2>
        <p style={{ color: "var(--warm-gray)", fontSize: "0.95rem" }}>Kies een datum & tijd die jou uitkomt 🌙</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "2rem" }}>
        <div>
          <label style={{ display: "block", fontWeight: 500, marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--warm-gray)" }}>
            📆 Kies een datum
          </label>
          <input
            type="date"
            className="date-input"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label style={{ display: "block", fontWeight: 500, marginBottom: "0.5rem", fontSize: "0.9rem", color: "var(--warm-gray)" }}>
            ⏰ Kies een tijd
          </label>
          <input
            type="time"
            className="time-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          className="btn-primary"
          onClick={() => date && time && onNext(date, time)}
          style={{ opacity: date && time ? 1 : 0.4, cursor: date && time ? "pointer" : "not-allowed" }}
        >
          Bijna klaar 💕
        </button>
      </div>
    </div>
  );
}

function ConfirmModal({
  activity, date, time, onConfirm, onBack, loading
}: {
  activity: string; date: string; time: string; onConfirm: () => void; onBack: () => void; loading: boolean;
}) {
  const act = ACTIVITIES.find((a) => a.id === activity)!;
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🎉</div>
        <h2 className="font-display" style={{ fontSize: "1.9rem", marginBottom: "0.5rem", color: "var(--charcoal)" }}>
          Ons dateplan!
        </h2>
        <div style={{ background: "var(--rose-pale)", borderRadius: "18px", padding: "1.5rem", marginBottom: "2rem", textAlign: "left" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "2rem" }}>{act.emoji}</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{act.label}</div>
              <div style={{ color: "var(--warm-gray)", fontSize: "0.85rem" }}>{act.desc}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--warm-gray)", marginBottom: "0.2rem" }}>DATUM</div>
              <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>📅 {dateStr}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.78rem", color: "var(--warm-gray)", marginBottom: "0.2rem" }}>TIJD</div>
              <div style={{ fontWeight: 500, fontSize: "0.95rem" }}>⏰ {timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button onClick={onBack} style={{ background: "none", border: "2px solid #f3f4f6", borderRadius: "50px", padding: "0.75rem 1.5rem", cursor: "pointer", color: "var(--warm-gray)", fontFamily: "inherit" }}>
            ← Terug
          </button>
          <button className="btn-primary" onClick={onConfirm} disabled={loading}>
            {loading ? "Opslaan... 💾" : "Het is een date! 💖"}
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessStep() {
  return (
    <div className="step-card" style={{ textAlign: "center" }}>
      <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🥰</div>
      <h2 className="font-display" style={{ fontSize: "2.2rem", marginBottom: "0.75rem", color: "var(--rose)" }}>
        Het is een date!
      </h2>
      <p style={{ color: "var(--warm-gray)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
        Ik kan niet wachten! Ik zorg ervoor dat alles
        <br />
        <strong className="font-display" style={{ color: "var(--charcoal)", fontSize: "1.15rem" }}>absoluut perfect wordt voor jou 💕</strong>
      </p>
      <div style={{ background: "var(--rose-pale)", borderRadius: "16px", padding: "1.2rem", fontSize: "0.95rem", color: "var(--warm-gray)" }}>
        ✅ Onze date is opgeslagen! Ik tel de dagen af... 🗓️
      </div>
    </div>
  );
}

export default function Home() {
  const [step, setStep] = useState<"ask" | "activity" | "datetime" | "confirm" | "success">("ask");
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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setShowModal(false);
    setShowPetals(true);
    setStep("success");
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem" }}>
      <FloatingDecorations />
      <Petals active={showPetals} />

      {step === "ask" && (
        <AskStep onYes={() => setStep("activity")} />
      )}
      {step === "activity" && (
        <ActivityStep onNext={(a) => { setActivity(a); setStep("datetime"); }} />
      )}
      {step === "datetime" && (
        <DateTimeStep onNext={(d, t) => { setDate(d); setTime(t); setShowModal(true); }} />
      )}
      {step === "datetime" && showModal && (
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
