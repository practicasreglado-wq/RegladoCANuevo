// spain-map.jsx — The hero. Renders CCAA / Provinces / Municipios as
// glassy iridescent cards with per-region hue variety, floating labels,
// cinematic intro fly-in, click shockwaves, idle ambient pulses, minimap
// context, animated counter, and keyboard navigation.

const { useState, useEffect, useRef, useMemo, useCallback, forwardRef, useImperativeHandle } = React;

const VB_W = 960;
const VB_H = 700;

const easeInOutQuint = t => t < 0.5 ? 16 * t**5 : 1 - Math.pow(-2 * t + 2, 5) / 2;
const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

// Deterministic hash → [0, 1). Used to assign each region a stable hue offset.
function hash01(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return (h >>> 0) / 4294967296;
}

function featureCentroid(pathGen, feature) {
  try { return pathGen.centroid(feature); } catch { return [VB_W/2, VB_H/2]; }
}

function featureArea(pathGen, feature) {
  try { return Math.abs(pathGen.area(feature)); } catch { return 0; }
}

function frameBounds(bounds, pad = 0.25) {
  const [[x0, y0], [x1, y1]] = bounds;
  const w = x1 - x0, h = y1 - y0;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const aspect = VB_W / VB_H;
  let tw, th;
  if (w / h > aspect) { tw = w * (1 + pad * 2); th = tw / aspect; }
  else { th = h * (1 + pad * 2); tw = th * aspect; }
  return [cx - tw/2, cy - th/2, tw, th];
}

