import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { cars, type Car } from '../data/cars';
import { mockAnalysis } from '../data/mockAnalysis';

interface ComparisonCar {
  car: Car;
  analysis: typeof mockAnalysis;
}

function Compare() {
  const [comparisonCars, setComparisonCars] = useState<ComparisonCar[]>([
    { car: cars[0], analysis: mockAnalysis },
    { car: cars[1], analysis: mockAnalysis },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const addCar = (car: Car) => {
    if (comparisonCars.length >= 4) return;
    if (comparisonCars.find((c) => c.car.id === car.id)) return;
    setComparisonCars([...comparisonCars, { car, analysis: mockAnalysis }]);
  };

  const removeCar = (id: string) => {
    setComparisonCars(comparisonCars.filter((c) => c.car.id !== id));
  };

  const filteredCars = cars.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.brand && c.brand.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="page compare-page">
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Ostueelne võrdlusanalüüs
          </p>
          <h1>Autode võrdlus</h1>
          <p>Vali kuni 4 autot, et võrrelda tehnilisi andmeid, tüüpvigu ja oodatavaid hoolduskulusid kõrvuti.</p>
        </div>

        {/* 4 Comparison Slots */}
        <div className="comparison-slots-grid">
          {comparisonCars.map((item) => (
            <div key={item.car.id} className="comparison-card">
              <button
                onClick={() => removeCar(item.car.id)}
                className="comparison-remove-btn"
                aria-label={`Eemalda ${item.car.title} võrdlusest`}
              >
                ✕
              </button>

              <div style={{ paddingRight: '2rem' }}>
                <span className="meta-chip" style={{ marginBottom: '0.4rem', display: 'inline-block' }}>
                  {item.car.year}
                </span>
                <h3 style={{ margin: '0.2rem 0', fontSize: '1.15rem' }}>{item.car.title}</h3>
              </div>

              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                {item.car.price.toLocaleString('et-EE')} €
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.5rem 0' }}>
                <div>Läbisõit: <strong>{item.car.mileage.toLocaleString('et-EE')} km</strong></div>
                <div>Kütus: <strong>{item.car.fuelType}</strong></div>
                <div>Käigukast: <strong>{item.car.transmission === 'automatic' ? 'Automaat' : 'Manuaal'}</strong></div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <span className={`status-pill ${item.car.mileage > 200000 ? 'warning' : 'success'}`}>
                  {item.car.mileage > 200000 ? 'Tähelepanu: Kõrge läbisõit' : 'Mõistlik läbisõit'}
                </span>
              </div>
            </div>
          ))}

          {/* Empty Placeholders */}
          {Array.from({ length: 4 - comparisonCars.length }).map((_, index) => (
            <div key={`empty-${index}`} className="empty-compare-slot">
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
                +
              </div>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>Tühi võrdluskoht</strong>
              <p style={{ margin: 0, fontSize: '0.8125rem' }}>Vali allpool olevast nimekirjast auto juurde.</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        {comparisonCars.length >= 2 && (
          <div style={{ textAlign: 'center', margin: '2rem 0 3rem' }}>
            <button
              className="button lg"
              onClick={() => navigate('/compare/results', { state: { cars: comparisonCars } })}
            >
              <span>Võrdle valitud {comparisonCars.length} autot</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        )}

        {/* Available Cars Selection Section */}
        <section className="report-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ margin: 0 }}>Lisa autosid võrdlusesse</h2>
              <p className="text-secondary" style={{ margin: '0.2rem 0 0' }}>
                Vali salvestatud autode või näidiste hulgast.
              </p>
            </div>

            <div style={{ maxWidth: '300px', width: '100%' }}>
              <input
                className="input sm"
                placeholder="Filtreeri marki või mudelit…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filteredCars.map((car) => {
              const isAlreadyAdded = comparisonCars.some((c) => c.car.id === car.id);
              return (
                <div
                  key={car.id}
                  style={{
                    background: 'var(--color-bg-dark)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>{car.title}</h4>
                    <div style={{ color: 'var(--color-primary)', fontWeight: 800, fontSize: '1.2rem' }}>
                      {car.price.toLocaleString('et-EE')} €
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '0.35rem' }}>
                      {car.year} · {car.mileage.toLocaleString('et-EE')} km · {car.fuelType}
                    </div>
                  </div>

                  <button
                    className={`button sm ${isAlreadyAdded ? 'secondary' : ''}`}
                    onClick={() => addCar(car)}
                    disabled={isAlreadyAdded || comparisonCars.length >= 4}
                  >
                    {isAlreadyAdded ? '✓ Lisatud võrdlusesse' : '+ Lisa võrdlusse'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Compare;