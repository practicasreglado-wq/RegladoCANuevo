// search.jsx — Floating municipio search. Indexes every municipality name
// across all loaded province files, shows ranked suggestions, and asks the
// SpainMap to fly to the picked one.

const { useState, useEffect, useRef, useMemo } = React;

// Build a flat [{ muniId, cpro, name, provName, ccaaName, norm }] once
// municipality data is loaded. We rebuild whenever the cache size changes.
function useMuniIndex(ready) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!ready) return;
    // poll — map-data loads in background, index grows as files arrive
    let alive = true;
    function check() {
      if (!alive) return;
      setTick(t => t + 1);
    }
    const id = setInterval(check, 400);
    return () => { alive = false; clearInterval(id); };
  }, [ready]);

  return useMemo(() => {
    const out = [];
    if (!window.MapData) return out;
    for (const cpro of Object.keys(window.MapData.PROVINCES)) {
      const feats = window.MapData.getMunicipalityFeatures(cpro);
      const prov = window.MapData.PROVINCES[cpro];
      const ccaa = prov ? window.MapData.CCAA[prov.codauto] : null;
      for (const f of feats) {
        out.push({
          muniId: f.id,
          cpro,
          name: f.properties?.name || f.id,
          provName: prov?.name || '',
          ccaaName: ccaa?.name || '',
          norm: norm(f.properties?.name || f.id),
        });
      }
    }
    return out;
  }, [tick]);
}

function norm(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .trim();
}

function rank(items, q) {
  const nq = norm(q);
  if (!nq) return [];
  const res = [];
  for (const it of items) {
    const idx = it.norm.indexOf(nq);
    if (idx === -1) continue;
    // Prefer prefix matches, then word-start, then shorter names
    let score = 1000 - idx * 10 + (it.name.length < 12 ? 5 : 0);
    // word-start bonus
    if (idx === 0 || it.norm[idx - 1] === ' ') score += 50;
    // exact match bonus
    if (it.norm === nq) score += 500;
    res.push({ it, score });
  }
  res.sort((a, b) => b.score - a.score);
  return res.slice(0, 8).map(r => r.it);
}

function Search({ mapRef, mapReady, accent }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [hi, setHi] = useState(0);
  const [indexCount, setIndexCount] = useState(0);
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const index = useMuniIndex(mapReady);

  useEffect(() => { setIndexCount(index.length); }, [index.length]);

  const results = useMemo(() => rank(index, q), [index, q]);
  useEffect(() => { setHi(0); }, [q]);

  // Keyboard: ⌘K / Ctrl+K to open
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(v => !v);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ('');
    }
  }, [open]);

  // Click outside to close
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (!wrapperRef.current?.contains(e.target)) setOpen(false);
    }
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  function pick(r) {
    setOpen(false);
    mapRef?.current?.flyToMunicipio(r.cpro, r.muniId);
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi(h => Math.max(h - 1, 0)); }
    else if (e.key === 'Enter' && results[hi]) { e.preventDefault(); pick(results[hi]); }
  }

  return (
    <>
      {/* Trigger pill */}
      <button className="search-trigger" onClick={() => setOpen(true)}
              style={{ '--accent': accent }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <circle cx="5" cy="5" r="3.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7.5 7.5 L10 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <span className="st-label">Buscar municipio</span>
        <span className="st-kbd">⌘K</span>
      </button>

      {/* Overlay + modal */}
      <div className={`search-overlay ${open ? 'open' : ''}`}>
        <div ref={wrapperRef} className="search-modal" style={{ '--accent': accent }}>
          <div className="sm-header">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: accent }}>
              <circle cx="6" cy="6" r="3.8" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8.8 8.8 L12 12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <input ref={inputRef}
                   value={q}
                   placeholder={indexCount ? `Buscar entre ${indexCount.toLocaleString('es')} municipios...` : 'Cargando índice...'}
                   onChange={e => setQ(e.target.value)}
                   onKeyDown={onKeyDown} />
            <div className="sm-esc">ESC</div>
          </div>

          <div className="sm-results">
            {q && results.length === 0 && (
              <div className="sm-empty">
                <div className="sm-empty-t">Sin coincidencias</div>
                <div className="sm-empty-s">Probad con otro nombre</div>
              </div>
            )}
            {!q && (
              <div className="sm-hint">
                <div className="sm-hint-col">
                  <div className="sm-hint-k">↑↓</div><div className="sm-hint-v">Navegar</div>
                </div>
                <div className="sm-hint-col">
                  <div className="sm-hint-k">↵</div><div className="sm-hint-v">Saltar</div>
                </div>
                <div className="sm-hint-col">
                  <div className="sm-hint-k">ESC</div><div className="sm-hint-v">Cerrar</div>
                </div>
              </div>
            )}
            {results.map((r, i) => (
              <button key={`${r.cpro}-${r.muniId}`}
                      className={`sm-row ${i === hi ? 'hi' : ''}`}
                      onMouseEnter={() => setHi(i)}
                      onClick={() => pick(r)}>
                <div className="sm-row-name">
                  {highlight(r.name, q)}
                </div>
                <div className="sm-row-path">
                  <span>{r.provName}</span>
                  <span className="sm-dot">·</span>
                  <span className="sm-ccaa">{r.ccaaName}</span>
                </div>
                <div className="sm-row-arrow">↵</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function highlight(text, q) {
  if (!q) return text;
  const nq = norm(q);
  const nt = norm(text);
  const idx = nt.indexOf(nq);
  if (idx === -1) return text;
  // Map back to original indices: since norm strips diacritics but keeps length,
  // index aligns 1:1 with the original string.
  return (
    <>
      {text.slice(0, idx)}
      <span className="sm-hl">{text.slice(idx, idx + nq.length)}</span>
      {text.slice(idx + nq.length)}
    </>
  );
}

Object.assign(window, { Search });
