import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getComparison, getSavedCars, updateComparison } from '../api';
import type { SavedCar } from '../api';

function Compare() {
  const navigate = useNavigate();
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [selected, setSelected] = useState<SavedCar[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { Promise.all([getSavedCars(), getComparison()]).then(([all, current]) => { setSavedCars(all); setSelected(current); }).catch((reason) => setError(reason instanceof Error ? reason.message : 'Võrdlusandmeid ei saanud laadida.')); }, []);

  const filtered = useMemo(() => savedCars.filter((car) => `${car.make} ${car.model}`.toLowerCase().includes(query.toLowerCase())), [savedCars, query]);
  const update = async (cars: SavedCar[]) => { setSelected(cars); try { await updateComparison(cars.map((car) => car.id)); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Võrdlust ei saanud salvestada.'); } };
  const toggle = (car: SavedCar) => { if (selected.some((item) => item.id === car.id)) void update(selected.filter((item) => item.id !== car.id)); else if (selected.length < 4) void update([...selected, car]); };

  return <div className="page compare-page"><div className="container">
    <div className="page-header"><p className="eyebrow"><span className="pulse-dot" />Ostueelne võrdlusanalüüs</p><h1>Autode võrdlus</h1><p>Vali kuni 4 enda salvestatud autot. Näidisautosid siin enam ei kuvata.</p></div>
    {error && <div className="notification error">{error}</div>}
    {selected.length > 0 && <><div className="comparison-slots-grid">{selected.map((car) => <div key={car.id} className="comparison-card"><button className="comparison-remove-btn" onClick={() => toggle(car)} aria-label={`Eemalda ${car.make} ${car.model}`}>✕</button><span className="meta-chip">{car.year ?? '—'}</span><h3>{car.make} {car.model}</h3><p>{car.mileageKm == null ? '—' : `${car.mileageKm.toLocaleString('et-EE')} km`} · {car.engine ?? 'Mootor teadmata'}</p><strong>{car.priceEur == null ? 'Hind teadmata' : `${Number(car.priceEur).toLocaleString('et-EE')} €`}</strong></div>)}</div>{selected.length >= 2 && <div style={{ textAlign: 'center', margin: '2rem 0' }}><button className="button" onClick={() => navigate('/compare/results', { state: { cars: selected } })}>Võrdle valitud {selected.length} autot →</button></div>}</>}
    <section className="report-card"><div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}><div><h2>Salvestatud autod</h2><p className="text-secondary">Vali võrdlusesse kuni neli autot.</p></div><input className="input sm" style={{ maxWidth: 300 }} placeholder="Otsi marki või mudelit…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>{filtered.length === 0 ? <div className="empty-state"><h3>Salvestatud autosid pole</h3><p>Salvesta esmalt vähemalt kaks Auto24 kuulutust.</p><Link to="/saved" className="button">Minu autod</Link></div> : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>{filtered.map((car) => { const active = selected.some((item) => item.id === car.id); return <div key={car.id} className="saved-card"><h3>{car.make} {car.model}</h3><p>{car.year ?? '—'} · {car.mileageKm == null ? '—' : `${car.mileageKm.toLocaleString('et-EE')} km`}</p><button className={`button sm ${active ? 'secondary' : ''}`} onClick={() => toggle(car)} disabled={!active && selected.length >= 4}>{active ? '✓ Võrdluses' : '+ Lisa võrdlusse'}</button></div>; })}</div>}</section>
  </div></div>;
}

export default Compare;
