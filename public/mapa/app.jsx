// app.jsx — Root. Composes background FX, the map, and the Tweaks panel.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00d4ff",
  "glow": 1.0,
  "particles": true,
  "scanlines": false,
  "motionSpeed": 1.0,
  "transition": "lift-drift",
  "grid": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mapRef = React.useRef(null);
  const [mapReady, setMapReady] = React.useState(false);

  // Expose accent on :root for CSS
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    document.documentElement.style.setProperty('--accent-2', shiftHueCss(t.accent, 80));
    document.documentElement.style.setProperty('--accent-3', shiftHueCss(t.accent, 160));
  }, [t.accent]);

  // Background-preload every province's municipalities so the search index
  // can resolve any muni instantly. Paced to avoid hammering the network.
  React.useEffect(() => {
    if (!mapReady) return;
    let cancelled = false;
    (async () => {
      const cpros = Object.keys(window.MapData.PROVINCES);
      for (const cpro of cpros) {
        if (cancelled) return;
        try { await window.MapData.loadMunicipalities(cpro); } catch {}
      }
    })();
    return () => { cancelled = true; };
  }, [mapReady]);

  // Listen for messages from parent (e.g. StatsSection clicking a city)
  React.useEffect(() => {
    const onMsg = (e) => {
      if (e.data.type === 'fly-to') {
        mapRef.current?.flyToMunicipio(e.data.cpro, e.data.muniId);
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [mapReady]);

  // No content needed here for mouse propagation

  return (
    <>
      <ParallaxGrid accent={t.accent} enabled={t.grid} speed={t.motionSpeed} />
      <CursorLight accent={t.accent} intensity={t.glow} />
      <Scanlines enabled={t.scanlines} accent={t.accent} />

      <div className="app-chrome">
        <div className="brand">
          <div className="brand-mark" style={{ background: `radial-gradient(circle at 30% 30%, var(--accent-2), var(--accent))` }} />
          <div className="brand-text">
            <div className="brand-title">ATLAS / ES</div>
            <div className="brand-sub">Mapa reglado · Comunidades → Provincias → Municipios</div>
          </div>
        </div>
        <div className="hint">
          <span className="kbd">click</span> <span>para entrar</span>
          <span className="dot" />
          <span className="kbd">←</span> <span>volver</span>
        </div>
      </div>

      <SpainMap ref={mapRef} tweaks={t} onReady={() => setMapReady(true)} />

      <Search mapRef={mapRef} mapReady={mapReady} accent={t.accent} />

      <TweaksPanel title="Tweaks">
        <TweakSection label="Color" />
        <TweakColor label="Accent" value={t.accent} onChange={(v) => setTweak('accent', v)} />
        <div className="accent-presets">
          {['#00d4ff','#b56bff','#ff6bd6','#ffb84a','#89ff6a','#ffffff'].map(c => (
            <button key={c} className="ap-swatch" style={{ background: c }}
                    onClick={() => setTweak('accent', c)} aria-label={c} />
          ))}
        </div>

        <TweakSection label="Effects" />
        <TweakSlider label="Glow" min={0} max={2} step={0.1} value={t.glow}
                     onChange={(v) => setTweak('glow', v)} />
        <TweakToggle label="Border particles" value={t.particles}
                     onChange={(v) => setTweak('particles', v)} />
        <TweakToggle label="Background grid" value={t.grid}
                     onChange={(v) => setTweak('grid', v)} />
        <TweakToggle label="Scanlines" value={t.scanlines}
                     onChange={(v) => setTweak('scanlines', v)} />

        <TweakSection label="Motion" />
        <TweakSlider label="Speed" min={0.3} max={2.5} step={0.1} value={t.motionSpeed}
                     onChange={(v) => setTweak('motionSpeed', v)} />
        <TweakRadio label="Transition" value={t.transition}
                    options={[
                      { value: 'lift-drift', label: 'Lift' },
                      { value: 'fast-fade', label: 'Fade' },
                      { value: 'shatter', label: 'Burst' },
                    ]}
                    onChange={(v) => setTweak('transition', v)} />
      </TweaksPanel>
    </>
  );
}

// CSS-facing helper (same math as spain-map's shiftHue)
function shiftHueCss(hex, deg) { return shiftHue(hex, deg); }

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
