import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function CompareResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { cars: any[] } | null;
  const cars = state?.cars ?? [];
  const [activeTab, setActiveTab] = useState<'general' | 'inspection' | 'maintenance'>('general');

  if (!cars || cars.length === 0) {
    return (
      <div className="page compare-results-page">
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h2>Võrdlusandmed puuduvad</h2>
            <p className="text-secondary">Võrdluse nägemiseks vali esmalt vähemalt kaks autot.</p>
            <Link to="/compare" className="button">
              Mine võrdluslehele
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Find winners for badges
  const lowestPrice = Math.min(...cars.map((c) => c.car.price));
  const lowestMileage = Math.min(...cars.map((c) => c.car.mileage));
  const newestYear = Math.max(...cars.map((c) => c.car.year));

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'Madal';
      case 'medium':
        return 'Keskmine';
      case 'high':
        return 'Kõrge';
      default:
        return 'Teadmata';
    }
  };

  return (
    <div className="page compare-results-page">
      <div className="container" style={{ padding: '2rem 1rem 5rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <p className="eyebrow">
              <span className="pulse-dot"></span>
              Põhjalik võrdlusmaatriks
            </p>
            <h1 style={{ margin: '0.25rem 0' }}>Autode võrdlus ({cars.length} sõidukit)</h1>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="button secondary" onClick={() => navigate('/compare')}>
              Muuda valikut
            </button>
            <button className="button" onClick={() => window.print()}>
              Prindi võrdlus
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="compare-tabs">
          <button
            className={`compare-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            Üldandmed & Parameetrid
          </button>
          <button
            className={`compare-tab-btn ${activeTab === 'inspection' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspection')}
          >
            Tüüpvigade analüüs
          </button>
          <button
            className={`compare-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            Hoolduskulude võrdlus
          </button>
        </div>

        {/* Tab 1: General Specs */}
        {activeTab === 'general' && (
          <div className="compare-matrix-card">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ width: '180px', padding: '1rem', background: 'var(--color-bg-dark)', color: 'var(--color-text-muted)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>
                    Parameeter
                  </th>
                  {cars.map((c, i) => (
                    <th key={i} style={{ padding: '1rem', background: 'var(--color-bg-dark)', textAlign: 'left' }}>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text)' }}>
                        {c.car.title}
                      </div>
                      <div style={{ color: 'var(--color-primary)', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
                        {c.car.price.toLocaleString('et-EE')} €
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Hind</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <strong>{c.car.price.toLocaleString('et-EE')} €</strong>
                      {c.car.price === lowestPrice && (
                        <span className="status-pill success" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                          ✓ Parim hind
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Väljalaskeaasta</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <strong>{c.car.year}</strong>
                      {c.car.year === newestYear && (
                        <span className="status-pill" style={{ marginLeft: '0.5rem', fontSize: '0.75rem', background: 'var(--color-info-bg)', color: 'var(--color-info-text)' }}>
                          ✓ Uusim
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Läbisõit</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      <strong>{c.car.mileage.toLocaleString('et-EE')} km</strong>
                      {c.car.mileage === lowestMileage && (
                        <span className="status-pill success" style={{ marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                          ✓ Väikseim läbisõit
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Kütuse tüüp</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      {c.car.fuelType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Käigukast</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                      {c.car.transmission === 'automatic' ? 'Automaat' : 'Manuaal'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>Riskitase</td>
                  {cars.map((c, i) => {
                    const risk = c.car.mileage > 200000 ? 'medium' : 'low';
                    return (
                      <td key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                        <span className={`status-pill ${risk}`}>
                          {getRiskText(risk)} risk
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>Täisraport</td>
                  {cars.map((c, i) => (
                    <td key={i} style={{ padding: '1rem' }}>
                      <Link to={`/report/${c.car.id}`} className="button sm">
                        Ava täisraport →
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Inspection & Pros/Cons */}
        {activeTab === 'inspection' && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cars.length}, 1fr)`, gap: '1.5rem' }}>
            {cars.map((item, index) => (
              <div key={index} className="report-card">
                <h3 style={{ margin: '0 0 0.5rem' }}>{item.car.title}</h3>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                  {item.car.price.toLocaleString('et-EE')} €
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <h4 style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>✓</span> Plussid
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {item.analysis.summary.pros.map((pro: string, pIdx: number) => (
                      <li key={pIdx}>{pro}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>⚠️</span> Miinused ja kontrollpunktid
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {item.analysis.summary.cons.map((con: string, cIdx: number) => (
                      <li key={cIdx}>{con}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Maintenance Costs */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cars.length}, 1fr)`, gap: '1.5rem' }}>
            {cars.map((item, index) => (
              <div key={index} className="report-card">
                <h3 style={{ margin: '0 0 0.25rem' }}>{item.car.title}</h3>
                <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                  Prognoositavad hoolduskulud:
                </p>

                {item.analysis.upcomingMaintenance.map((task: any, mIdx: number) => (
                  <div key={mIdx} className={`maintenance-card ${task.urgency}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem' }}>
                      <span>{task.category}</span>
                      <span style={{ color: 'var(--color-primary)' }}>~{task.estimatedCost} €</span>
                    </div>
                    <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      {task.tasks.map((t: string, tIdx: number) => (
                        <li key={tIdx}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CompareResults;
