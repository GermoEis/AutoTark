import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deleteSavedCar, getSavedCars } from '../api';
import type { SavedCar } from '../api';

function SavedCars() {
  const navigate = useNavigate();
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'mileage'>('default');
  const [error, setError] = useState('');
  useEffect(() => { getSavedCars().then(setSavedCars).catch((reason) => setError(reason instanceof Error ? reason.message : 'Salvestatud autosid ei saanud laadida.')); }, []);

  const removeCar = async (id: string) => {
    try { await deleteSavedCar(id); setSavedCars((current) => current.filter((car) => car.id !== id)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Autot ei saanud eemaldada.'); }
  };
  const sortedCars = useMemo(() => [...savedCars].sort((a, b) => {
    if (sortBy === 'price-asc') return Number(a.priceEur ?? Infinity) - Number(b.priceEur ?? Infinity);
    if (sortBy === 'price-desc') return Number(b.priceEur ?? -Infinity) - Number(a.priceEur ?? -Infinity);
    if (sortBy === 'mileage') return Number(a.mileageKm ?? Infinity) - Number(b.mileageKm ?? Infinity);
    return 0;
  }), [savedCars, sortBy]);

  return <div className="page saved-cars-page"><div className="container">
    <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}><div><p className="eyebrow"><span className="pulse-dot" />Sinu isiklik garaaž</p><h1>Salvestatud autod ({savedCars.length})</h1><p>Jälgi ja võrdle oma päriselt imporditud kuulutusi.</p></div>{savedCars.length > 0 && <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center', flexWrap: 'wrap' }}><span>Sorteeri:</span><button className="sample-btn" onClick={() => setSortBy('default')}>Vaikimisi</button><button className="sample-btn" onClick={() => setSortBy('price-asc')}>Odavamad</button><button className="sample-btn" onClick={() => setSortBy('mileage')}>Väikseim läbisõit</button></div>}</div>
    {error && <div className="notification error">{error}</div>}
    {sortedCars.length === 0 ? <div className="empty-state"><div className="empty-state-icon">＋</div><h2>Salvestatud autosid pole</h2><p className="text-secondary">Impordi Auto24 kuulutus avalehel ja salvesta see raportist.</p><Link to="/" className="button">Kontrolli autot avalehel</Link></div> : <div className="saved-cars-grid">{sortedCars.map((car) => <div key={car.id} className="saved-card"><div><span className="meta-chip">{car.year ?? 'Aasta teadmata'}</span><h3>{car.make} {car.model}</h3><div className="saved-card-price">{car.priceEur == null ? 'Hind teadmata' : `${Number(car.priceEur).toLocaleString('et-EE')} €`}</div><div className="text-secondary">Läbisõit: <strong>{car.mileageKm == null ? '—' : `${car.mileageKm.toLocaleString('et-EE')} km`}</strong></div><div className="text-secondary">{car.engine ?? 'Mootor teadmata'} · {car.transmission ?? 'Käigukast teadmata'}</div></div><div className="saved-card-actions"><Link to={car.analysisId ? `/report/${car.analysisId}` : '/'} className="button">{car.analysisId ? 'Vaata analüüsi →' : 'Alusta analüüsi'}</Link><button className="button secondary" onClick={() => removeCar(car.id)}>Eemalda</button></div></div>)}</div>}
    <button className="button secondary" style={{ marginTop: '1.5rem' }} onClick={() => navigate('/')}>Lisa Auto24 kuulutus</button>
  </div></div>;
}

export default SavedCars;
