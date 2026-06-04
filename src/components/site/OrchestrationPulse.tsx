import { Database, Workflow, Brain, Cog, BarChart3, Boxes } from "lucide-react";

const nodes = [
  { Icon: Database, label: "Datos", angle: -90 },
  { Icon: Workflow, label: "Procesos", angle: -30 },
  { Icon: Cog, label: "Sistemas", angle: 30 },
  { Icon: BarChart3, label: "Analítica", angle: 90 },
  { Icon: Brain, label: "IA", angle: 150 },
  { Icon: Boxes, label: "Áreas", angle: 210 },
];

export function OrchestrationPulse() {
  const size = 480;
  const c = size / 2;
  const r = 170;
  const mint = "oklch(0.78 0.12 162)";
  const deep = "oklch(0.55 0.13 162)";

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[480px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={mint} stopOpacity="1" />
            <stop offset="60%" stopColor={deep} stopOpacity="0.9" />
            <stop offset="100%" stopColor={deep} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="haloGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={mint} stopOpacity="0.35" />
            <stop offset="100%" stopColor={mint} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Orbit rings */}
        <circle cx={c} cy={c} r={r} fill="none" stroke={deep} strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 6" />
        <circle cx={c} cy={c} r={r - 40} fill="none" stroke={deep} strokeOpacity="0.12" strokeWidth="1" />
        <circle cx={c} cy={c} r={r + 30} fill="none" stroke={deep} strokeOpacity="0.08" strokeWidth="1" />

        {/* Connections + traveling pulses */}
        {nodes.map((n, i) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = c + Math.cos(rad) * r;
          const y = c + Math.sin(rad) * r;
          const pathId = `path-${i}`;
          return (
            <g key={n.label}>
              <path id={pathId} d={`M ${c} ${c} L ${x} ${y}`} stroke={deep} strokeOpacity="0.28" strokeWidth="1.2" fill="none" />
              <circle r="3" fill={mint}>
                <animateMotion dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.3}s`}>
                  <mpath href={`#${pathId}`} />
                </animateMotion>
                <animate attributeName="opacity" values="0;1;1;0" dur={`${2.4 + i * 0.25}s`} repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
            </g>
          );
        })}

        {/* Halo */}
        <circle cx={c} cy={c} r="120" fill="url(#haloGrad)">
          <animate attributeName="r" values="100;135;100" dur="3.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0.25;0.6" dur="3.2s" repeatCount="indefinite" />
        </circle>

        {/* Pulse rings */}
        {[0, 1, 2].map((i) => (
          <circle key={i} cx={c} cy={c} r="50" fill="none" stroke={mint} strokeWidth="1.5" opacity="0">
            <animate attributeName="r" values="40;160" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.7;0" dur="3s" begin={`${i}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Core */}
        <circle cx={c} cy={c} r="42" fill="url(#coreGrad)">
          <animate attributeName="r" values="40;48;40" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={c} cy={c} r="18" fill={mint}>
          <animate attributeName="opacity" values="1;0.7;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      </svg>

      {/* Node icons (HTML overlay for crisp icons + labels) */}
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
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[oklch(0.55_0.13_162)]/25 bg-card/90 text-[oklch(0.55_0.13_162)] shadow-soft backdrop-blur">
              <n.Icon size={20} />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/70">
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
