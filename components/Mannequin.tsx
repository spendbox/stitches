import { armPath, bodyPath, FIELDS, linePath, type Figure, type Overlay } from "@/lib/measurements";

type Props = {
  figure: Figure;
  /** Field key currently highlighted (tape-measure yellow). */
  active?: string | null;
  /** Field keys that have a value; drawn as soft guides. */
  measured?: string[];
  /** Draw every guide for this figure, faintly. */
  showAll?: boolean;
  className?: string;
  title?: string;
  /**
   * Zoom mode: draw inside a frame of this width/height ratio and zoom in on the
   * active measurement (or show the whole figure when nothing is active).
   */
  frame?: number;
};

const FULL = { x: -96, y: 0, w: 192, h: 432 };

/** The part of the figure to show for a field, padded and fitted to the frame's shape. */
export function focusBox(figure: Figure, key: string | null | undefined, aspect: number) {
  const o = FIELDS.find((f) => f.key === key)?.overlay[figure];
  let b = FULL;
  if (o) {
    if (o.kind === "ring") {
      const ry = o.ry ?? Math.max(2.5, o.rx * 0.2);
      const [hw, hh] = o.vertical ? [ry, o.rx] : [o.rx, ry];
      b = { x: o.cx - hw, y: o.y - hh, w: hw * 2, h: hh * 2 };
    } else {
      const xs = o.pts.map((p) => p[0]);
      const ys = o.pts.map((p) => p[1]);
      b = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
    }
    const pad = 26;
    b = { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 };
  }
  // Never zoom closer than this, so there is always some body around the tape.
  const MIN_W = 104;
  let w = Math.max(b.w, b.h * aspect, MIN_W);
  let h = w / aspect;
  if (!o) {
    h = Math.max(FULL.h + 8, FULL.w / aspect);
    w = h * aspect;
  }
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

function Ring({ o, state }: { o: Extract<Overlay, { kind: "ring" }>; state: "active" | "soft" }) {
  const ry = o.ry ?? Math.max(2.5, o.rx * 0.2);
  const cls = state === "active" ? "mq-active" : "mq-soft";
  if (o.vertical) {
    // A loop standing upright (e.g. armhole): ellipse wider vertically.
    return (
      <g className={cls}>
        <ellipse cx={o.cx} cy={o.y} rx={ry} ry={o.rx} className="mq-back" />
        <path d={`M${o.cx},${o.y - o.rx} A${ry},${o.rx} 0 0 1 ${o.cx},${o.y + o.rx}`} className="mq-front" />
      </g>
    );
  }
  return (
    <g className={cls}>
      <ellipse cx={o.cx} cy={o.y} rx={o.rx} ry={ry} className="mq-back" />
      <path d={`M${o.cx - o.rx},${o.y} A${o.rx},${ry} 0 0 0 ${o.cx + o.rx},${o.y}`} className="mq-front" />
      {state === "active" && (
        <>
          <circle cx={o.cx - o.rx} cy={o.y} r={2.2} className="mq-dot" />
          <circle cx={o.cx + o.rx} cy={o.y} r={2.2} className="mq-dot" />
        </>
      )}
    </g>
  );
}

function Line({ o, state }: { o: Extract<Overlay, { kind: "line" }>; state: "active" | "soft" }) {
  const a = o.pts[0];
  const b = o.pts[o.pts.length - 1];
  const horizontal = Math.abs(b[1] - a[1]) < Math.abs(b[0] - a[0]);
  const tick = (p: [number, number]) =>
    horizontal ? `M${p[0]},${p[1] - 4} L${p[0]},${p[1] + 4}` : `M${p[0] - 4},${p[1]} L${p[0] + 4},${p[1]}`;
  return (
    <g className={state === "active" ? "mq-active" : "mq-soft"}>
      <path d={linePath(o.pts)} className="mq-front mq-line" />
      <path d={`${tick(a)} ${tick(b)}`} className="mq-front" />
    </g>
  );
}

export default function Mannequin({ figure, active, measured = [], showAll, className, title, frame }: Props) {
  const gid = `mq-${figure}`;
  const guides = FIELDS.filter((f) => f.figures.includes(figure) && f.overlay[figure]);
  const soft = guides.filter((f) => f.key !== active && (showAll || measured.includes(f.key)));
  const act = guides.find((f) => f.key === active);

  // In zoom mode the SVG is a fixed frame and the drawing is moved/scaled inside it,
  // which lets the browser animate the zoom smoothly.
  const FW = 300;
  const box = frame ? focusBox(figure, active, frame) : null;
  const scale = box ? FW / box.w : 1;
  const zoomStyle = box ? { transform: `translate(${-box.x * scale}px, ${-box.y * scale}px) scale(${scale})` } : undefined;

  return (
    <svg
      viewBox={frame ? `0 0 ${FW} ${FW / frame}` : "-96 0 192 432"}
      className={className}
      role="img"
      aria-label={title ?? `${figure === "male" ? "Male" : "Female"} mannequin`}
    >
      <defs>
        <linearGradient id={`${gid}-skin`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--mq-shade)" />
          <stop offset="0.38" stopColor="var(--mq-fill)" />
          <stop offset="0.62" stopColor="var(--mq-fill)" />
          <stop offset="1" stopColor="var(--mq-shade)" />
        </linearGradient>
        <radialGradient id={`${gid}-head`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="var(--mq-fill)" />
          <stop offset="1" stopColor="var(--mq-shade)" />
        </radialGradient>
        <radialGradient id={`${gid}-floor`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--mq-stroke)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--mq-stroke)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className={frame ? "mq-zoom" : undefined} style={zoomStyle}>
      <ellipse cx="0" cy="423" rx="58" ry="7" fill={`url(#${gid}-floor)`} />

      <g className="mq-body">
        <path d={armPath(figure, -1)} fill={`url(#${gid}-skin)`} />
        <path d={armPath(figure, 1)} fill={`url(#${gid}-skin)`} />
        <path d={bodyPath(figure)} fill={`url(#${gid}-skin)`} />
        <ellipse cx="0" cy="32" rx="17" ry="22" fill={`url(#${gid}-head)`} />
      </g>

      {/* Dress-form seams: centre front and princess lines, sewn in dashes */}
      <g className="mq-seam">
        <path d="M0,74 L0,258" />
        {figure === "female" ? (
          <>
            <path d="M-24,84 C-26,112 -18,140 -16,170 C-15,190 -22,206 -26,226" />
            <path d="M24,84 C26,112 18,140 16,170 C15,190 22,206 26,226" />
          </>
        ) : (
          <>
            <path d="M-28,82 C-30,118 -24,150 -22,180 C-21,200 -24,214 -25,230" />
            <path d="M28,82 C30,118 24,150 22,180 C21,200 24,214 25,230" />
          </>
        )}
        <path d={figure === "female" ? "M-29,172 Q0,177 29,172" : "M-39,182 Q0,186 39,182"} />
      </g>

      {soft.map((f) => {
        const o = f.overlay[figure]!;
        return o.kind === "ring" ? <Ring key={f.key} o={o} state="soft" /> : <Line key={f.key} o={o} state="soft" />;
      })}
      {act &&
        (act.overlay[figure]!.kind === "ring" ? (
          <Ring o={act.overlay[figure] as Extract<Overlay, { kind: "ring" }>} state="active" />
        ) : (
          <Line o={act.overlay[figure] as Extract<Overlay, { kind: "line" }>} state="active" />
        ))}
      </g>
    </svg>
  );
}
