"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const ACTIVITIES = [
  { id: "dinner",   emoji: "🍝", label: "Uit eten" },
  { id: "drinks",   emoji: "🍹", label: "Drankjes" },
  { id: "walk",     emoji: "🌸", label: "Wandelen" },
  { id: "arcade",   emoji: "🕹️", label: "Arcade" },
  { id: "movie",    emoji: "🎬", label: "Filmavond" },
  { id: "bowling",  emoji: "🎳", label: "Bowlen" },
  { id: "museum",   emoji: "🖼️", label: "Museum" },
  { id: "cinema",   emoji: "🍿", label: "Bioscoop" },
  { id: "zoo",      emoji: "🦁", label: "Dierentuin" },
  { id: "aquarium", emoji: "🐠", label: "Aquarium" },
  { id: "park",     emoji: "🎢", label: "Pretpark" },
  { id: "escape",   emoji: "🧩", label: "Escape room" },
  { id: "golf",     emoji: "⛳", label: "Mini golf" },
  { id: "shopping", emoji: "🛍️", label: "Shoppen" },
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
      <div className="hero-banner">
        <span>💝</span>
      </div>

      <h1 className="font-display" style={{ fontSize: "2rem", lineHeight: 1.25, marginBottom: "0.65rem" }}>
        <em style={{ color: "var(--pink)" }}>Esmee</em>...
      </h1>
      <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: "2.25rem", lineHeight: 1.6 }}>
        Gaan we op date?
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
   CUSTOM TIME PICKER — smooth scroll drum
───────────────────────────────────────── */
const ITEM_H  = 44;
const VISIBLE = 5;

function Drum({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const ref       = useRef<HTMLDivElement>(null);
  const settling  = useRef(false);   // true while programmatic scroll is running
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selIdx = items.indexOf(selected);

  /* ── scroll to index smoothly ── */
  const scrollToIdx = useCallback(
    (idx: number, behavior: ScrollBehavior = "smooth") => {
      const el = ref.current;
      if (!el) return;
      settling.current = true;
      el.scrollTo({ top: idx * ITEM_H, behavior });
      // Clear settling flag after animation finishes (~350 ms is enough for smooth)
      setTimeout(() => { settling.current = false; }, 380);
    },
    []
  );

  /* ── initial position (instant, no animation) ── */
  useEffect(() => {
    scrollToIdx(selIdx, "instant");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── when selected changes from outside, follow smoothly ── */
  const prevSel = useRef(selected);
  useEffect(() => {
    if (prevSel.current !== selected) {
      prevSel.current = selected;
      scrollToIdx(selIdx, "smooth");
    }
  }, [selected, selIdx, scrollToIdx]);

  /* ── debounced snap-to-nearest on scroll end ── */
  function onScroll() {
    if (settling.current) return;

    if (snapTimer.current) clearTimeout(snapTimer.current);

    snapTimer.current = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rawIdx  = el.scrollTop / ITEM_H;
      const nearest = Math.max(0, Math.min(items.length - 1, Math.round(rawIdx)));

      // Snap smoothly to grid
      scrollToIdx(nearest, "smooth");

      // Only fire callback when value actually changes
      if (items[nearest] !== selected) {
        onSelect(items[nearest]);
      }
    }, 120); // wait 120 ms after last scroll event before snapping
  }

  return (
    <div style={{ position: "relative", flex: 1 }}>
      {/* top fade */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        height: ITEM_H * 2,
        background: "linear-gradient(to bottom, white 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 2, borderRadius: "12px 12px 0 0",
      }} />
      {/* bottom fade */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: ITEM_H * 2,
        background: "linear-gradient(to top, white 0%, transparent 100%)",
        pointerEvents: "none", zIndex: 2, borderRadius: "0 0 12px 12px",
      }} />
      {/* selection highlight */}
      <div style={{
        position: "absolute", top: "50%", left: 8, right: 8,
        height: ITEM_H, transform: "translateY(-50%)",
        background: "var(--pink-pale)", borderRadius: "10px",
        border: "1.5px solid var(--border)", zIndex: 1, pointerEvents: "none",
      }} />

      {/* scroll container — native momentum + no visible scrollbar */}
      <div
        ref={ref}
        onScroll={onScroll}
        style={{
          height: ITEM_H * VISIBLE,
          overflowY: "scroll",
          /* smooth momentum on iOS / trackpads */
          WebkitOverflowScrolling: "touch",
          /* hide scrollbar cross-browser */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          position: "relative", zIndex: 3,
          /* NO scroll-snap on the container — we handle snapping manually
             so it doesn't fight with momentum scrolling */
        } as React.CSSProperties}
      >
        <div style={{ height: ITEM_H * 2 }} />
        {items.map((item) => {
          const isSelected = item === selected;
          return (
            <div
              key={item}
              onClick={() => {
                onSelect(item);
                scrollToIdx(items.indexOf(item), "smooth");
              }}
              style={{
                height: ITEM_H,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: isSelected ? "1.5rem" : "1.1rem",
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? "var(--pink)" : "var(--muted)",
                cursor: "pointer",
                transition: "font-size .18s ease, color .18s ease, font-weight .18s ease",
                userSelect: "none",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {item}
            </div>
          );
        })}
        <div style={{ height: ITEM_H * 2 }} />
      </div>
    </div>
  );
}

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const hours   = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
  const minutes = ["00", "15", "30", "45"];

  const [selH, setSelH] = useState(value ? value.split(":")[0] : "19");
  const [selM, setSelM] = useState(value ? value.split(":")[1] : "00");

  function pickH(h: string) { setSelH(h); onChange(`${h}:${selM}`); }
  function pickM(m: string) { setSelM(m); onChange(`${selH}:${m}`); }

  return (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: "16px",
      overflow: "hidden", background: "white",
      display: "flex", alignItems: "stretch",
    }}>
      <Drum items={hours}   selected={selH} onSelect={pickH} />
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.6rem", fontWeight: 700, color: "var(--muted)",
        width: "24px", flexShrink: 0,
      }}>
        :
      </div>
      <Drum items={minutes} selected={selM} onSelect={pickM} />
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

  return (
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      <div style={{ fontSize: "4.5rem", marginBottom: "1.25rem" }}>🥰</div>
      <h2 className="font-display" style={{ fontSize: "2rem", color: "var(--pink)", marginBottom: "0.5rem" }}>
        Het is een date!
      </h2>
      <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
        Ik zorg ervoor dat alles perfect wordt 💕
      </p>

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