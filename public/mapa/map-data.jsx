// map-data.jsx — TopoJSON loader + lookups for CCAA / Provinces / Municipalities
// Exposes window.MapData with async helpers. No React here; pure data.

const CCAA = {
  '01': { name: 'Andalucía', uniprovincial: false },
  '02': { name: 'Aragón', uniprovincial: false },
  '03': { name: 'Principado de Asturias', uniprovincial: true, cpro: '33' },
  '04': { name: 'Illes Balears', uniprovincial: true, cpro: '07' },
  '05': { name: 'Canarias', uniprovincial: false },
  '06': { name: 'Cantabria', uniprovincial: true, cpro: '39' },
  '07': { name: 'Castilla y León', uniprovincial: false },
  '08': { name: 'Castilla-La Mancha', uniprovincial: false },
  '09': { name: 'Cataluña', uniprovincial: false },
  '10': { name: 'Comunitat Valenciana', uniprovincial: false },
  '11': { name: 'Extremadura', uniprovincial: false },
  '12': { name: 'Galicia', uniprovincial: false },
  '13': { name: 'Comunidad de Madrid', uniprovincial: true, cpro: '28' },
  '14': { name: 'Región de Murcia', uniprovincial: true, cpro: '30' },
  '15': { name: 'Comunidad Foral de Navarra', uniprovincial: true, cpro: '31' },
  '16': { name: 'País Vasco', uniprovincial: false },
  '17': { name: 'La Rioja', uniprovincial: true, cpro: '26' },
  '18': { name: 'Ceuta', uniprovincial: true, cpro: '51' },
  '19': { name: 'Melilla', uniprovincial: true, cpro: '52' },
};

const PROVINCES = {
  '01': { name: 'Álava/Araba', codauto: '16' },
  '02': { name: 'Albacete', codauto: '08' },
  '03': { name: 'Alicante/Alacant', codauto: '10' },
  '04': { name: 'Almería', codauto: '01' },
  '05': { name: 'Ávila', codauto: '07' },
  '06': { name: 'Badajoz', codauto: '11' },
  '07': { name: 'Illes Balears', codauto: '04' },
  '08': { name: 'Barcelona', codauto: '09' },
  '09': { name: 'Burgos', codauto: '07' },
  '10': { name: 'Cáceres', codauto: '11' },
  '11': { name: 'Cádiz', codauto: '01' },
  '12': { name: 'Castellón/Castelló', codauto: '10' },
  '13': { name: 'Ciudad Real', codauto: '08' },
  '14': { name: 'Córdoba', codauto: '01' },
  '15': { name: 'A Coruña', codauto: '12' },
  '16': { name: 'Cuenca', codauto: '08' },
  '17': { name: 'Girona', codauto: '09' },
  '18': { name: 'Granada', codauto: '01' },
  '19': { name: 'Guadalajara', codauto: '08' },
  '20': { name: 'Gipuzkoa', codauto: '16' },
  '21': { name: 'Huelva', codauto: '01' },
  '22': { name: 'Huesca', codauto: '02' },
  '23': { name: 'Jaén', codauto: '01' },
  '24': { name: 'León', codauto: '07' },
  '25': { name: 'Lleida', codauto: '09' },
  '26': { name: 'La Rioja', codauto: '17' },
  '27': { name: 'Lugo', codauto: '12' },
  '28': { name: 'Madrid', codauto: '13' },
  '29': { name: 'Málaga', codauto: '01' },
  '30': { name: 'Murcia', codauto: '14' },
  '31': { name: 'Navarra', codauto: '15' },
  '32': { name: 'Ourense', codauto: '12' },
  '33': { name: 'Asturias', codauto: '03' },
  '34': { name: 'Palencia', codauto: '07' },
  '35': { name: 'Las Palmas', codauto: '05' },
  '36': { name: 'Pontevedra', codauto: '12' },
  '37': { name: 'Salamanca', codauto: '07' },
  '38': { name: 'Santa Cruz de Tenerife', codauto: '05' },
  '39': { name: 'Cantabria', codauto: '06' },
  '40': { name: 'Segovia', codauto: '07' },
  '41': { name: 'Sevilla', codauto: '01' },
  '42': { name: 'Soria', codauto: '07' },
  '43': { name: 'Tarragona', codauto: '09' },
  '44': { name: 'Teruel', codauto: '02' },
  '45': { name: 'Toledo', codauto: '08' },
  '46': { name: 'Valencia/València', codauto: '10' },
  '47': { name: 'Valladolid', codauto: '07' },
  '48': { name: 'Bizkaia', codauto: '16' },
  '49': { name: 'Zamora', codauto: '07' },
  '50': { name: 'Zaragoza', codauto: '02' },
  '51': { name: 'Ceuta', codauto: '18' },
  '52': { name: 'Melilla', codauto: '19' },
};

