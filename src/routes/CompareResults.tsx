import { Link, useLocation } from 'react-router-dom';
import type { SavedCar } from '../api';

function CompareResults() {
  const location = useLocation();
  const cars = (location.state as { cars?: SavedCar[] } | null)?.cars ?? [];
  if (cars.length < 2) return <div className="page"><div className="container empty-state"><h2>Võrdlusandmed puuduvad</h2><p>Vali võrdluseks vähemalt kaks salvestatud autot.</p><Link to="/compare" className="button">Mine võrdluslehele</Link></div></div>;
  const lowestPrice = Math.min(...cars.map((car) => Number(car.priceEur ?? Infinity)));
  const lowestMileage = Math.min(...cars.map((car) => Number(car.mileageKm ?? Infinity)));
  const newestYear = Math.max(...cars.map((car) => Number(car.year ?? 0)));
  return <div className="page compare-results-page"><div className="container"><div className="page-header"><p className="eyebrow">Põhjalik võrdlusmaatriks</p><h1>Autode võrdlus ({cars.length} sõidukit)</h1></div><div className="report-card" style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th>Parameeter</th>{cars.map((car) => <th key={car.id} style={{ textAlign: 'left', padding: '1rem' }}>{car.make} {car.model}</th>)}</tr></thead><tbody>{[['Hind', (car: SavedCar) => car.priceEur == null ? '—' : `${Number(car.priceEur).toLocaleString('et-EE')} €`], ['Aasta', (car: SavedCar) => car.year ?? '—'], ['Läbisõit', (car: SavedCar) => car.mileageKm == null ? '—' : `${car.mileageKm.toLocaleString('et-EE')} km`], ['Mootor', (car: SavedCar) => car.engine ?? '—'], ['Käigukast', (car: SavedCar) => car.transmission ?? '—']].map(([label, format]) => <tr key={String(label)}><td style={{ padding: '1rem', fontWeight: 700 }}>{String(label)}</td>{cars.map((car) => <td key={car.id} style={{ padding: '1rem' }}>{(format as (car: SavedCar) => string | number)(car)}{label === 'Hind' && Number(car.priceEur) === lowestPrice && <span className="status-pill success" style={{ marginLeft: '.5rem' }}>Parim hind</span>}{label === 'Läbisõit' && Number(car.mileageKm) === lowestMileage && <span className="status-pill success" style={{ marginLeft: '.5rem' }}>Väikseim</span>}{label === 'Aasta' && Number(car.year) === newestYear && <span className="status-pill success" style={{ marginLeft: '.5rem' }}>Uusim</span>}</td>)}</tr>)}</tbody></table></div><div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>{cars.map((car) => <Link key={car.id} to={car.analysisId ? `/report/${car.analysisId}` : '/saved'} className="button secondary">{car.make} {car.model} raport</Link>)}</div></div></div>;
}

export default CompareResults;
