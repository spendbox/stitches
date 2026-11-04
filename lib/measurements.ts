// Measurement definitions and the mannequin geometry they map onto.
// All figure coordinates are in a viewBox where x=0 is the centre line.

export type Figure = "female" | "male";
export type Pt = [number, number];

export type Overlay =
  | { kind: "ring"; cx: number; y: number; rx: number; ry?: number; vertical?: boolean }
  | { kind: "line"; pts: Pt[] };

export type FieldDef = {
  key: string;
  label: string | Record<Figure, string>;
  hint: string;
  group: "Upper body" | "Arms" | "Lower body" | "Full length";
  figures: Figure[];
  overlay: Record<Figure, Overlay | null>;
};

const both: Figure[] = ["female", "male"];

export const FIELDS: FieldDef[] = [
  {
    key: "neck", label: "Neck", hint: "Around the base of the neck", group: "Upper body", figures: both,
    overlay: { female: { kind: "ring", cx: 0, y: 70, rx: 10 }, male: { kind: "ring", cx: 0, y: 70, rx: 13 } },
  },
  {
    key: "shoulder", label: "Shoulder", hint: "Across the back, shoulder tip to tip", group: "Upper body", figures: both,
    overlay: {
      female: { kind: "line", pts: [[-45, 88], [45, 88]] },
      male: { kind: "line", pts: [[-53, 87], [53, 87]] },
    },
  },
  {
    key: "chest", label: { female: "Bust", male: "Chest" }, hint: "Around the fullest part", group: "Upper body", figures: both,
    overlay: { female: { kind: "ring", cx: 0, y: 128, rx: 44 }, male: { kind: "ring", cx: 0, y: 128, rx: 51 } },
  },
  {
    key: "under_bust", label: "Under bust", hint: "Just below the bust line", group: "Upper body", figures: ["female"],
    overlay: { female: { kind: "ring", cx: 0, y: 148, rx: 37 }, male: null },
  },
  {
    key: "waist", label: "Waist", hint: "Around the natural waistline", group: "Upper body", figures: both,
    overlay: { female: { kind: "ring", cx: 0, y: 172, rx: 30 }, male: { kind: "ring", cx: 0, y: 180, rx: 40 } },
  },
  {
    key: "hips", label: "Hips", hint: "Around the fullest part of the hips", group: "Upper body", figures: both,
    overlay: { female: { kind: "ring", cx: 0, y: 222, rx: 46 }, male: { kind: "ring", cx: 0, y: 222, rx: 42 } },
  },
  {
    key: "top_length", label: "Top length", hint: "Shoulder to the desired hem", group: "Upper body", figures: both,
    overlay: {
      female: { kind: "line", pts: [[22, 84], [22, 240]] },
      male: { kind: "line", pts: [[26, 82], [26, 246]] },
    },
  },
  {
    key: "armhole", label: "Armhole", hint: "Around the arm where it meets the shoulder", group: "Arms", figures: both,
    overlay: {
      female: { kind: "ring", cx: 47, y: 106, rx: 14, ry: 6, vertical: true },
      male: { kind: "ring", cx: 55, y: 106, rx: 15, ry: 7, vertical: true },
    },
  },
  {
    key: "bicep", label: "Upper arm", hint: "Around the fullest part of the upper arm", group: "Arms", figures: both,
    overlay: { female: { kind: "ring", cx: 51, y: 140, rx: 7 }, male: { kind: "ring", cx: 58, y: 140, rx: 8 } },
  },
  {
    key: "sleeve_length", label: "Sleeve length", hint: "Shoulder tip to wrist", group: "Arms", figures: both,
    overlay: {
      female: { kind: "line", pts: [[48, 94], [56, 130], [60, 180], [66, 226]] },
      male: { kind: "line", pts: [[56, 94], [64, 130], [67, 180], [70, 226]] },
    },
  },
  {
    key: "wrist", label: "Wrist", hint: "Around the wrist bone", group: "Arms", figures: both,
    overlay: { female: { kind: "ring", cx: 61, y: 224, rx: 6 }, male: { kind: "ring", cx: 65, y: 226, rx: 6 } },
  },
  {
    key: "thigh", label: "Thigh", hint: "Around the fullest part of the thigh", group: "Lower body", figures: both,
    overlay: { female: { kind: "ring", cx: 20, y: 276, rx: 17 }, male: { kind: "ring", cx: 21, y: 278, rx: 16 } },
  },
  {
    key: "knee", label: "Knee", hint: "Around the knee", group: "Lower body", figures: both,
    overlay: { female: { kind: "ring", cx: 19, y: 334, rx: 10 }, male: { kind: "ring", cx: 20, y: 334, rx: 11 } },
  },
  {
    key: "ankle", label: "Trouser bottom", hint: "Around the ankle or trouser opening", group: "Lower body", figures: both,
    overlay: { female: { kind: "ring", cx: 15, y: 398, rx: 7 }, male: { kind: "ring", cx: 16, y: 398, rx: 8 } },
  },
  {
    key: "inseam", label: "Inseam", hint: "Crotch to ankle, inside leg", group: "Lower body", figures: both,
    overlay: {
      female: { kind: "line", pts: [[8, 268], [12, 330], [12, 400]] },
      male: { kind: "line", pts: [[8, 268], [12, 330], [12, 400]] },
    },
  },
  {
    key: "trouser_length", label: "Trouser length", hint: "Waist to ankle, outside leg", group: "Lower body", figures: both,
    overlay: {
      female: { kind: "line", pts: [[-31, 172], [-46, 224], [-38, 272], [-29, 330], [-21, 400]] },
      male: { kind: "line", pts: [[-40, 180], [-41, 232], [-38, 272], [-31, 330], [-23, 400]] },
    },
  },
  {
    key: "dress_length", label: "Dress length", hint: "Shoulder to the desired hem", group: "Full length", figures: ["female"],
    overlay: { female: { kind: "line", pts: [[-22, 84], [-22, 344]] }, male: null },
  },
  {
    key: "height", label: "Height", hint: "Top of head to floor", group: "Full length", figures: both,
    overlay: {
      female: { kind: "line", pts: [[-80, 10], [-80, 422]] },
      male: { kind: "line", pts: [[-84, 10], [-84, 422]] },
    },
  },
];