const SpainMap = forwardRef(function SpainMap({ tweaks, onReady }, ref) {
  const [level, setLevel] = useState('ccaa');
  const [selectedCcaa, setSelectedCcaa] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedMuniId, setSelectedMuniId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [pressedId, setPressedId] = useState(null);
  const [focusedId, setFocusedId] = useState(null);
  const [keyFocusId, setKeyFocusId] = useState(null);
  const [ready, setReady] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [intro, setIntro] = useState(true); // fly-in on first load
  const [idlePulseId, setIdlePulseId] = useState(null);
  const [ripples, setRipples] = useState([]);

  const [features, setFeatures] = useState([]);
  const [meshPath, setMeshPath] = useState('');
  const [outlinePath, setOutlinePath] = useState('');
  const pathGenRef = useRef(null);
  const fullSpainPathGenRef = useRef(null);

  const [enclaveBadges, setEnclaveBadges] = useState([]);

  const [viewBox, setViewBox] = useState([0, 0, VB_W, VB_H]);
  const viewBoxRef = useRef(viewBox);
  viewBoxRef.current = viewBox;

  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, name: '', sub: '' });
  const wrapperRef = useRef(null);
  const meshPathElRef = useRef(null);
  const [cursorSvg, setCursorSvg] = useState({ x: -9999, y: -9999 });

  // Feature centroids + areas + hue offsets (memoized per feature list)
  const featureMeta = useMemo(() => {
    const m = new Map();
    if (!pathGenRef.current || !features.length) return m;
    let maxArea = 0;
    for (const f of features) {
      const c = featureCentroid(pathGenRef.current, f);
      const a = featureArea(pathGenRef.current, f);
      if (a > maxArea) maxArea = a;
      const hue = Math.floor(hash01(`${level}-${f.id}`) * 360);
      m.set(f.id, { cx: c[0], cy: c[1], area: a, hue });
    }
    // normalize area 0..1
    for (const v of m.values()) v.areaN = maxArea ? v.area / maxArea : 0;
    return m;
  }, [features, level]);

  // ── init
  useEffect(() => {
    let alive = true;
    (async () => {
      await MapData.loadCcaa();
      await MapData.loadProvinces();
      if (!alive) return;
      const feats = MapData.getCcaaFeatures();
      const proj = d3.geoConicConformalSpain();
      proj.fitExtent([[30, 20], [VB_W - 30, VB_H - 20]], { type: 'FeatureCollection', features: feats });
      const pg = d3.geoPath(proj);
      fullSpainPathGenRef.current = pg;
      pathGenRef.current = pg;
      setFeatures(feats);
      setMeshPath(pg(MapData.getCcaaMesh()) || '');
      setOutlinePath(pg(MapData.getCcaaOutline()) || '');

      const badges = [];
      for (const code of ['18', '19']) {
        const f = feats.find(x => x.id === code);
        if (!f) continue;
        const [cx, cy] = pg.centroid(f);
        badges.push({ id: code, cx, cy, name: MapData.CCAA[code].name });
      }
      setEnclaveBadges(badges);
      setReady(true);
      onReady?.();

      // Cinematic intro — zoom from way out in, pan to center.
      const introStart = [VB_W / 2 - VB_W * 1.5, VB_H / 2 - VB_H * 1.5 + 120, VB_W * 3, VB_H * 3];
      const introEnd = [0, 0, VB_W, VB_H];
      setViewBox(introStart);
      viewBoxRef.current = introStart;
      requestAnimationFrame(() => animateViewBoxRaw(introEnd, 1600));
      setTimeout(() => { if (alive) setIntro(false); }, 1700);
    })();
    return () => { alive = false; };
  }, []);

  // ── viewBox animation
  const animRef = useRef(null);
  const animateViewBoxRaw = useCallback((target, duration = 900) => {
    cancelAnimationFrame(animRef.current);
    const start = [...viewBoxRef.current];
    const t0 = performance.now();
    const dur = duration;
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      const e = easeInOutQuint(p);
      const vb = [
        start[0] + (target[0] - start[0]) * e,
        start[1] + (target[1] - start[1]) * e,
        start[2] + (target[2] - start[2]) * e,
        start[3] + (target[3] - start[3]) * e,
      ];
      viewBoxRef.current = vb;
      setViewBox(vb);
      if (p < 1) animRef.current = requestAnimationFrame(step);
    }
    animRef.current = requestAnimationFrame(step);
  }, []);

  const animateViewBox = useCallback((target, duration = 900) => {
    animateViewBoxRaw(target, duration / (tweaks?.motionSpeed || 1));
  }, [tweaks?.motionSpeed, animateViewBoxRaw]);

  function resetViewBox() {
    cancelAnimationFrame(animRef.current);
    const vb = [0, 0, VB_W, VB_H];
    viewBoxRef.current = vb;
    setViewBox(vb);
  }

  // Planar bbox in lon/lat by walking coords directly. Avoids d3.geoBounds, which
  // can return [-180,-90][180,90] for any feature with a wound-wrong polygon
  // (a real bug in some of our muni topojson files, e.g. Ataun in Gipuzkoa).
  function planarBBox(feats) {
    let xmin=Infinity, ymin=Infinity, xmax=-Infinity, ymax=-Infinity;
    function walk(c) {
      if (typeof c[0] === 'number') {
        const [x, y] = c;
        if (x < xmin) xmin = x; if (y < ymin) ymin = y;
        if (x > xmax) xmax = x; if (y > ymax) ymax = y;
      } else for (const sub of c) walk(sub);
    }
    for (const f of feats) if (f.geometry?.coordinates) walk(f.geometry.coordinates);
    return [[xmin, ymin], [xmax, ymax]];
  }
  function makeProjFor(feats) {
    const [[x0, y0], [x1, y1]] = planarBBox(feats);
    let proj;
    if (!isFinite(x0) || !isFinite(x1) || x1 <= x0 || y1 <= y0) {
      proj = d3.geoMercator().fitExtent([[28, 28], [VB_W - 28, VB_H - 28]], { type: 'FeatureCollection', features: feats });
    } else {
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      let p = d3.geoMercator().center([cx, cy]).scale(1).translate([0, 0]);
      const [px0, py1] = p([x0, y0]);
      const [px1, py0] = p([x1, y1]);
      const w = Math.abs(px1 - px0), h = Math.abs(py1 - py0);
      const padX = 28, padY = 28;
      const targetW = VB_W - 2 * padX, targetH = VB_H - 2 * padY;
      const scale = Math.min(targetW / w, targetH / h);
      proj = d3.geoMercator().center([cx, cy]).scale(scale).translate([VB_W / 2, VB_H / 2]);
    }
    // Wrap the projection in a planar geoTransform so d3.geoPath skips the
    // sphere — no antimeridian clipping, no adaptive resampling. This avoids
    // the "365k-px splat" bug where a wound-wrong polygon (e.g. Ataun in
    // Gipuzkoa) causes d3 to project points across the world.
    return d3.geoTransform({
      point: function (x, y) { const p = proj([x, y]); this.stream.point(p[0], p[1]); }
    });
  }

  function renderProvinces(codauto) {
    const feats = MapData.getProvinceFeatures(codauto);
    const pg = d3.geoPath(makeProjFor(feats));
    pathGenRef.current = pg;
    setFeatures(feats);
    setMeshPath(pg(MapData.getProvinceMesh(codauto)) || '');
    setOutlinePath('');
    setEnclaveBadges([]);
    resetViewBox();
  }
  function renderMunicipalities(cpro) {
    const feats = MapData.getMunicipalityFeatures(cpro);
    const pg = d3.geoPath(makeProjFor(feats));
    pathGenRef.current = pg;
    setFeatures(feats);
    setMeshPath(pg(MapData.getMunicipalityMesh(cpro)) || '');
    setOutlinePath('');
    setEnclaveBadges([]);
    setSelectedMuniId(null);
    resetViewBox();
  }
  function renderCcaa() {
    const pg = fullSpainPathGenRef.current;
    pathGenRef.current = pg;
    const feats = MapData.getCcaaFeatures();
    setFeatures(feats);
    setMeshPath(pg(MapData.getCcaaMesh()) || '');
    setOutlinePath(pg(MapData.getCcaaOutline()) || '');
    const badges = [];
    for (const code of ['18', '19']) {
      const f = feats.find(x => x.id === code);
      if (!f) continue;
      const [cx, cy] = pg.centroid(f);
      badges.push({ id: code, cx, cy, name: MapData.CCAA[code].name });
    }
    setEnclaveBadges(badges);
    resetViewBox();
  }

  function spawnRipple(cx, cy) {
    const id = Math.random().toString(36).slice(2, 8);
    setRipples(rs => [...rs, { id, cx, cy, t0: performance.now() }]);
    setTimeout(() => {
      setRipples(rs => rs.filter(r => r.id !== id));
    }, 1200);
  }

  async function navigateInto(feature, clickPt) {
    if (transitioning) return;
    setTransitioning(true);
    setFocusedId(feature.id);
    setTooltip(t => ({ ...t, visible: false }));

    const pg = pathGenRef.current;
    let cx = VB_W/2, cy = VB_H/2;
    if (pg) {
      const [ccx, ccy] = pg.centroid(feature);
      cx = ccx; cy = ccy;
      const b = pg.bounds(feature);
      if (b) animateViewBox(frameBounds(b, 0.25), 650);
    }
    spawnRipple(clickPt?.x ?? cx, clickPt?.y ?? cy);

    const transStyle = tweaks?.transition || 'lift-drift';
    const swapDelay = transStyle === 'fast-fade' ? 350 : 550;
    await new Promise(r => setTimeout(r, swapDelay / (tweaks?.motionSpeed || 1)));

    if (level === 'ccaa') {
      const code = feature.id;
      const meta = MapData.CCAA[code];
      if (meta?.uniprovincial) {
        await MapData.loadMunicipalities(meta.cpro);
        setLevel('municipality');
        setSelectedCcaa(code);
        setSelectedProvince(meta.cpro);
        renderMunicipalities(meta.cpro);
      } else {
        setLevel('province');
        setSelectedCcaa(code);
        renderProvinces(code);
      }
    } else if (level === 'province') {
      const cpro = feature.id;
      await MapData.loadMunicipalities(cpro);
      setLevel('municipality');
      setSelectedProvince(cpro);
      renderMunicipalities(cpro);
    }

    setFocusedId(null);
    setKeyFocusId(null);
    setTransitioning(false);
  }

  function zoomToMunicipio(feature, clickPt) {
    const pg = pathGenRef.current;
    if (!pg) return;
    const b = pg.bounds(feature);
    if (!b) return;
    const [cx, cy] = pg.centroid(feature);
    setSelectedMuniId(feature.id);
    spawnRipple(clickPt?.x ?? cx, clickPt?.y ?? cy);
    animateViewBox(frameBounds(b, 1.2), 700);
  }

  function goBack() {
    if (transitioning) return;
    setTooltip(t => ({ ...t, visible: false }));
    if (level === 'municipality') {
      if (selectedMuniId) {
        setSelectedMuniId(null);
        animateViewBox([0, 0, VB_W, VB_H], 600);
        return;
      }
      const ccaaMeta = selectedCcaa ? MapData.CCAA[selectedCcaa] : null;
      if (ccaaMeta?.uniprovincial || !selectedCcaa) {
        setLevel('ccaa'); setSelectedCcaa(null); setSelectedProvince(null); renderCcaa();
      } else {
        setLevel('province'); setSelectedProvince(null); renderProvinces(selectedCcaa);
      }
    } else if (level === 'province') {
      setLevel('ccaa'); setSelectedCcaa(null); renderCcaa();
    }
  }

  function goTo(target) {
    if (transitioning) return;
    setTooltip(t => ({ ...t, visible: false }));
    setSelectedMuniId(null);
    if (target === 'ccaa') {
      setLevel('ccaa'); setSelectedCcaa(null); setSelectedProvince(null); renderCcaa();
    } else if (target === 'province' && selectedCcaa) {
      setLevel('province'); setSelectedProvince(null); renderProvinces(selectedCcaa);
    }
  }

  // ── imperative API for the search box
  useImperativeHandle(ref, () => ({
    async flyToMunicipio(cpro, muniId) {
      if (transitioning) return;
      setTransitioning(true);
      setTooltip(t => ({ ...t, visible: false }));
      const meta = MapData.PROVINCES[cpro];
      const codauto = meta?.codauto;
      await MapData.loadMunicipalities(cpro);
      setLevel('municipality');
      setSelectedCcaa(codauto || null);
      setSelectedProvince(cpro);
      renderMunicipalities(cpro);
      await new Promise(r => setTimeout(r, 30));
      const feats = MapData.getMunicipalityFeatures(cpro);
      const f = feats.find(x => x.id === muniId);
      setTransitioning(false);
      if (f) {
        setHoveredId(muniId);
        zoomToMunicipio(f);
      }
    },
  }));

  // ── idle ambient pulses — one region at a time glows softly
  useEffect(() => {
    if (!ready || transitioning || hoveredId || intro) { setIdlePulseId(null); return; }
    if (level === 'municipality' && features.length > 200) { setIdlePulseId(null); return; }
    let alive = true;
    function schedule() {
      const delay = 1400 + Math.random() * 1600;
      setTimeout(() => {
        if (!alive) return;
        const f = features[Math.floor(Math.random() * features.length)];
        if (f) {
          setIdlePulseId(f.id);
          setTimeout(() => { if (alive) setIdlePulseId(null); }, 1100);
        }
        schedule();
      }, delay);
    }
    schedule();
    return () => { alive = false; };
  }, [ready, transitioning, hoveredId, intro, level, features]);

  // ── keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (e.key === 'Escape' || e.key === 'Backspace') {
        if (level !== 'ccaa' || selectedMuniId) { e.preventDefault(); goBack(); }
        return;
      }
      if (e.key === 'Enter') {
        if (!keyFocusId) return;
        e.preventDefault();
        const f = features.find(x => x.id === keyFocusId);
        if (!f) return;
        if (level === 'municipality') zoomToMunicipio(f);
        else navigateInto(f);
        return;
      }
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        if (!features.length) return;
        const current = keyFocusId || features[0].id;
        const meta = featureMeta;
        const cur = meta.get(current);
        if (!cur) { setKeyFocusId(features[0].id); return; }
        let bestId = current;
        let bestScore = Infinity;
        for (const f of features) {
          if (f.id === current) continue;
          const m = meta.get(f.id);
          if (!m) continue;
          const dx = m.cx - cur.cx;
          const dy = m.cy - cur.cy;
          let ok = false;
          if (e.key === 'ArrowLeft' && dx < -4) ok = true;
          if (e.key === 'ArrowRight' && dx > 4) ok = true;
          if (e.key === 'ArrowUp' && dy < -4) ok = true;
          if (e.key === 'ArrowDown' && dy > 4) ok = true;
          if (!ok) continue;
          // prefer aligned direction
          const primary = (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ? Math.abs(dx) : Math.abs(dy);
          const orth = (e.key === 'ArrowLeft' || e.key === 'ArrowRight') ? Math.abs(dy) : Math.abs(dx);
          const score = primary + orth * 2.5;
          if (score < bestScore) { bestScore = score; bestId = f.id; }
        }
        setKeyFocusId(bestId);
        setHoveredId(bestId);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [features, keyFocusId, level, selectedMuniId, featureMeta]);

  // ── mouse
  function onSvgMouseMove(e) {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    setCursorSvg({ x: loc.x, y: loc.y });
  }
  function svgPointFromEvent(e) {
    const svg = e.currentTarget.ownerSVGElement || e.currentTarget;
    if (!svg.createSVGPoint) return null;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    return { x: loc.x, y: loc.y };
  }
  function onRegionEnter(e, f) {
    setHoveredId(f.id);
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const name = f.properties?.name || f.id;
    let sub = '';
    if (level === 'ccaa') sub = MapData.CCAA[f.id]?.uniprovincial ? 'Uniprovincial' : 'Comunidad Autónoma';
    else if (level === 'province') sub = 'Provincia';
    else sub = 'Municipio';
    setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, name, sub });
  }
  function onRegionMove(e) {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip(t => ({ ...t, x: e.clientX - rect.left, y: e.clientY - rect.top }));
  }
  function onRegionLeave() { setHoveredId(null); setTooltip(t => ({ ...t, visible: false })); }
  function onRegionDown(f) { setPressedId(f.id); setTimeout(() => setPressedId(null), 140); }
  function onRegionClick(e, f) {
    const pt = svgPointFromEvent(e);
    if (level === 'municipality') { zoomToMunicipio(f, pt); return; }
    navigateInto(f, pt);
  }

  function transformFor(f) {
    const meta = featureMeta.get(f.id);
    if (!meta) return null;
    const { cx, cy } = meta;
    const isHover = hoveredId === f.id;
    const isPressed = pressedId === f.id;
    const isFocused = focusedId === f.id;
    const isMuniPicked = selectedMuniId === f.id;
    const isKeyFocused = keyFocusId === f.id;
    const isIdlePulse = idlePulseId === f.id;

    const dx = cursorSvg.x - cx;
    const dy = cursorSvg.y - cy;
    const dist = Math.hypot(dx, dy);
    const proxRadius = level === 'municipality' ? 80 : 180;
    const prox = Math.max(0, 1 - dist / proxRadius);

    let scale = 1 + (isHover ? 0.035 : prox * 0.012);
    let tx = 0, ty = 0;
    if (isHover) ty -= 4;
    if (isPressed) scale *= 0.94;
    if (isFocused) { scale *= 1.06; ty -= 6; }
    if (isMuniPicked) { scale *= 1.04; }
    if (isKeyFocused && !isHover) { scale *= 1.02; ty -= 2; }

    return { cx, cy, scale, tx, ty, isHover, isFocused, isMuniPicked, isKeyFocused, isIdlePulse, prox };
  }

  const showMesh = level !== 'municipality' || features.length < 350;
  const strokeW = level === 'ccaa' ? 1.1 : level === 'province' ? 0.8 : 0.35;

  // Which features get always-on labels: biggest N at ccaa / province level
  const labelIds = useMemo(() => {
    if (level === 'municipality') return new Set();
    const sorted = [...features]
      .map(f => ({ id: f.id, area: featureMeta.get(f.id)?.area || 0 }))
      .sort((a, b) => b.area - a.area);
    const N = level === 'ccaa' ? 12 : Math.min(8, sorted.length);
    return new Set(sorted.slice(0, N).map(x => x.id));
  }, [features, featureMeta, level]);

  return (
    <div ref={wrapperRef} className="map-wrapper">
      <Breadcrumb
        level={level}
        ccaa={selectedCcaa ? MapData.CCAA[selectedCcaa] : null}
        province={selectedProvince ? MapData.PROVINCES[selectedProvince] : null}
        onBack={goBack}
        onGoTo={goTo}
      />

      <div className="map-stage">
        <svg className="map-svg"
             viewBox={`${viewBox[0]} ${viewBox[1]} ${viewBox[2]} ${viewBox[3]}`}
             preserveAspectRatio="xMidYMid meet"
             onMouseMove={onSvgMouseMove}>
          <MapDefs accent={tweaks?.accent || '#00d4ff'} glow={tweaks?.glow ?? 1} featureMeta={featureMeta} />
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bgGrad)" />

          {outlinePath && level !== 'ccaa' && (
            <path d={outlinePath} className="ctx-outline" />
          )}

          <g className="regions-layer" style={{ opacity: intro ? 0.3 : 1, transition: 'opacity 800ms ease' }}>
            {ready && features.map(f => {
              const d = pathGenRef.current ? pathGenRef.current(f) : '';
              const tf = transformFor(f);
              if (!d || !tf) return null;
              const { cx, cy, scale, tx, ty, isHover, isFocused, isMuniPicked, isKeyFocused, isIdlePulse, prox } = tf;
              const dim = focusedId && !isFocused ? 0.12
                        : (selectedMuniId && !isMuniPicked && !isHover ? 0.38 : 1);
              const restFill = `url(#fillRest-${f.id})`;
              const hoverFill = `url(#fillHover-${f.id})`;
              return (
                <g key={f.id}
                   className={`region ${isHover ? 'hovered' : ''} ${isFocused ? 'focused' : ''}`}
                   style={{
                     transformOrigin: `${cx}px ${cy}px`,
                     transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
                     opacity: dim,
                     transition: `transform 260ms cubic-bezier(.22,1.2,.36,1), opacity 400ms ease`,
                     filter: isHover ? `drop-shadow(0 6px 12px rgba(0,0,0,.45))` : 'none',
                   }}>
                  <path
                    d={d}
                    className="region-fill"
                    fill={isHover || isMuniPicked ? hoverFill : restFill}
                    stroke={isHover || isMuniPicked || isKeyFocused ? `url(#strokeHover)` : `url(#strokeRest)`}
                    strokeWidth={isHover || isMuniPicked ? strokeW * 1.8 : isKeyFocused ? strokeW * 1.4 : strokeW}
                    onMouseEnter={(e) => onRegionEnter(e, f)}
                    onMouseMove={onRegionMove}
                    onMouseLeave={onRegionLeave}
                    onMouseDown={() => onRegionDown(f)}
                    onClick={(e) => onRegionClick(e, f)}
                    style={{ cursor: 'pointer' }}
                  />
                  {prox > 0.02 && (
                    <path d={d} fill="url(#prismWash)" opacity={prox * 0.55}
                          style={{ pointerEvents: 'none', mixBlendMode: 'screen' }} />
                  )}
                  {(isHover || isMuniPicked) && (
                    <path d={d} fill="none" stroke={tweaks?.accent || '#00d4ff'} strokeWidth={strokeW * 2.2}
                          style={{ pointerEvents: 'none', filter: 'blur(2px)' }} className="breathe" />
                  )}
                  {isIdlePulse && !isHover && (
                    <path d={d} fill="none" stroke={tweaks?.accent || '#00d4ff'} strokeWidth={strokeW * 1.8}
                          style={{ pointerEvents: 'none', filter: 'blur(1.2px)' }} className="idle-pulse" />
                  )}
                </g>
              );
            })}
          </g>

          {/* Floating labels */}
          <g className="labels-layer" style={{ pointerEvents: 'none', opacity: intro ? 0 : 1, transition: 'opacity 700ms ease' }}>
            {ready && level !== 'municipality' && features.map(f => {
              const meta = featureMeta.get(f.id);
              if (!meta) return null;
              const isHover = hoveredId === f.id;
              const alwaysOn = labelIds.has(f.id);
              if (!alwaysOn && !isHover) return null;
              const name = f.properties?.name || f.id;
              const displayName = shortenName(name);
              const fontSize = level === 'ccaa' ? (isHover ? 11 : 9.5) : (isHover ? 9.5 : 8);
              // skip enclaves on ccaa — they have badges
              if (level === 'ccaa' && (f.id === '18' || f.id === '19')) return null;
              return (
                <g key={`lbl-${f.id}`} className={`region-label ${isHover ? 'lbl-hover' : ''}`}
                   transform={`translate(${meta.cx}, ${meta.cy})`}>
                  <text className="lbl-halo" textAnchor="middle" dy="0.32em"
                        style={{ fontSize: `${fontSize}px` }}>{displayName}</text>
                  <text className="lbl-text" textAnchor="middle" dy="0.32em"
                        style={{ fontSize: `${fontSize}px` }}>{displayName}</text>
                </g>
              );
            })}
          </g>

          {/* Ceuta / Melilla enlarged hit badges on España view */}
          {level === 'ccaa' && enclaveBadges.map(b => {
            const isHover = hoveredId === b.id;
            const r = isHover ? 13 : 10;
            return (
              <g key={`badge-${b.id}`}
                 style={{ cursor: 'pointer', transition: 'transform 220ms cubic-bezier(.2,1,.3,1)',
                          transform: isHover ? `translate(0px,-2px)` : 'none', transformOrigin: `${b.cx}px ${b.cy}px` }}
                 onMouseEnter={(e) => {
                   setHoveredId(b.id);
                   const rect = wrapperRef.current?.getBoundingClientRect();
                   if (rect) setTooltip({ visible: true, x: e.clientX - rect.left, y: e.clientY - rect.top, name: b.name, sub: 'Ciudad Autónoma' });
                 }}
                 onMouseMove={onRegionMove}
                 onMouseLeave={onRegionLeave}
                 onClick={(e) => {
                   const f = features.find(x => x.id === b.id);
                   const pt = svgPointFromEvent(e);
                   if (f) navigateInto(f, pt);
                 }}>
                <circle cx={b.cx} cy={b.cy} r={r + 8}
                        fill={tweaks?.accent || '#00d4ff'} opacity="0.12" />
                <circle cx={b.cx} cy={b.cy} r={r + 3}
                        fill={tweaks?.accent || '#00d4ff'} opacity="0.22" />
                <circle cx={b.cx} cy={b.cy} r={r}
                        fill={`url(#fillHover-${b.id})`} stroke="url(#strokeHover)" strokeWidth="1.2"
                        style={{ filter: 'url(#softGlow)' }} />
                <text x={b.cx} y={b.cy + r + 14} textAnchor="middle"
                      style={{ pointerEvents: 'none',
                               font: '600 9px "Orbitron", sans-serif',
                               letterSpacing: '0.2em',
                               fill: tweaks?.accent || '#00d4ff',
                               textTransform: 'uppercase' }}>
                  {b.name}
                </text>
                <circle cx={b.cx} cy={b.cy} r={r}
                        fill="none" stroke={tweaks?.accent || '#00d4ff'} strokeWidth="1"
                        className="enclave-pulse" style={{ pointerEvents: 'none' }} />
              </g>
            );
          })}

          {/* Click shockwaves */}
          {ripples.map(r => (
            <Ripple key={r.id} cx={r.cx} cy={r.cy} accent={tweaks?.accent || '#00d4ff'} t0={r.t0} />
          ))}

          {showMesh && meshPath && (
            <path ref={meshPathElRef} d={meshPath} className="mesh"
                  stroke={tweaks?.accent || '#00d4ff'}
                  strokeWidth={strokeW * 0.8}
                  fill="none"
                  style={{ filter: `url(#softGlow)`, opacity: 0.6, pointerEvents: 'none' }} />
          )}
        </svg>

        <BorderParticles
          pathRef={meshPathElRef}
          accent={tweaks?.accent || '#00d4ff'}
          enabled={!!tweaks?.particles}
          count={level === 'municipality' ? 80 : 50}
          speed={tweaks?.motionSpeed || 1}
        />

        <Tooltip {...tooltip} />
        <Legend level={level} count={features.length} accent={tweaks?.accent || '#00d4ff'} />
        <Minimap level={level}
                 selectedCcaa={selectedCcaa}
                 selectedProvince={selectedProvince}
                 accent={tweaks?.accent || '#00d4ff'} />

        {!ready && <div className="loading"><div className="spinner" /></div>}
      </div>
    </div>
  );
});

