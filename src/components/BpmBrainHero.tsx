import { useRef, useEffect } from "react";

// BPM.io — "cerebro vivo" del hero.
// Pega <BpmBrainHero /> en la columna derecha de tu hero (dale altura a esa columna).
// Autocontenido: sin librerías, sin Tailwind. Respeta prefers-reduced-motion.
export default function BpmBrainHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = wrap.clientWidth || 700;
    let H = wrap.clientHeight || 600;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let CX = W / 2, CY = H / 2;
    let min0 = Math.min(W, H);

    function resize() {
      W = wrap!.clientWidth || W; H = wrap!.clientHeight || H;
      CX = W / 2; CY = H / 2; min0 = Math.min(W, H);
      canvas!.width = Math.round(W * dpr); canvas!.height = Math.round(H * dpr);
      canvas!.style.width = W + "px"; canvas!.style.height = H + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    const small = W < 700;
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const g3 = () => Math.random() + Math.random() + Math.random() - 1.5;
    const sizeScale = Math.max(0.78, Math.min(1.3, min0 / 640));

    // ---- color de los puntos: blanco / gris claro / verde BPM + acentos escasos ----
    const WHITE = [245, 248, 247];
    const LGRAY = [200, 208, 206];
    const COLS = [
      WHITE,
      LGRAY,
      [109, 192, 156], // verde BPM claro
      [210, 108, 108], // acentos escasos
      [222, 168, 96],
      [150, 205, 110],
      [120, 168, 222],
    ];
    const WEIGHT = [0.20, 0.43, 0.26, 0.03, 0.03, 0.03, 0.02];
    const ALPHAS = [0.5, 0.82];
    const buckets: any[] = [];
    for (let c = 0; c < COLS.length; c++)
      for (let a = 0; a < ALPHAS.length; a++)
        buckets.push({ style: `rgba(${COLS[c][0]},${COLS[c][1]},${COLS[c][2]},${ALPHAS[a]})`, items: [] as any[] });
    const pickBucket = () => {
      let x = Math.random(), c = 0;
      for (; c < WEIGHT.length; c++) { if (x < WEIGHT[c]) break; x -= WEIGHT[c]; }
      if (c >= COLS.length) c = 0;
      const tier = Math.random() < 0.6 ? 0 : 1;
      return c * ALPHAS.length + tier;
    };

    // ---- config ----
    const N = small ? 3500 : 10000;
    const N_LABEL = 7;
    const N_BIG = small ? 13 : 18;
    const FOLLOW = 0.42, CLOUD = 0.46; // resto = anillo exterior
    const SPEED = 1.69;             // velocidad de los puntos
    const HUB_SPEED = SPEED * 1.026; // esferas blancas
    const SIGNS = ["DATOS", "PROCESOS", "AUTOMATIZACIÓN", "IA", "SISTEMAS", "ANALÍTICA", "KNOW-HOW"];

    // ---- big hubs: repartidos en el borde, vaivén chico, se repelen (el texto no se encima) ----
    const hubs: any[] = [];
    let wsum = 0;
    let li = 0;
    for (let k = 0; k < N_BIG; k++) {
      const labeled = k < N_LABEL;
      const big = !labeled && Math.random() < 0.22;
      const w = labeled ? rnd(0.7, 1.4) : (big ? rnd(1.2, 2.0) : rnd(0.3, 1.2));
      wsum += w;
      const label = labeled ? SIGNS[k] : null;
      const homeAng = labeled
        ? (li++ / N_LABEL) * Math.PI * 2 + rnd(-0.14, 0.14)
        : Math.random() * Math.PI * 2;
      const r = (labeled ? rnd(6.5, 9) : big ? rnd(7, 10.5) : rnd(4.5, 7.5)) * sizeScale;
      const homeRF = labeled ? rnd(0.40, 0.45) : rnd(0.33, 0.45);
      const h: any = {
        labeled, label, r,
        col: labeled ? WHITE : (Math.random() < 0.5 ? WHITE : LGRAY),
        homeAng, homeRF,
        WxF: rnd(0.04, 0.085), WyF: rnd(0.04, 0.085),
        wx: rnd(0.04, 0.14), wy: rnd(0.04, 0.14),
        phx: rnd(0, 6.28), phy: rnd(0, 6.28),
        clear: labeled ? (label!.length * 3.6 + 16) : (r + 10),
        ox: 0, oy: 0, ovx: 0, ovy: 0, bx: CX, by: CY,
        w, x: CX, y: CY,
      };
      h.x = CX + homeRF * min0 * Math.cos(homeAng);
      h.y = CY + homeRF * min0 * Math.sin(homeAng);
      h.bx = h.x; h.by = h.y;
      hubs.push(h);
    }

    // ---- dots ----
    const dots: any[] = [];
    const nF = Math.round(N * FOLLOW);
    const nCloud = Math.round(N * CLOUD);

    for (let i = 0; i < nF; i++) {
      let x = Math.random() * wsum, hi = 0;
      for (; hi < hubs.length; hi++) { if (x < hubs[hi].w) break; x -= hubs[hi].w; }
      if (hi >= hubs.length) hi = hubs.length - 1;
      const long = Math.random() < 0.18;
      const d: any = {
        kind: "follow", hub: hubs[hi],
        a0: Math.random() * Math.PI * 2,
        offF: long ? rnd(0.06, 0.12) : rnd(0.012, 0.06),
        k: rnd(0.04, 0.09), damp: rnd(0.86, 0.92), vx: 0, vy: 0,
        jAx: rnd(0.004, 0.012), jAy: rnd(0.004, 0.012),
        jfx: rnd(0.2, 0.5), jfy: rnd(0.2, 0.5), jpx: rnd(0, 6.28), jpy: rnd(0, 6.28),
        baseR: (0.7 + Math.pow(Math.random(), 1.6) * 2.0) * sizeScale,
        bi: pickBucket(), x: CX, y: CY,
      };
      const h = hubs[hi];
      d.x = h.x + Math.cos(d.a0) * d.offF * min0;
      d.y = h.y + Math.sin(d.a0) * d.offF * min0;
      dots.push(d); buckets[d.bi].items.push(d);
    }
    for (let i = 0; i < nCloud; i++) {
      const ang = Math.random() * Math.PI * 2;
      const radF = Math.random() < 0.32 ? Math.abs(g3()) * 0.15 : 0.12 + 0.34 * Math.sqrt(Math.random());
      const d: any = {
        kind: "drift", hxF: Math.cos(ang) * radF, hyF: Math.sin(ang) * radF,
        AxF: rnd(0.02, 0.05), AyF: rnd(0.02, 0.05),
        wx: rnd(0.10, 0.30), wy: rnd(0.10, 0.30), phx: rnd(0, 6.28), phy: rnd(0, 6.28),
        baseR: (0.6 + Math.pow(Math.random(), 1.7) * 1.8) * sizeScale,
        bi: pickBucket(), x: CX, y: CY,
      };
      dots.push(d); buckets[d.bi].items.push(d);
    }
    for (let i = dots.length; i < N; i++) {
      const ang = Math.random() * Math.PI * 2;
      const radF = 0.40 + 0.07 * Math.pow(Math.random(), 0.7);
      const d: any = {
        kind: "drift", hxF: Math.cos(ang) * radF, hyF: Math.sin(ang) * radF,
        AxF: rnd(0.016, 0.04), AyF: rnd(0.016, 0.04),
        wx: rnd(0.09, 0.26), wy: rnd(0.09, 0.26), phx: rnd(0, 6.28), phy: rnd(0, 6.28),
        baseR: (0.6 + Math.pow(Math.random(), 1.8) * 1.5) * sizeScale,
        bi: pickBucket(), x: CX, y: CY,
      };
      dots.push(d); buckets[d.bi].items.push(d);
    }

    for (const d of dots) {
      if (d.kind !== "drift") continue;
      d.x = CX + d.hxF * min0 + d.AxF * min0 * Math.sin(d.phx);
      d.y = CY + d.hyF * min0 + d.AyF * min0 * Math.sin(d.phy);
    }

    const web: any[] = [];
    for (let i = 0; i < hubs.length; i++) {
      web.push([hubs[i], hubs[(i + 1) % hubs.length]]);
      const j = Math.floor(Math.random() * hubs.length);
      if (j !== i) web.push([hubs[i], hubs[j]]);
    }

    const SPOKE = "rgba(205,214,210,0.09)";
    const WEBC = "rgba(205,214,210,0.13)";

    let raf = 0;
    const t0 = performance.now();

    function frame(now: number) {
      const t = reduce ? 0 : (now - t0) / 1000;
      const gx = 0.012 * min0 * Math.sin(t * SPEED * 0.06);
      const gy = 0.010 * min0 * (Math.sin(t * SPEED * 0.05 + 1.2) - Math.sin(1.2));

      for (const h of hubs) {
        h.bx = CX + h.homeRF * min0 * Math.cos(h.homeAng) + h.WxF * min0 * (Math.sin(t * HUB_SPEED * h.wx + h.phx) - Math.sin(h.phx));
        h.by = CY + h.homeRF * min0 * Math.sin(h.homeAng) + h.WyF * min0 * (Math.sin(t * HUB_SPEED * h.wy + h.phy) - Math.sin(h.phy));
      }
      for (let i = 0; i < hubs.length; i++) {
        const a = hubs[i];
        let fx = 0, fy = 0;
        const ax = a.bx + a.ox, ay = a.by + a.oy;
        for (let j = 0; j < hubs.length; j++) {
          if (i === j) continue;
          const b = hubs[j];
          let dx = ax - (b.bx + b.ox), dy = ay - (b.by + b.oy);
          let dist = Math.hypot(dx, dy);
          const minD = a.clear + b.clear;
          if (dist < 0.001) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; dist = 1; }
          if (dist < minD) {
            const f = ((minD - dist) / minD) * 1.1;
            fx += (dx / dist) * f; fy += (dy / dist) * f;
          }
        }
        a.ovx = (a.ovx + fx - a.ox * 0.02) * 0.85;
        a.ovy = (a.ovy + fy - a.oy * 0.02) * 0.85;
        a.ox += a.ovx; a.oy += a.ovy;
      }
      const maxR = 0.46 * min0, minR = 0.20 * min0;
      for (const h of hubs) {
        let hx = h.bx + h.ox, hy = h.by + h.oy;
        const rr = Math.hypot(hx - CX, hy - CY) || 1;
        if (rr > maxR) { hx = CX + (hx - CX) / rr * maxR; hy = CY + (hy - CY) / rr * maxR; }
        else if (rr < minR) { hx = CX + (hx - CX) / rr * minR; hy = CY + (hy - CY) / rr * minR; }
        h.x = hx + gx; h.y = hy + gy;
      }

      for (const d of dots) {
        if (d.kind === "follow") {
          const h = d.hub;
          const tx = h.x + Math.cos(d.a0) * d.offF * min0 + d.jAx * min0 * Math.sin(t * SPEED * d.jfx + d.jpx);
          const ty = h.y + Math.sin(d.a0) * d.offF * min0 + d.jAy * min0 * Math.sin(t * SPEED * d.jfy + d.jpy);
          d.vx = (d.vx + (tx - d.x) * d.k) * d.damp;
          d.vy = (d.vy + (ty - d.y) * d.k) * d.damp;
          d.x += d.vx; d.y += d.vy;
        } else {
          const bx = CX + d.hxF * min0 + d.AxF * min0 * Math.sin(t * SPEED * d.wx + d.phx);
          const by = CY + d.hyF * min0 + d.AyF * min0 * Math.sin(t * SPEED * d.wy + d.phy);
          let px = 0, py = 0;
          const Rinf = 0.11 * min0;
          for (let hh = 0; hh < hubs.length; hh++) {
            const h = hubs[hh];
            const ex = bx - h.x, ey = by - h.y;
            const ed = Math.hypot(ex, ey);
            if (ed < Rinf && ed > 0.001) {
              const f = (1 - ed / Rinf) * 0.045 * min0;
              px += (ex / ed) * f; py += (ey / ed) * f;
            }
          }
          d.x = bx + px + gx; d.y = by + py + gy;
        }
      }

      const clampR = 0.47 * min0, clampR2 = clampR * clampR;
      for (const d of dots) {
        const rx = d.x - CX, ry = d.y - CY, rr2 = rx * rx + ry * ry;
        if (rr2 > clampR2) { const s = clampR / Math.sqrt(rr2); d.x = CX + rx * s; d.y = CY + ry * s; }
      }

      ctx!.clearRect(0, 0, W, H);

      ctx!.beginPath();
      for (const [a, b] of web) { ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); }
      ctx!.strokeStyle = WEBC; ctx!.lineWidth = 0.8; ctx!.stroke();

      ctx!.beginPath();
      for (const d of dots) {
        if (d.kind !== "follow") continue;
        ctx!.moveTo(d.hub.x, d.hub.y); ctx!.lineTo(d.x, d.y);
      }
      ctx!.strokeStyle = SPOKE; ctx!.lineWidth = 0.6; ctx!.stroke();

      for (const bk of buckets) {
        ctx!.beginPath();
        for (const d of bk.items) { ctx!.moveTo(d.x + d.baseR, d.y); ctx!.arc(d.x, d.y, d.baseR, 0, 6.2832); }
        ctx!.fillStyle = bk.style; ctx!.fill();
      }

      for (const h of hubs) {
        const R0 = h.r * 2.6;
        const gr = ctx!.createRadialGradient(h.x, h.y, 0, h.x, h.y, R0);
        gr.addColorStop(0, `rgba(${h.col[0]},${h.col[1]},${h.col[2]},0.16)`);
        gr.addColorStop(1, `rgba(${h.col[0]},${h.col[1]},${h.col[2]},0)`);
        ctx!.fillStyle = gr; ctx!.beginPath(); ctx!.arc(h.x, h.y, R0, 0, 6.2832); ctx!.fill();
        ctx!.beginPath(); ctx!.arc(h.x, h.y, h.r, 0, 6.2832);
        ctx!.fillStyle = `rgba(${h.col[0]},${h.col[1]},${h.col[2]},0.96)`; ctx!.fill();
      }

      try { (ctx as any).letterSpacing = "1.6px"; } catch (e) {}
      ctx!.textAlign = "center";
      ctx!.font = "700 11px Manrope, system-ui, sans-serif";
      ctx!.lineJoin = "round";
      for (const h of hubs) {
        if (!h.labeled) continue;
        const ly = h.y + h.r + 13;
        ctx!.lineWidth = 3.5;
        ctx!.strokeStyle = "rgba(8,24,20,0.85)";
        ctx!.strokeText(h.label, h.x, ly);
        ctx!.fillStyle = "rgba(238,246,242,0.96)";
        ctx!.fillText(h.label, h.x, ly);
      }
      try { (ctx as any).letterSpacing = "0px"; } catch (e) {}

      if (!reduce) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    const ro = new ResizeObserver(() => { resize(); if (reduce) raf = requestAnimationFrame(frame); });
    ro.observe(wrap);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 520,
        borderRadius: 28,
        overflow: "hidden",
        background: "transparent",
        boxShadow: "inset 0 0 70px rgba(0,0,0,0.35), 0 30px 60px -34px rgba(8,30,26,0.6)",
        border: "1px solid rgba(170,224,232,0.06)",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