export const GROUPS = ["Upper body", "Arms", "Lower body", "Full length"] as const;

export function fieldLabel(f: FieldDef, figure: Figure) {
  return typeof f.label === "string" ? f.label : f.label[figure];
}

export function fieldsFor(figure: Figure) {
  return FIELDS.filter((f) => f.figures.includes(figure));
}

export function toFigure(gender: string | null | undefined): Figure {
  return gender === "male" ? "male" : "female";
}

export type Extra = { label: string; value: string };
export type MeasurementValues = Record<string, number>;

export function formatValue(v: number | undefined | null, unit: string) {
  if (v === undefined || v === null || Number.isNaN(v)) return "—";
  const n = Math.round(v * 100) / 100;
  return `${n}${unit === "cm" ? " cm" : "″"}`;
}

/* ---------------- Mannequin geometry ---------------- */

// Right-hand outline from the neck, down the body, round the foot and back up the inside leg to the crotch.
const BODY_R: Record<Figure, Pt[]> = {
  female: [
    [7, 48], [8, 72], [18, 80], [34, 84], [44, 89], [47, 100], [45, 114], [44, 126], [40, 142], [34, 157],
    [29, 172], [31, 187], [38, 203], [44, 220], [44, 236], [41, 254], [37, 274], [33, 297], [29, 320],
    [28, 334], [27, 350], [24, 374], [19, 396], [20, 408], [27, 415], [27, 421], [9, 421], [8, 410],
    [9, 396], [11, 372], [11, 350], [10, 334], [9, 318], [8, 296], [6, 277], [3, 265], [0, 262],
  ],
  male: [
    [10, 48], [11, 71], [22, 79], [40, 83], [52, 88], [55, 101], [53, 117], [50, 135], [46, 153], [41, 169],
    [39, 184], [39, 199], [40, 215], [41, 232], [40, 252], [37, 274], [34, 297], [31, 320], [30, 334],
    [29, 350], [26, 374], [21, 396], [22, 408], [29, 415], [29, 421], [9, 421], [8, 410], [9, 396],
    [11, 372], [11, 350], [10, 334], [9, 318], [8, 296], [6, 277], [3, 265], [0, 262],
  ],
};

const ARM_R: Record<Figure, Pt[]> = {
  female: [
    [42, 90], [51, 96], [55, 110], [56, 128], [57, 147], [59, 166], [61, 184], [63, 200], [64, 214],
    [66, 225], [69, 237], [67, 249], [62, 253], [58, 247], [57, 236], [56, 226], [54, 213], [51, 197],
    [49, 181], [47, 165], [46, 149], [44, 133], [42, 118],
  ],
  male: [
    [50, 89], [59, 96], [63, 110], [64, 128], [64, 147], [66, 166], [67, 184], [68, 200], [69, 214],
    [70, 226], [73, 238], [71, 251], [66, 255], [62, 249], [61, 237], [60, 226], [58, 213], [56, 197],
    [54, 181], [52, 165], [51, 149], [50, 133], [49, 118],
  ],
};

function catmullRom(pts: Pt[], closed: boolean): string {
  const p = pts;
  const n = p.length;
  const get = (i: number): Pt => (closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + " Z" : d;
}

export function bodyPath(figure: Figure) {
  const r = BODY_R[figure];
  const l = r.slice(0, -1).reverse().map(([x, y]) => [-x, y] as Pt);
  return catmullRom([...r, ...l], true);
}

export function armPath(figure: Figure, side: 1 | -1) {
  return catmullRom(ARM_R[figure].map(([x, y]) => [x * side, y] as Pt), true);
}

export function linePath(pts: Pt[]) {
  return pts.length > 2 ? catmullRom(pts, false) : `M${pts[0][0]},${pts[0][1]} L${pts[1][0]},${pts[1][1]}`;
}