// ── Ripple (click shockwave) ────────────────────────────────────────────
function Ripple({ cx, cy, accent, t0 }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    function tick(now) {
      const dt = (now - t0) / 1000;
      const pp = Math.min(1, dt / 1.0);
      setP(pp);
      if (pp < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [t0]);
  const r = 4 + easeOutQuart(p) * 180;
  const op = (1 - p) * 0.8;
  return (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={accent} strokeWidth={2.4 - p * 2}
              opacity={op} style={{ filter: 'blur(0.5px)' }} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="#ffffff" strokeWidth={1 - p * 0.9}
              opacity={op * 0.6} />
    </g>
  );
}

// ── Minimap ────────────────────────────────────────────────────────────
// Tiny static España in the corner; highlights the current CCAA/Province.
function Minimap({ level, selectedCcaa, selectedProvince, accent }) {
  const [paths, setPaths] = useState([]);
  const [provPaths, setProvPaths] = useState([]);
  const pgRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      await MapData.loadCcaa();
      if (!alive) return;
      const feats = MapData.getCcaaFeatures();
      const proj = d3.geoConicConformalSpain();
      proj.fitExtent([[4, 4], [156, 86]], { type: 'FeatureCollection', features: feats });
      const pg = d3.geoPath(proj);
      pgRef.current = pg;
      setPaths(feats.map(f => ({ id: f.id, d: pg(f) })));
      await MapData.loadProvinces();
      if (!alive) return;
      const provs = d3.geoPath(proj);
      const pfeats = [];
      for (const id of Object.keys(MapData.PROVINCES)) {
        const f = topojson.feature(MapData.state?.provincesTopo || {}, {});
      }
      // Instead use the helper
      const allProvs = [];
      for (const id of Object.keys(MapData.PROVINCES)) {
        const codauto = MapData.PROVINCES[id].codauto;
        const feats2 = MapData.getProvinceFeatures(codauto);
        for (const pf of feats2) {
          if (!allProvs.find(x => x.id === pf.id)) allProvs.push(pf);
        }
      }
      setProvPaths(allProvs.map(f => ({ id: f.id, d: pg(f), codauto: MapData.PROVINCES[f.id]?.codauto })));
    })();
    return () => { alive = false; };
  }, []);

  if (!paths.length) return null;

  return (
    <div className="minimap" style={{ '--accent': accent }}>
      <div className="mm-title">
        <span className="mm-pulse" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
        España
      </div>
      <svg viewBox="0 0 160 90" className="mm-svg">
        <defs>
          <linearGradient id="mmFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
            <stop offset="100%" stopColor={accent} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* All CCAA outline */}
        {paths.map(p => (
          <path key={p.id} d={p.d}
                fill={selectedCcaa === p.id ? 'url(#mmFill)' : 'rgba(255,255,255,0.03)'}
                stroke={selectedCcaa === p.id ? accent : 'rgba(255,255,255,0.15)'}
                strokeWidth={selectedCcaa === p.id ? 0.6 : 0.25}
                style={{ transition: 'all 300ms ease',
                         filter: selectedCcaa === p.id ? `drop-shadow(0 0 3px ${accent})` : 'none' }}
          />
        ))}
        {/* Highlighted province */}
        {level === 'municipality' && selectedProvince && provPaths
          .filter(p => p.id === selectedProvince)
          .map(p => (
            <path key={`mp-${p.id}`} d={p.d}
                  fill={accent} fillOpacity="0.7"
                  stroke="#ffffff" strokeWidth="0.5"
                  style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
          ))}
      </svg>
      <div className="mm-level">
        <span className="mm-chev" style={{ color: level === 'ccaa' ? accent : 'var(--text-dim)' }}>●</span>
        <span className="mm-chev" style={{ color: level === 'province' || level === 'municipality' ? accent : 'var(--text-dim)' }}>●</span>
        <span className="mm-chev" style={{ color: level === 'municipality' ? accent : 'var(--text-dim)' }}>●</span>
      </div>
    </div>
  );
}

