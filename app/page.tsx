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
   CUSTOM TIME PICKER — scroll drum
───────────────────────────────────────── */
function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const [selH, setSelH] = useState(value ? value.split(":")[0] : "19");
  const [selM, setSelM] = useState(value ? value.split(":")[1] : "00");

  function pick(h: string, m: string) {
    setSelH(h); setSelM(m);
    onChange(`${h}:${m}`);
  }

  const ITEM_H = 44;
  const VISIBLE = 5;

  function Drum({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (v: string) => void }) {
    const ref = useRef<HTMLDivElement>(null);
    const selIdx = items.indexOf(selected);

    useEffect(() => {
      const el = ref.current; if (!el) return;
      el.scrollTop = selIdx * ITEM_H;
    }, [selIdx]);

    function onScroll() {
      const el = ref.current; if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, idx));
      if (items[clamped] !== selected) onSelect(items[clamped]);
    }

    return (
      <div style={{ position: "relative", flex: 1 }}>
        {/* top fade */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to bottom, white 0%, transparent 100%)", pointerEvents: "none", zIndex: 2, borderRadius: "12px 12px 0 0" }} />
        {/* bottom fade */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to top, white 0%, transparent 100%)", pointerEvents: "none", zIndex: 2, borderRadius: "0 0 12px 12px" }} />
        {/* selection highlight */}
        <div style={{
          position: "absolute", top: "50%", left: 8, right: 8,
          height: ITEM_H, transform: "translateY(-50%)",
          background: "var(--pink-pale)", borderRadius: "10px",
          border: "1.5px solid var(--border)", zIndex: 1, pointerEvents: "none",
        }} />
        {/* scroll container */}
        <div
          ref={ref}
          onScroll={onScroll}
          style={{
            height: ITEM_H * VISIBLE,
            overflowY: "scroll",
            scrollSnapType: "y mandatory",
            scrollbarWidth: "none",
            position: "relative", zIndex: 3,
          }}
        >
          {/* padding top/bottom so first/last item can center */}
          <div style={{ height: ITEM_H * 2 }} />
          {items.map((item) => (
            <div
              key={item}
              onClick={() => onSelect(item)}
              style={{
                height: ITEM_H,
                display: "flex", alignItems: "center", justifyContent: "center",
                scrollSnapAlign: "center",
                fontSize: item === selected ? "1.5rem" : "1.1rem",
                fontWeight: item === selected ? 700 : 400,
                color: item === selected ? "var(--pink)" : "var(--muted)",
                cursor: "pointer",
                transition: "font-size .15s, color .15s, font-weight .15s",
                userSelect: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {item}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
    );
  }

  return (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: "16px",
      overflow: "hidden", background: "white",
      display: "flex", alignItems: "stretch",
    }}>
      <Drum items={hours}   selected={selH} onSelect={(h) => pick(h, selM)} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, color: "var(--muted)", width: "24px", flexShrink: 0 }}>:</div>
      <Drum items={minutes} selected={selM} onSelect={(m) => pick(selH, m)} />
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 2 — Date & Time
───────────────────────────────────────── */
function DateTimeStep({ onNext }: { onNext: (d: string, t: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
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

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
        <div className="field-wrap">
          <label className="field-label">Datum</label>
          <input type="date" className="field-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field-wrap">
          <label className="field-label">Tijd</label>
          <TimePicker value={time} onChange={setTime} />
        </div>
      </div>

      <button className="btn-next" disabled={!date} onClick={() => date && onNext(date, time)}>
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
function SuccessStep({ activity, date, time }: { activity: string; date: string; time: string }) {
  const act = ACTIVITIES.find((a) => a.id === activity)!;
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", {
    hour: "2-digit", minute: "2-digit",
  });

  // Build .ics calendar file content
  function addToCalendar() {
    const [h, m]   = time.split(":").map(Number);
    const startDt  = new Date(date + "T" + time);
    const endDt    = new Date(startDt.getTime() + 2 * 60 * 60 * 1000); // +2 hours

    function fmt(d: Date) {
      return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//DatePicker//NL",
      "BEGIN:VEVENT",
      `DTSTART:${fmt(startDt)}`,
      `DTEND:${fmt(endDt)}`,
      `SUMMARY:📅 Date — ${act.label}`,
      `DESCRIPTION:Onze date: ${act.label}\\nDatum: ${dateStr}\\nTijd: ${timeStr}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "onze-date.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: "4.5rem", marginBottom: "1.25rem" }}>🥰</div>
      <h2 className="font-display" style={{ fontSize: "2rem", color: "var(--pink)", marginBottom: "0.5rem" }}>
        Het is een date!
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Ik kan niet wachten! Ik zorg ervoor dat alles perfect wordt 💕
      </p>

      {/* summary */}
      <div style={{ background: "#fff8f9", borderRadius: "16px", padding: "0.2rem 1rem", marginBottom: "1.25rem", border: "1.5px solid var(--border)", textAlign: "left" }}>
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

      {/* calendar button */}
      <button className="btn-yes" style={{ width: "100%", borderRadius: "14px", marginBottom: "0.75rem" }} onClick={addToCalendar}>
        📲 Zet in mijn agenda
      </button>

      <div style={{
        fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.5,
        background: "#f9fafb", borderRadius: "12px", padding: "0.75rem 1rem",
        border: "1px solid var(--border)",
      }}>
        ✅ Opgeslagen in Supabase — tik hierboven om toe te voegen aan je agenda
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
      {step === "success"  && <SuccessStep activity={activity} date={date} time={time} />}

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
