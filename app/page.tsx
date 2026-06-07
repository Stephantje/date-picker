"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const UNSPLASH_KEY = "6bHOJ7-00RT_T4CYj4ql2vRxNb_6kSMEjLmG2Kud5Ts";

const ACTIVITIES = [
  { id: "dinner",   emoji: "🍝", label: "Uit eten",    query: "romantic dinner restaurant candlelight" },
  { id: "drinks",   emoji: "🍹", label: "Drankjes",    query: "cocktails bar drinks evening" },
  { id: "walk",     emoji: "🌸", label: "Wandelen",    query: "couple walking park sunset" },
  { id: "arcade",   emoji: "🕹️", label: "Arcade",      query: "arcade games neon fun" },
  { id: "movie",    emoji: "🎬", label: "Filmavond",   query: "cozy movie night popcorn blanket" },
  { id: "bowling",  emoji: "🎳", label: "Bowlen",      query: "bowling alley colorful lanes" },
  { id: "museum",   emoji: "🖼️", label: "Museum",      query: "art museum gallery interior" },
  { id: "cinema",   emoji: "🍿", label: "Bioscoop",    query: "cinema theater popcorn screen" },
  { id: "zoo",      emoji: "🦁", label: "Dierentuin",  query: "zoo animals lion giraffe" },
  { id: "aquarium", emoji: "🐠", label: "Aquarium",    query: "aquarium fish underwater blue" },
  { id: "park",     emoji: "🎢", label: "Pretpark",    query: "amusement park roller coaster fun" },
  { id: "escape",   emoji: "🧩", label: "Escape room", query: "escape room puzzle mystery dark" },
  { id: "golf",     emoji: "⛳", label: "Mini golf",   query: "mini golf course colorful" },
  { id: "shopping", emoji: "🛍️", label: "Shoppen",     query: "shopping bags fashion city street" },
];

/* ── Unsplash fetch with in-memory cache ── */
const photoCache: Record<string, string> = {};