// State kept at module scope so useMapData is a singleton.
const state = {
  ccaaTopo: null,
  provincesTopo: null,
  muniCache: new Map(),
  inflight: new Map(),
};

async function fetchJson(url) {
  if (state.inflight.has(url)) return state.inflight.get(url);
  const p = fetch(url).then(r => {
    if (!r.ok) throw new Error(`${url}: ${r.status}`);
    return r.json();
  });
  state.inflight.set(url, p);
  try { return await p; } finally { state.inflight.delete(url); }
}

async function loadCcaa() {
  if (state.ccaaTopo) return state.ccaaTopo;
  state.ccaaTopo = await fetchJson('data/ccaa.json');
  return state.ccaaTopo;
}
async function loadProvinces() {
  if (state.provincesTopo) return state.provincesTopo;
  state.provincesTopo = await fetchJson('data/provinces.json');
  return state.provincesTopo;
}
async function loadMunicipalities(cpro) {
  if (state.muniCache.has(cpro)) return state.muniCache.get(cpro);
  const topo = await fetchJson(`data/municipalities/${cpro}.json`);
  state.muniCache.set(cpro, topo);
  return topo;
}

function getCcaaFeatures() {
  if (!state.ccaaTopo) return [];
  return topojson.feature(state.ccaaTopo, state.ccaaTopo.objects.autonomous_regions).features;
}
function getCcaaMesh() {
  if (!state.ccaaTopo) return null;
  return topojson.mesh(state.ccaaTopo, state.ccaaTopo.objects.autonomous_regions, (a, b) => a !== b);
}
function getCcaaOutline() {
  if (!state.ccaaTopo) return null;
  return topojson.mesh(state.ccaaTopo, state.ccaaTopo.objects.autonomous_regions);
}
function getCompositionBorder() {
  if (!state.ccaaTopo || !state.ccaaTopo.objects.border) return null;
  return topojson.feature(state.ccaaTopo, state.ccaaTopo.objects.border);
}
function getProvinceFeatures(codauto) {
  if (!state.provincesTopo) return [];
  const all = topojson.feature(state.provincesTopo, state.provincesTopo.objects.provinces).features;
  return all.filter(f => PROVINCES[f.id]?.codauto === codauto);
}
function getProvinceMesh(codauto) {
  if (!state.provincesTopo) return null;
  return topojson.mesh(
    state.provincesTopo,
    state.provincesTopo.objects.provinces,
    (a, b) => a !== b && PROVINCES[a.id]?.codauto === codauto && PROVINCES[b.id]?.codauto === codauto
  );
}
function getMunicipalityFeatures(cpro) {
  const topo = state.muniCache.get(cpro);
  if (!topo) return [];
  return topojson.feature(topo, topo.objects.municipalities).features;
}
function getMunicipalityMesh(cpro) {
  const topo = state.muniCache.get(cpro);
  if (!topo) return null;
  return topojson.mesh(topo, topo.objects.municipalities, (a, b) => a !== b);
}

window.MapData = {
  CCAA, PROVINCES,
  loadCcaa, loadProvinces, loadMunicipalities,
  getCcaaFeatures, getCcaaMesh, getCcaaOutline, getCompositionBorder,
  getProvinceFeatures, getProvinceMesh,
  getMunicipalityFeatures, getMunicipalityMesh,
};