function shortenName(name) {
  // Strip parentheticals & slash alternates for compact labels
  let s = name.replace(/\s*\([^)]*\)/g, '');
  s = s.split('/')[0];
  return s.trim();
}

// ── Gradient/filter defs ────────────────────────────────────────────────
// We generate a per-feature fill gradient with a hue offset so each region
// gets its own iridescent signature while staying in the accent family.
function MapDefs({ accent, glow, featureMeta }) {
  const c1 = accent;
  const c2 = shiftHue(accent, 80);
  const c3 = shiftHue(accent, 160);
  const gBlur = 1 + glow * 2;
  const gBlur2 = 2 + glow * 3.5;

  // Per-feature gradients
  const perFeatureGrads = [];
  if (featureMeta) {
    for (const [id, m] of featureMeta.entries()) {
      const hueOffset = (m.hue - 180) * 0.4; // -72..72° variation
      const a = shiftHue(accent, hueOffset);
      const b = shiftHue(accent, hueOffset + 80);
      const c = shiftHue(accent, hueOffset + 160);
      perFeatureGrads.push(
        <linearGradient key={`fr-${id}`} id={`fillRest-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} stopOpacity="0.11" />
          <stop offset="50%" stopColor={b} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c} stopOpacity="0.11" />
        </linearGradient>,
        <linearGradient key={`fh-${id}`} id={`fillHover-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={a} stopOpacity="0.55" />
          <stop offset="50%" stopColor={b} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c} stopOpacity="0.55" />
        </linearGradient>
      );
    }
  }

  return (
    <defs>
      <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(10,12,22,0)" />
        <stop offset="100%" stopColor="rgba(10,12,22,0.4)" />
      </linearGradient>
      <linearGradient id="strokeRest" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
        <stop offset="100%" stopColor={c3} stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id="strokeHover" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={c1} />
        <stop offset="50%" stopColor="#ffffff" />
        <stop offset="100%" stopColor={c3} />
      </linearGradient>
      <radialGradient id="prismWash">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
        <stop offset="40%" stopColor={c2} stopOpacity="0.25" />
        <stop offset="100%" stopColor={c3} stopOpacity="0" />
      </radialGradient>
      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceAlpha" stdDeviation={gBlur} result="b1" />
        <feFlood floodColor={c1} floodOpacity={0.5 + glow * 0.2} result="c1" />
        <feComposite in="c1" in2="b1" operator="in" result="g1" />
        <feGaussianBlur in="SourceAlpha" stdDeviation={gBlur2} result="b2" />
        <feFlood floodColor={c3} floodOpacity={0.28 + glow * 0.15} result="c2" />
        <feComposite in="c2" in2="b2" operator="in" result="g2" />
        <feMerge>
          <feMergeNode in="g2" />
          <feMergeNode in="g1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      {perFeatureGrads}
    </defs>
  );
}

