import { categoryByName } from "@/lib/data";

// Generative cover art for posts: a deterministic pattern seeded by the slug,
// styled per category, so every post has a distinct image without stock photos.

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  return () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 10000) / 10000;
  };
}

export default function PostCover({
  slug,
  category,
  className = "",
  label = true,
}: {
  slug: string;
  category: string;
  className?: string;
  label?: boolean;
}) {
  const r = rng(hash(slug) || 1);
  const W = 800;
  const H = 450;
  let art: React.ReactNode;

  if (category === "Multi-Agent AI") {
    // Agent graph
    const nodes = Array.from({ length: 14 }, () => [60 + r() * (W - 120), 50 + r() * (H - 100)]);
    const edges: [number, number][] = [];
    nodes.forEach((_, i) => {
      const j = Math.floor(r() * nodes.length);
      if (j !== i) edges.push([i, j]);
      if (r() > 0.5) edges.push([i, (i + 1) % nodes.length]);
    });
    art = (
      <>
        {edges.map(([a, b], k) => (
          <line key={k} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="var(--cover-fg)" strokeOpacity="0.45" strokeWidth="1.5" />
        ))}
        {nodes.map(([x, y], k) => (
          <circle key={k} cx={x} cy={y} r={k % 5 === 0 ? 12 : 7} fill={k % 5 === 0 ? "var(--cover-hi)" : "var(--cover-bg)"} stroke="var(--cover-fg)" strokeWidth="1.5" />
        ))}
      </>
    );
  } else if (category === "Smart Grid") {
    // Bus network: a feeder with laterals
    const y0 = H * (0.35 + r() * 0.2);
    const buses = 9;
    const xs = Array.from({ length: buses }, (_, i) => 70 + (i * (W - 140)) / (buses - 1));
    art = (
      <>
        <line x1={xs[0]} y1={y0} x2={xs[buses - 1]} y2={y0} stroke="var(--cover-fg)" strokeWidth="2" />
        {xs.map((x, i) => {
          const down = r() > 0.4;
          const len = 60 + r() * 110;
          return (
            <g key={i}>
              <rect x={x - 3} y={y0 - 16} width="6" height="32" fill="var(--cover-fg)" />
              {down && <line x1={x} y1={y0} x2={x} y2={y0 + len} stroke="var(--cover-fg)" strokeOpacity="0.45" strokeWidth="1.5" />}
              {down && <circle cx={x} cy={y0 + len} r="9" fill={i % 3 === 0 ? "var(--cover-hi)" : "var(--cover-bg)"} stroke="var(--cover-fg)" strokeWidth="1.5" />}
            </g>
          );
        })}
        <path d={`M30 ${y0 - 70} q 20 -30 40 0 t 40 0`} fill="none" stroke="var(--cover-hi)" strokeWidth="2" />
      </>
    );
  } else if (category === "AI Infrastructure") {
    // Rack heatmap
    const cols = 16;
    const rows = 9;
    const cw = W / cols;
    const rh = H / rows;
    art = (
      <>
        {Array.from({ length: cols * rows }, (_, k) => {
          const c = k % cols;
          const row = Math.floor(k / cols);
          const v = r();
          return (
            <rect
              key={k}
              x={c * cw + 3}
              y={row * rh + 3}
              width={cw - 6}
              height={rh - 6}
              rx="3"
              fill={v > 0.82 ? "var(--cover-hi)" : "var(--cover-fg)"}
              opacity={v > 0.82 ? 1 : 0.08 + v * 0.3}
            />
          );
        })}
      </>
    );
  } else {
    // Explainers: stacked distributions
    const curves = Array.from({ length: 6 }, (_, k) => {
      const mu = 0.2 + r() * 0.6;
      const s = 0.06 + r() * 0.1;
      const base = 120 + k * 50;
      const d = Array.from({ length: 81 }, (_, i) => {
        const x = i / 80;
        const y = Math.exp(-((x - mu) ** 2) / (2 * s * s));
        return `${i ? "L" : "M"}${(x * W).toFixed(1)},${(base - y * 110).toFixed(1)}`;
      }).join(" ");
      return <path key={k} d={d} fill="none" stroke={k === 2 ? "var(--cover-hi)" : "var(--cover-fg)"} strokeOpacity={k === 2 ? 1 : 0.35} strokeWidth="1.8" />;
    });
    art = <>{curves}</>;
  }

  return (
    <div className={`cover ${className}`} data-cat={categoryByName(category)?.slug ?? "none"}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width={W} height={H} fill="var(--cover-bg)" />
        {art}
      </svg>
      {label && <span className="cover-label">{category}</span>}
    </div>
  );
}
