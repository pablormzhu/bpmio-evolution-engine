import { Database, Workflow, Cog, BarChart3, Boxes, Users } from "lucide-react";

const nodes = [
  { Icon: Database, label: "Datos", angle: -110 },
  { Icon: Workflow, label: "Procesos", angle: -50 },
  { Icon: Cog, label: "Sistemas", angle: 10 },
  { Icon: BarChart3, label: "Analítica", angle: 70 },
  { Icon: Users, label: "Áreas", angle: 130 },
  { Icon: Boxes, label: "Herramientas", angle: 190 },
];

// Neuron points distributed across the "brain" silhouette
const neurons = [
  { x: 240, y: 120 }, { x: 180, y: 150 }, { x: 300, y: 145 },
  { x: 150, y: 200 }, { x: 220, y: 195 }, { x: 285, y: 200 }, { x: 340, y: 215 },
  { x: 175, y: 250 }, { x: 245, y: 240 }, { x: 310, y: 255 },
  { x: 200, y: 295 }, { x: 270, y: 290 }, { x: 330, y: 305 },
  { x: 225, y: 340 }, { x: 290, y: 345 },
];

// Synapse pairs (indices into neurons)
const synapses: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [1, 4], [2, 4], [2, 5], [2, 6],
  [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9],
  [7, 10], [8, 10], [8, 11], [9, 11], [9, 12],
  [10, 13], [11, 13], [11, 14], [12, 14],
  [4, 5], [8, 9], [3, 4], [6, 5],
];

export function OrchestrationPulse() {
  const size = 480;
  const c = size / 2;
  const r = 215;
  const mint = "oklch(0.78 0.12 162)";
  const deep = "oklch(0.55 0.13 162)";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={mint} stopOpacity="0.35" />
            <stop offset="70%" stopColor={mint} stopOpacity="0.05" />
            <stop offset="100%" stopColor={mint} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="synGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={deep} stopOpacity="0.15" />
            <stop offset="50%" stopColor={mint} stopOpacity="0.55" />
            <stop offset="100%" stopColor={deep} stopOpacity="0.15" />
          </linearGradient>
          {/* Brain silhouette path (two hemispheres with gyri-like top) */}
          <path
            id="brainShape"
            d="M 240 90
               C 180 85, 130 130, 130 195
               C 100 210, 95 270, 130 295
               C 130 345, 185 380, 240 365
               C 295 380, 350 345, 350 295
               C 385 270, 380 210, 350 195
               C 350 130, 300 85, 240 90 Z"
          />
        </defs>

        {/* Soft halo */}
        <circle cx={c} cy={c} r="180" fill="url(#brainGlow)">
          <animate attributeName="r" values="160;195;160" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0.5;0.9" dur="3.6s" repeatCount="indefinite" />
        </circle>

        {/* Brain outline */}
        <use href="#brainShape" fill="none" stroke={deep} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 4" />
        {/* Central fissure (between hemispheres) */}
        <path d="M 240 95 Q 235 200, 245 280 T 240 365" fill="none" stroke={deep} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 5" />
        {/* Gyri curves */}
        <path d="M 165 170 Q 200 155, 235 170" fill="none" stroke={deep} strokeOpacity="0.2" strokeWidth="1" />
        <path d="M 245 170 Q 280 155, 320 170" fill="none" stroke={deep} strokeOpacity="0.2" strokeWidth="1" />
        <path d="M 155 250 Q 195 235, 235 250" fill="none" stroke={deep} strokeOpacity="0.18" strokeWidth="1" />
        <path d="M 245 250 Q 290 235, 330 250" fill="none" stroke={deep} strokeOpacity="0.18" strokeWidth="1" />
        <path d="M 175 320 Q 210 305, 240 320" fill="none" stroke={deep} strokeOpacity="0.16" strokeWidth="1" />
        <path d="M 245 320 Q 280 305, 315 320" fill="none" stroke={deep} strokeOpacity="0.16" strokeWidth="1" />

        {/* Synapses */}
        {synapses.map(([a, b], i) => {
          const n1 = neurons[a];
          const n2 = neurons[b];
          return (
            <line
              key={i}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke={mint}
              strokeWidth="0.8"
              opacity="0.35"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.7;0.15"
                dur={`${2 + (i % 5) * 0.4}s`}
                begin={`${(i * 0.12) % 3}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Firing pulses along synapses */}
        {synapses.slice(0, 14).map(([a, b], i) => {
          const n1 = neurons[a];
          const n2 = neurons[b];
          const pid = `syn-${i}`;
          return (
            <g key={`p-${i}`}>
              <path id={pid} d={`M ${n1.x} ${n1.y} L ${n2.x} ${n2.y}`} fill="none" stroke="none" />
              <circle r="2.2" fill={mint}>
                <animateMotion dur={`${1.8 + (i % 4) * 0.3}s`} begin={`${i * 0.25}s`} repeatCount="indefinite">
                  <mpath href={`#${pid}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;0" dur={`${1.8 + (i % 4) * 0.3}s`} begin={`${i * 0.25}s`} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Neurons */}
        {neurons.map((n, i) => (
          <g key={`n-${i}`}>
            <circle cx={n.x} cy={n.y} r="6" fill={mint} opacity="0.18">
              <animate attributeName="r" values="5;9;5" dur={`${2 + (i % 3) * 0.4}s`} begin={`${(i * 0.15) % 2}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.1;0.35;0.1" dur={`${2 + (i % 3) * 0.4}s`} begin={`${(i * 0.15) % 2}s`} repeatCount="indefinite" />
            </circle>
            <circle cx={n.x} cy={n.y} r="2.8" fill={deep}>
              <animate attributeName="fill" values={`${deep};${mint};${deep}`} dur={`${1.6 + (i % 4) * 0.3}s`} begin={`${(i * 0.2) % 2}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}

        {/* Connections to external system nodes (axons leaving the brain) */}
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = c + Math.cos(rad) * r;
          const y = c + Math.sin(rad) * r;
          // Anchor on brain edge (approx by shrinking)
          const ex = c + Math.cos(rad) * 140;
          const ey = c + Math.sin(rad) * 140;
          const pathId = `axon-${i}`;
          return (
            <g key={n.label}>
              <path id={pathId} d={`M ${ex} ${ey} L ${x} ${y}`} stroke={deep} strokeOpacity="0.3" strokeWidth="1.1" fill="none" strokeDasharray="3 3" />
              <circle r="3" fill={mint}>
                <animateMotion dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`}>
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.35}s`} />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* External system nodes */}
      {nodes.map((n, i) => {
        const rad = (n.angle * Math.PI) / 180;
        const x = 50 + (Math.cos(rad) * r * 100) / size;
        const y = 50 + (Math.sin(rad) * r * 100) / size;
        return (
          <div
            key={n.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5"
            style={{ left: `${x}%`, top: `${y}%`, animation: `pulse-soft 2.6s ease-in-out ${i * 0.18}s infinite` }}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[oklch(0.55_0.13_162)]/25 bg-card/90 text-[oklch(0.55_0.13_162)] shadow-soft backdrop-blur">
              <n.Icon size={18} />
            </div>
            <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
              {n.label}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes pulse-soft {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