function shiftHue(hex, deg) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = ((n >> 16) & 255) / 255;
  const g = ((n >> 8) & 255) / 255;
  const b = (n & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let H, S, L = (max + min) / 2;
  const D = max - min;
  if (!D) { H = 0; S = 0; }
  else {
    S = L > 0.5 ? D / (2 - max - min) : D / (max + min);
    switch (max) {
      case r: H = ((g - b) / D + (g < b ? 6 : 0)); break;
      case g: H = (b - r) / D + 2; break;
      default: H = (r - g) / D + 4;
    }
    H *= 60;
  }
  H = (H + deg) % 360; if (H < 0) H += 360;
  const c = (1 - Math.abs(2 * L - 1)) * S;
  const x = c * (1 - Math.abs((H / 60) % 2 - 1));
  const m = L - c / 2;
  let [r2, g2, b2] = [0, 0, 0];
  if (H < 60) [r2, g2, b2] = [c, x, 0];
  else if (H < 120) [r2, g2, b2] = [x, c, 0];
  else if (H < 180) [r2, g2, b2] = [0, c, x];
  else if (H < 240) [r2, g2, b2] = [0, x, c];
  else if (H < 300) [r2, g2, b2] = [x, 0, c];
  else [r2, g2, b2] = [c, 0, x];
  const to = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return '#' + to(r2) + to(g2) + to(b2);
}

