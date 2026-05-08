// map-fx.jsx — Parallax grid, cursor-follow light, border particles.
// Each FX reads live values from a ref-shaped `tweaks` arg so it doesn't
// tear down when the user slides a knob.

// ── ParallaxGrid ─────────────────────────────────────────────────────────
// Canvas that draws a drifting perspective grid behind everything.
// Drift responds to the mouse so it feels hand-held.
function ParallaxGrid({ accent = '#00d4ff', enabled = true, speed = 1 }) {
  const canvasRef = React.useRef(null);
  const mouseRef = React.useRef({ x: 0.5, y: 0.5 });
  const stateRef = React.useRef({ accent, enabled, speed });
  stateRef.current = { accent, enabled, speed };

  React.useEffect(() => {
    const onMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  React.useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf = 0;
    let prevT = performance.now();
    let offset = 0;
    let mx = 0.5, my = 0.5;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = window.innerWidth + 'px';
      cvs.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    function hexToRgb(hex) {
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    function tick(t) {
      const dt = t - prevT; prevT = t;
      const s = stateRef.current;
      if (!s.enabled) {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        raf = requestAnimationFrame(tick);
        return;
      }
      offset += (dt / 1000) * 20 * s.speed;
      mx += (mouseRef.current.x - mx) * 0.04;
      my += (mouseRef.current.y - my) * 0.04;

      const W = window.innerWidth, H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);
      const [r, g, b] = hexToRgb(s.accent);

      const step = 56;
      const driftX = ((mx - 0.5) * 40);
      const driftY = ((my - 0.5) * 40) - (offset % step);

      // minor lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${r},${g},${b},0.05)`;
      ctx.beginPath();
      for (let x = -step + driftX; x < W + step; x += step) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let y = -step + driftY; y < H + step; y += step) {
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();

      // major lines every 4
      ctx.strokeStyle = `rgba(${r},${g},${b},0.10)`;
      ctx.beginPath();
      const major = step * 4;
      for (let x = -major + (driftX % major); x < W + major; x += major) {
        ctx.moveTo(x, 0); ctx.lineTo(x, H);
      }
      for (let y = -major + (driftY % major); y < H + major; y += major) {
        ctx.moveTo(0, y); ctx.lineTo(W, y);
      }
      ctx.stroke();

      // vignette fade edges
      const grad = ctx.createRadialGradient(W/2, H/2, Math.min(W,H)*0.2, W/2, H/2, Math.max(W,H)*0.7);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(5,7,15,0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="fx-grid" />;
}

// ── Scanline / noise overlay ─────────────────────────────────────────────
function Scanlines({ enabled = true, accent = '#00d4ff' }) {
  if (!enabled) return null;
  return <div className="fx-scanlines" />;
}

// ── CursorLight ──────────────────────────────────────────────────────────
// A big soft radial glow that tracks the mouse. Sits above the map, below UI,
// with screen blend so it "wakes up" whatever is under it.
function CursorLight({ accent = '#00d4ff', intensity = 1 }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;
    let raf = 0;
    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    window.addEventListener('mousemove', onMove);
    function tick() {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMove); };
  }, []);
  return (
    <div ref={ref} className="fx-cursor-light"
         style={{
           background: `radial-gradient(circle, ${accent}${Math.floor(intensity*40).toString(16).padStart(2,'0')} 0%, transparent 65%)`,
         }} />
  );
}

// ── BorderParticles ──────────────────────────────────────────────────────
// Given an SVG path element ref and an accent, spawn particles that march
// along the path's length. Uses getPointAtLength for placement.
function BorderParticles({ pathRef, accent = '#00d4ff', enabled = true, count = 40, speed = 1 }) {
  const canvasRef = React.useRef(null);
  const stateRef = React.useRef({ accent, enabled, count, speed });
  stateRef.current = { accent, enabled, count, speed };
  const particlesRef = React.useRef([]);

  React.useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    let raf = 0;
    let totalLen = 0;
    let cachedPath = null;

    function resize() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const parent = cvs.parentElement;
      const r = parent.getBoundingClientRect();
      cvs.width = r.width * dpr;
      cvs.height = r.height * dpr;
      cvs.style.width = r.width + 'px';
      cvs.style.height = r.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cvs.parentElement);

    function hexToRgb(hex) {
      const h = hex.replace('#', '');
      const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    let prevT = performance.now();
    function tick(t) {
      const dt = t - prevT; prevT = t;
      const s = stateRef.current;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      const path = pathRef.current;
      if (!s.enabled || !path) { raf = requestAnimationFrame(tick); return; }

      if (path !== cachedPath) {
        try { totalLen = path.getTotalLength(); } catch { totalLen = 0; }
        cachedPath = path;
        // reseed
        particlesRef.current = Array.from({ length: s.count }, () => ({
          u: Math.random(),
          v: 0.06 + Math.random() * 0.10,   // speed
          size: 0.8 + Math.random() * 1.4,
          life: Math.random(),
        }));
      }
      if (totalLen < 5) { raf = requestAnimationFrame(tick); return; }

      // transform canvas to match svg viewBox
      const svg = path.ownerSVGElement;
      if (!svg) { raf = requestAnimationFrame(tick); return; }
      const vb = svg.viewBox.baseVal;
      const cssW = cvs.clientWidth, cssH = cvs.clientHeight;
      const sx = cssW / vb.width;
      const sy = cssH / vb.height;
      const sc = Math.min(sx, sy);
      const tX = (cssW - vb.width * sc) / 2 - vb.x * sc;
      const tY = (cssH - vb.height * sc) / 2 - vb.y * sc;

      const [r, g, b] = hexToRgb(s.accent);

      const list = particlesRef.current;
      // grow or shrink list to s.count
      while (list.length < s.count) list.push({ u: Math.random(), v: 0.06 + Math.random() * 0.10, size: 0.8 + Math.random() * 1.4, life: Math.random() });
      if (list.length > s.count) list.length = s.count;

      for (const p of list) {
        p.u += (dt / 1000) * p.v * 0.08 * s.speed;
        if (p.u > 1) p.u -= 1;
        p.life += dt / 1000;
        const pt = path.getPointAtLength(p.u * totalLen);
        const x = tX + pt.x * sc;
        const y = tY + pt.y * sc;
        const alpha = 0.75 + Math.sin(p.life * 3) * 0.2;

        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.shadowColor = `rgba(${r},${g},${b},${alpha})`;
        ctx.shadowBlur = 6;
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [pathRef]);

  return <canvas ref={canvasRef} className="fx-particles" />;
}

Object.assign(window, { ParallaxGrid, Scanlines, CursorLight, BorderParticles });