async function fetchPhoto(query: string): Promise<string> {
  if (photoCache[query]) return photoCache[query];
  try {
    const res = await fetch(
      `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    const data = await res.json();
    const url = data?.urls?.regular ?? "";
    photoCache[query] = url;
    return url;
  } catch {
    return "";
  }
}

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
        }}>{p.emoji}</span>
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
   STEP 0 — Ask  (with hero photo)
───────────────────────────────────────── */
function AskStep({ onYes }: { onYes: () => void }) {
  const noRef = useRef<HTMLButtonElement>(null);
  const [heroBg, setHeroBg] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    fetchPhoto("romantic couple sunset golden hour").then(setHeroBg);
  }, []);

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
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1, overflow: "hidden", padding: 0 }}>
      {/* Hero photo */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "220px",
        background: "linear-gradient(135deg, #fce4ec, #f8bbd0)",
        overflow: "hidden",
        borderRadius: "24px 24px 0 0",
      }}>
        {heroBg && (
          <img
            src={heroBg}
            alt=""
            onLoad={() => setImgLoaded(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        )}
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)",
        }} />
        {/* heart badge */}
        <div style={{
          position: "absolute", bottom: 16, left: "50%", transform: "translateX(-50%)",
          background: "rgba(255,255,255,0.18)", backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.35)",
          borderRadius: "50px", padding: "6px 18px",
          fontSize: "1.1rem", color: "#fff", fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          💝 Voor jou, Esmee
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1.75rem 1.5rem 1.75rem" }}>
        <h1 className="font-display" style={{ fontSize: "2rem", lineHeight: 1.25, marginBottom: "0.65rem" }}>
          <em style={{ color: "var(--pink)" }}>Esmee</em>...
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "1rem", marginBottom: "2rem", lineHeight: 1.6 }}>
          Gaan we op date? 🥺
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
    </div>
  );
}

/* ─────────────────────────────────────────
   Activity card with photo
───────────────────────────────────────── */
function ActivityCard({
  activity,
  selected,
  onClick,
}: {
  activity: typeof ACTIVITIES[number];
  selected: boolean;
  onClick: () => void;
}) {
  const [photo, setPhoto] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchPhoto(activity.query).then(setPhoto);
  }, [activity.query]);

  return (
    <div
      className={`act-card ${selected ? "sel" : ""}`}
      onClick={onClick}
      style={{ position: "relative", overflow: "hidden", padding: 0, aspectRatio: "1 / 1" }}
    >
      {/* photo bg */}
      {photo && (
        <img
          src={photo}
          alt={activity.label}
          onLoad={() => setLoaded(true)}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            opacity: loaded ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}
      {/* dark overlay — lighter when selected */}
      <div style={{
        position: "absolute", inset: 0,
        background: selected
          ? "linear-gradient(to bottom, rgba(244,63,94,0.35) 0%, rgba(244,63,94,0.6) 100%)"
          : "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.55) 100%)",
        transition: "background 0.25s ease",
      }} />
      {/* selected ring */}
      {selected && (
        <div style={{
          position: "absolute", inset: 0,
          border: "2.5px solid var(--pink)",
          borderRadius: "inherit",
          pointerEvents: "none",
        }} />
      )}
      {/* checkmark */}
      {selected && (
        <div style={{
          position: "absolute", top: 7, right: 7,
          width: 22, height: 22, borderRadius: "50%",
          background: "var(--pink)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.7rem", color: "#fff",
        }}>✓</div>
      )}
      {/* label */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "6px 4px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "1.1rem", marginBottom: "1px" }}>{activity.emoji}</div>
        <div style={{
          fontSize: "0.7rem", fontWeight: 600, color: "#fff",
          textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          lineHeight: 1.2,
        }}>{activity.label}</div>
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
          <ActivityCard
            key={a.id}
            activity={a}
            selected={sel === a.id}
            onClick={() => setSel(a.id)}
          />
        ))}
      </div>

      <button className="btn-next" disabled={!sel} onClick={() => sel && onNext(sel)}>
        Volgende ✨
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   DRUM — smooth scroll
───────────────────────────────────────── */
const ITEM_H  = 44;
const VISIBLE = 5;

function Drum({ items, selected, onSelect }: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const ref      = useRef<HTMLDivElement>(null);
  const settling = useRef(false);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selIdx   = items.indexOf(selected);

  const scrollToIdx = useCallback((idx: number, behavior: ScrollBehavior = "smooth") => {
    const el = ref.current; if (!el) return;
    settling.current = true;
    el.scrollTo({ top: idx * ITEM_H, behavior });
    setTimeout(() => { settling.current = false; }, 380);
  }, []);

  useEffect(() => { scrollToIdx(selIdx, "instant"); }, []); // eslint-disable-line

  const prevSel = useRef(selected);
  useEffect(() => {
    if (prevSel.current !== selected) {
      prevSel.current = selected;
      scrollToIdx(selIdx, "smooth");
    }
  }, [selected, selIdx, scrollToIdx]);

  function onScroll() {
    if (settling.current) return;
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const el = ref.current; if (!el) return;
      const nearest = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
      scrollToIdx(nearest, "smooth");
      if (items[nearest] !== selected) onSelect(items[nearest]);
    }, 120);
  }

  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to bottom, white 0%, transparent 100%)", pointerEvents: "none", zIndex: 2, borderRadius: "12px 12px 0 0" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: ITEM_H * 2, background: "linear-gradient(to top, white 0%, transparent 100%)", pointerEvents: "none", zIndex: 2, borderRadius: "0 0 12px 12px" }} />
      <div style={{ position: "absolute", top: "50%", left: 8, right: 8, height: ITEM_H, transform: "translateY(-50%)", background: "var(--pink-pale)", borderRadius: "10px", border: "1.5px solid var(--border)", zIndex: 1, pointerEvents: "none" }} />
      <div
        ref={ref}
        onScroll={onScroll}
        style={{ height: ITEM_H * VISIBLE, overflowY: "scroll", WebkitOverflowScrolling: "touch", scrollbarWidth: "none", msOverflowStyle: "none", position: "relative", zIndex: 3 } as React.CSSProperties}
      >
        <div style={{ height: ITEM_H * 2 }} />
        {items.map((item) => {
          const isSel = item === selected;
          return (
            <div key={item} onClick={() => { onSelect(item); scrollToIdx(items.indexOf(item), "smooth"); }} style={{ height: ITEM_H, display: "flex", alignItems: "center", justifyContent: "center", fontSize: isSel ? "1.5rem" : "1.1rem", fontWeight: isSel ? 700 : 400, color: isSel ? "var(--pink)" : "var(--muted)", cursor: "pointer", transition: "font-size .18s ease, color .18s ease", userSelect: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
    <div style={{ border: "1.5px solid var(--border)", borderRadius: "16px", overflow: "hidden", background: "white", display: "flex", alignItems: "stretch" }}>
      <Drum items={hours}   selected={selH} onSelect={pickH} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, color: "var(--muted)", width: "24px", flexShrink: 0 }}>:</div>
      <Drum items={minutes} selected={selM} onSelect={pickM} />
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 2 — Date & Time  (with activity photo header)
───────────────────────────────────────── */
function DateTimeStep({ activity, onNext }: { activity: string; onNext: (d: string, t: string) => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [photo, setPhoto] = useState("");
  const [loaded, setLoaded] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const act = ACTIVITIES.find((a) => a.id === activity)!;

  useEffect(() => {
    // reuse cached photo from step 1
    fetchPhoto(act.query).then(setPhoto);
  }, [act.query]);

  return (
    <div className="step-card" style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: 0 }}>
      {/* Activity photo header */}
      <div style={{ position: "relative", width: "100%", height: "140px", background: "#fce4ec", overflow: "hidden", borderRadius: "24px 24px 0 0" }}>
        {photo && (
          <img src={photo} alt="" onLoad={() => setLoaded(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))" }} />
        <div style={{ position: "absolute", bottom: 12, left: 16, color: "#fff" }}>
          <div style={{ fontSize: "1.5rem" }}>{act.emoji}</div>
          <div style={{ fontSize: "1rem", fontWeight: 700, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{act.label}</div>
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        <ProgBar step={1} />

        <div style={{ marginBottom: "1.5rem", marginTop: "0.5rem" }}>
          <h2 className="font-display" style={{ fontSize: "1.65rem" }}>Wanneer? 📅</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginTop: "0.3rem" }}>Kies een datum & tijd die jou uitkomt</p>
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
  const [photo, setPhoto] = useState("");
  const [loaded, setLoaded] = useState(false);
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long" });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => { fetchPhoto(act.query).then(setPhoto); }, [act.query]);

  return (
    <div className="modal-bg">
      <div className="modal-box" style={{ overflow: "hidden", padding: 0 }}>
        {/* photo header */}
        <div style={{ position: "relative", height: 130, background: "#fce4ec" }}>
          {photo && <img src={photo} alt="" onLoad={() => setLoaded(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.5s" }} />}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.5))" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: "2.2rem" }}>🎉</div>
            <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>Ons dateplan!</div>
          </div>
        </div>

        <div style={{ padding: "1.25rem 1.25rem 1.5rem" }}>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: "1.25rem" }}>Even checken — klopt dit?</p>

          <div style={{ background: "#fff8f9", borderRadius: "16px", padding: "0.25rem 1rem", marginBottom: "1.5rem", border: "1.5px solid var(--border)" }}>
            <div className="sum-row"><span className="sum-ico">{act.emoji}</span><div><div className="sum-label">Activiteit</div><div className="sum-val">{act.label}</div></div></div>
            <div className="sum-row"><span className="sum-ico">📅</span><div><div className="sum-label">Datum</div><div className="sum-val" style={{ textTransform: "capitalize" }}>{dateStr}</div></div></div>
            <div className="sum-row"><span className="sum-ico">⏰</span><div><div className="sum-label">Tijd</div><div className="sum-val">{timeStr}</div></div></div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={onBack} style={{ flex: 1, background: "none", border: "1.5px solid var(--border)", borderRadius: "14px", padding: "0.85rem", cursor: "pointer", fontFamily: "inherit", color: "var(--muted)", fontSize: "0.92rem", fontWeight: 500 }}>← Terug</button>
            <button className="btn-yes" style={{ flex: 2, borderRadius: "14px" }} onClick={onConfirm} disabled={loading}>
              {loading ? "Opslaan... 💾" : "Het is een date! 💖"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   STEP 3 — Success  (with photo)
───────────────────────────────────────── */
function SuccessStep({ activity, date, time }: { activity: string; date: string; time: string }) {
  const act = ACTIVITIES.find((a) => a.id === activity)!;
  const [photo, setPhoto] = useState("");
  const [loaded, setLoaded] = useState(false);
  const dateStr = new Date(date + "T12:00:00").toLocaleDateString("nl-NL", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeStr = new Date(`2000-01-01T${time}`).toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" });

  useEffect(() => { fetchPhoto(act.query).then(setPhoto); }, [act.query]);

  return (
    <div className="step-card" style={{ textAlign: "center", position: "relative", zIndex: 1, overflow: "hidden", padding: 0 }}>
      {/* big activity photo */}
      <div style={{ position: "relative", height: 200, background: "#fce4ec" }}>
        {photo && <img src={photo} alt="" onLoad={() => setLoaded(true)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.6s" }} />}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.55))" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: "3rem" }}>🥰</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>Het is een date!</div>
        </div>
      </div>

      <div style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Ik zorg ervoor dat alles perfect wordt 💕
        </p>
        <div style={{ background: "#fff8f9", borderRadius: "16px", padding: "0.2rem 1rem", border: "1.5px solid var(--border)", textAlign: "left" }}>
          <div className="sum-row"><span className="sum-ico">{act.emoji}</span><div><div className="sum-label">Activiteit</div><div className="sum-val">{act.label}</div></div></div>
          <div className="sum-row"><span className="sum-ico">📅</span><div><div className="sum-label">Datum</div><div className="sum-val" style={{ textTransform: "capitalize" }}>{dateStr}</div></div></div>
          <div className="sum-row"><span className="sum-ico">⏰</span><div><div className="sum-label">Tijd</div><div className="sum-val">{timeStr}</div></div></div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROOT
───────────────────────────────────────── */
export default function Home() {
  const [step, setStep]           = useState<"ask" | "activity" | "datetime" | "success">("ask");
  const [activity, setActivity]   = useState("");
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading]     = useState(false);
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
      {step === "datetime" && <DateTimeStep activity={activity} onNext={(d, t) => { setDate(d); setTime(t); setShowModal(true); }} />}
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