function Breadcrumb({ level, ccaa, province, onBack, onGoTo }) {
  const canGoBack = level !== 'ccaa';
  return (
    <div className="breadcrumb">
      <button className="bc-back" disabled={!canGoBack} onClick={onBack} aria-label="Back">
        <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2 L4 7 L9 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      <button className={`bc-item ${level === 'ccaa' ? 'active' : ''}`} onClick={() => onGoTo('ccaa')}>España</button>
      {ccaa && (<>
        <span className="bc-sep">◆</span>
        <button className={`bc-item ${level === 'province' ? 'active' : ''}`} onClick={() => onGoTo('province')}>{ccaa.name}</button>
      </>)}
      {province && (<>
        <span className="bc-sep">◆</span>
        <button className="bc-item active">{province.name}</button>
      </>)}
      <div className="bc-level-tag">{level === 'ccaa' ? 'COMUNIDADES' : level === 'province' ? 'PROVINCIAS' : 'MUNICIPIOS'}</div>
    </div>
  );
}

function Tooltip({ visible, x, y, name, sub }) {
  return (
    <div className={`tooltip ${visible ? 'visible' : ''}`} style={{ left: x + 14, top: y - 10 }}>
      <div className="tt-sub">{sub}</div>
      <div className="tt-name">{name}</div>
    </div>
  );
}

// Animated counter legend. On count change, tweens prior → new over ~600ms.
function Legend({ level, count, accent }) {
  const [display, setDisplay] = useState(count);
  const fromRef = useRef(count);
  useEffect(() => {
    cancelAnimationFrame(fromRef.raf);
    const from = fromRef.current;
    const to = count;
    const t0 = performance.now();
    function step(now) {
      const p = Math.min(1, (now - t0) / 600);
      const e = easeOutQuart(p);
      const val = Math.round(from + (to - from) * e);
      setDisplay(val);
      if (p < 1) fromRef.raf = requestAnimationFrame(step);
      else fromRef.current = to;
    }
    fromRef.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(fromRef.raf);
  }, [count]);
  return (
    <div className="legend">
      <div className="lg-dot" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
      <div className="lg-count">{display.toLocaleString('es')}</div>
      <div className="lg-label">
        {level === 'ccaa' ? 'regiones' : level === 'province' ? 'provincias' : 'municipios'}
      </div>
    </div>
  );
}

Object.assign(window, { SpainMap });
