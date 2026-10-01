import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cars as initialCars, type Car } from '../data/cars';

function SavedCars() {
  const navigate = useNavigate();
  const [savedCars, setSavedCars] = useState<Car[]>(initialCars.filter((c) => c.isSaved));
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'mileage'>('default');

  const removeCar = (id: string) => {
    setSavedCars(savedCars.filter((c) => c.id !== id));
  };

  const sortedCars = [...savedCars].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'mileage') return a.mileage - b.mileage;
    return 0;
  });

  return (
    <div className="page saved-cars-page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="eyebrow">
              <span className="pulse-dot"></span>
              Sinu isiklik garaaž
            </p>
            <h1>Salvestatud autod ({savedCars.length})</h1>
            <p>Jälgi ja võrdle huvipakkuvaid kuulutusi enne lõpliku ostuotsuse tegemist.</p>
          </div>

          {savedCars.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Sorteeri:</span>
              <button
                className={`sample-btn ${sortBy === 'default' ? 'active' : ''}`}
                onClick={() => setSortBy('default')}
              >
                Vaikimisi
              </button>
              <button
                className={`sample-btn ${sortBy === 'price-asc' ? 'active' : ''}`}
                onClick={() => setSortBy('price-asc')}
              >
                Odavamad
              </button>
              <button
                className={`sample-btn ${sortBy === 'mileage' ? 'active' : ''}`}
                onClick={() => setSortBy('mileage')}
              >
                Väikseim läbisõit
              </button>
            </div>
          )}
        </div>

        {savedCars.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <h2>Sul ei ole veel ühtegi autot salvestatud</h2>
            <p className="text-secondary" style={{ maxWidth: '420px', margin: '0 auto' }}>
              Kleebi Auto24 kuulutuse link või vali avalehel näidisauto, et salvestada see oma nimekirja.
            </p>
            <Link to="/" className="button">
              Kontrolli autot avalehel
            </Link>
          </div>
        ) : (
          <div className="saved-cars-grid">
            {sortedCars.map((car) => {
              const riskLevel = car.mileage > 200000 ? 'medium' : 'low';
              return (
                <div key={car.id} className="saved-card">
                  <div>
                    <div className="saved-card-header">
                      <div>
                        <span className="meta-chip" style={{ fontSize: '0.75rem', marginBottom: '0.4rem', display: 'inline-block' }}>
                          {car.year}
                        </span>
                        <h3>{car.title}</h3>
                      </div>
                      <button
                        onClick={() => removeCar(car.id)}
                        className="comparison-remove-btn"
                        style={{ position: 'static' }}
                        title="Eemalda lemmikutest"
                        aria-label="Eemalda lemmikutest"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="saved-card-price" style={{ margin: '0.5rem 0' }}>
                      {car.price.toLocaleString('et-EE')} €
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: '0.75rem 0' }}>
                      <div>Läbisõit: <strong>{car.mileage.toLocaleString('et-EE')} km</strong></div>
                      <div>Kütus & Mootor: <strong>{car.fuelType} · {car.engine}</strong></div>
                      <div>Käigukast: <strong>{car.transmission === 'automatic' ? 'Automaat' : 'Manuaal'}</strong></div>
                    </div>

                    <div>
                      <span className={`status-pill ${riskLevel}`}>
                        {riskLevel === 'low' ? '✓ Madal riskitase' : '⚠️ Tähelepanu: Kõrge läbisõit'}
                      </span>
                    </div>
                  </div>

                  <div className="saved-card-actions">
                    <Link to={`/report/${car.id}`} className="button">
                      Vaata analüüsi →
                    </Link>
                    <button
                      className="button secondary"
                      onClick={() => navigate('/compare')}
                      title="Võrdle teiste autodega"
                    >
                      Võrdle
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Card */}
            <div
              className="empty-compare-slot"
              style={{ minHeight: 'auto', padding: '2rem 1.5rem', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--color-bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', color: 'var(--color-text-muted)' }}>
                +
              </div>
              <strong style={{ fontSize: '1rem', color: 'var(--color-text)' }}>Kontrolli uut kuulutust</strong>
              <p style={{ margin: 0, fontSize: '0.8125rem' }}>Sisesta link ja lisa auto lemmikutesse.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedCars;