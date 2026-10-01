import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createAnalysis, inspectAuto24 } from '../api';
import type { ListingSnapshot } from '../api';

const emptyListing: ListingSnapshot = {
  url: '',
  vin: '',
  make: '',
  model: '',
  year: null,
  mileageKm: null,
  priceEur: null,
};

const sampleCars: Array<ListingSnapshot & { label: string }> = [
  {
    label: 'BMW 530d xDrive',
    url: 'https://www.auto24.ee/soidukid/bmw-530d-xdrive-2018',
    make: 'BMW',
    model: '530d xDrive',
    year: 2018,
    mileageKm: 214000,
    priceEur: 17900,
    vin: 'WBAJC91010G123456',
    engine: '3.0 Diisel (195 kW)',
    transmission: 'Automaat',
  },
  {
    label: 'Audi A6 2.0 TDI',
    url: 'https://www.auto24.ee/soidukid/audi-a6-tdi-2017',
    make: 'Audi',
    model: 'A6 2.0 TDI Quattro',
    year: 2017,
    mileageKm: 198000,
    priceEur: 15900,
    vin: 'WAUZZZ4G1HN098765',
    engine: '2.0 Diisel (140 kW)',
    transmission: 'Automaat',
  },
  {
    label: 'Volvo V90 D5',
    url: 'https://www.auto24.ee/soidukid/volvo-v90-d5-2019',
    make: 'Volvo',
    model: 'V90 D5 AWD',
    year: 2019,
    mileageKm: 145000,
    priceEur: 18500,
    vin: 'YV1PZA8BDK1023456',
    engine: '2.0 Diisel (173 kW)',
    transmission: 'Automaat',
  },
];

function Home() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [listing, setListing] = useState<ListingSnapshot | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get('auto24_import');
    if (!raw) return;
    try {
      const imported = JSON.parse(raw) as ListingSnapshot;
      if (imported.url && imported.make && imported.model) {
        setListing({ ...emptyListing, ...imported });
        setUrl(imported.url);
        setMessage('Auto24 andmed imporditi edukalt sinu brauserist.');
        window.history.replaceState({}, '', '/');
      } else {
        setError('Auto24 lehelt ei leitud piisavalt sõiduki andmeid.');
      }
    } catch {
      setError('Auto24 impordi andmed olid vigased.');
    }
  }, []);

  const inspect = async () => {
    if (!url.trim()) {
      setError('Palun sisesta Auto24 kuulutuse link.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('Kontrollin kuulutuse linki…');
    try {
      const result = await inspectAuto24(url.trim());
      if (result.status === 'needs_manual') {
        setError('Auto24 blokeerib otsest serveripoolset lugemist. Kasuta AutoTark brauserilaiendit kuulutuse ühe klõpsuga importimiseks.');
        setListing(null);
      } else {
        setListing(result.vehicle);
        setMessage(result.message ?? 'Auto andmed leitud! Kontrolli VIN-koodi ja alusta analüüsi.');
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Kuulutust ei saanud lugeda. Kasuta Auto24 importi brauserilaiendiga.');
      setListing(null);
    } finally {
      setBusy(false);
    }
  };

  const handleSelectSample = (sample: ListingSnapshot) => {
    setUrl(sample.url);
    setListing(sample);
    setError('');
    setMessage(`Valisid näidisauto: ${sample.make} ${sample.model}. Saad kohe analüüsiga edasi minna!`);
  };

  const start = async () => {
    if (!listing?.make || !listing.model) return;
    const vin = (listing.vin ?? '').replace(/\s/g, '').toUpperCase();
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
      setError('Sisesta korrektne 17-kohaline VIN-kood. VIN-is ei kasutata tähti I, O ega Q.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const result = await createAnalysis({ ...listing, vin });
      navigate(`/analyze/${result.id}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Analüüsi ei saanud alustada. Kontrolli, kas Research API töötab.');
    } finally {
      setBusy(false);
    }
  };

  const cleanVin = (listing?.vin ?? '').replace(/\s/g, '').toUpperCase();
  const isVinValid = /^[A-HJ-NPR-Z0-9]{17}$/.test(cleanVin);

  return (
    <div className="page">
      <div className="container home-mvp">
        {/* Main Hero Section */}
        <section className="hero-mvp">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="pulse-dot"></span>
              AutoTark · Eesti nutikas autoostja abiline
            </div>

            <h1 className="hero-title">
              Kontrolli kasutatud autot <span className="highlight">enne ostu</span>.
            </h1>

            <p className="hero-lead">
              Tuvasta mudelipõhised tüüpvead, kontrolli VIN-koodi pildiotsingust ja näe oodatavaid remondikulusid. Kopeeri Auto24 link või kasuta mugavat laiendit.
            </p>

            {/* Search Input Card */}
            <div className="hero-search-card">
              <div className="hero-form">
                <div className="input-wrapper">
                  <span className="input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                  </span>
                  <input
                    className="input"
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inspect()}
                    placeholder="Kleebi Auto24 kuulutuse link siia…"
                    aria-label="Auto24 kuulutuse link"
                  />
                </div>
                <button className="button" onClick={inspect} disabled={busy}>
                  {busy ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                        <line x1="12" y1="2" x2="12" y2="6"></line>
                        <line x1="12" y1="18" x2="12" y2="22"></line>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      </svg>
                      Kontrollin…
                    </>
                  ) : (
                    <>
                      <span>Kontrolli kuulutust</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </>
                  )}
                </button>
              </div>

              {/* Sample Suggestions */}
              <div className="sample-suggestions">
                <span>💡 Proovi näidisautot:</span>
                {sampleCars.map((sample) => (
                  <button
                    key={sample.label}
                    type="button"
                    className="sample-btn"
                    onClick={() => handleSelectSample(sample)}
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="notification error" role="alert">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div>{error}</div>
              </div>
            )}

            {message && !error && (
              <div className="notification success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>{message}</div>
              </div>
            )}

            {/* 3 Step Workflow */}
            <div className="import-steps">
              <div className="step-item">
                <span className="step-number">1</span>
                <span className="step-text">Kopeeri link või kasuta laiendit</span>
              </div>
              <div className="step-item">
                <span className="step-number">2</span>
                <span className="step-text">Kontrolli VIN ja tehnilisi andmeid</span>
              </div>
              <div className="step-item">
                <span className="step-number">3</span>
                <span className="step-text">Saa detailne tüüpvigade raport</span>
              </div>
            </div>

            {/* Chrome / Edge Extension Card */}
            <div className="extension-card">
              <div className="extension-card-content">
                <h3>⚡ Kiirem viis: Auto24 brauserilaiendus</h3>
                <p>Laiendus loeb andmed otse kuulutuse lehelt ja saadab need ühe klõpsuga AutoTark raportisse.</p>
              </div>
              <a className="button sm" href="/auto24-import.html">
                Paigaldusjuhend
              </a>
            </div>
          </div>

          {/* Right Column: Live Dossier Preview */}
          <div className="hero-preview-wrapper">
            <div className="hero-preview-card">
              <div className="preview-header">
                <div>
                  <h3 className="preview-car-name">BMW 530d xDrive</h3>
                  <p className="preview-car-meta">2018 · 214 000 km · Diisel Automaat</p>
                </div>
                <div className="score-badge">
                  <span className="score-value">84/100</span>
                  <span className="score-label">Turvalisusindeks</span>
                </div>
              </div>

              <div className="preview-points">
                <div className="preview-point-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Läbisõit vastab auto kulumisastmele</span>
                </div>
                <div className="preview-point-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>Tüüpviga: B57 EGR jahuti ja jahutusvedeliku tase</span>
                </div>
                <div className="preview-point-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Varasemaid avariipilte veebiarhiivist ei leitud</span>
                </div>
              </div>

              <div className="preview-footer">
                <span className="preview-cost-estimate">
                  Eeldatavad kulud (12k): <strong>~400–800 €</strong>
                </span>
                <Link to="/" className="button sm secondary">
                  Alusta enda kontrolli →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Confirmation Card when listing is loaded */}
        {listing && (
          <section className="confirmation-card">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Kuulutuse andmed tuvastatud</p>
                <h2 style={{ margin: '0.4rem 0 0.2rem' }}>
                  {listing.make} {listing.model}
                </h2>
                <div className="vehicle-meta-badge-row">
                  {listing.year && <span className="meta-chip">Aasta: {listing.year}</span>}
                  {listing.mileageKm && <span className="meta-chip">Läbisõit: {listing.mileageKm.toLocaleString('et-EE')} km</span>}
                  {listing.priceEur && <span className="meta-chip" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Hind: {listing.priceEur.toLocaleString('et-EE')} €</span>}
                  {listing.engine && <span className="meta-chip">{listing.engine}</span>}
                  {listing.transmission && <span className="meta-chip">{listing.transmission}</span>}
                </div>
              </div>
              <span className={`status-pill ${isVinValid ? 'success' : 'warning'}`}>
                {isVinValid ? '✓ Valmis analüüsiks' : 'Vajab VIN-koodi'}
              </span>
            </div>

            <div className="vin-box">
              <label className="form-label" htmlFor="vin-input">
                <span>VIN-kood (17 märki) *</span>
                <span style={{ fontSize: '0.8rem', color: isVinValid ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                  {cleanVin.length}/17 tähemärki {isVinValid && '✓ Korrektne'}
                </span>
              </label>
              <input
                id="vin-input"
                className="input input-mono"
                style={{ fontSize: '1.1rem', letterSpacing: '0.12em' }}
                value={listing.vin ?? ''}
                onChange={(event) => setListing({ ...listing, vin: event.target.value.toUpperCase() })}
                placeholder="17 tähemärki (nt WBA...)"
                maxLength={17}
                autoComplete="off"
              />
              <p className="form-help">
                VIN-kood on vajalik varasemate oksjoni- ja avariipiltide otsinguks. Tähti I, O ja Q ei kasutata standardsetes VIN-koodides.
              </p>
            </div>

            <div className="form-actions">
              <button className="button lg" onClick={start} disabled={busy || !isVinValid}>
                {busy ? 'Alustan…' : 'Alusta tüüpvigade ja taustaanalüüsi'}
              </button>
              <button
                className="button secondary"
                onClick={() => {
                  setListing(null);
                  setMessage('');
                  setError('');
                }}
              >
                Tühista
              </button>
            </div>
          </section>
        )}

        {/* Feature Value Grid */}
        <section className="feature-section">
          <div className="section-header-center">
            <h2>Miks kontrollida autot enne tehingut?</h2>
            <p className="text-secondary">
              Kasutatud auto ostul peituvad suurimad riskid detailides, millest müüja sageli ei räägi või mida ise esmapilgul ei märka.
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3>Tüüpvead & mootorid</h3>
              <p>Kaardistame spetsiifilise mootori, käigukasti ja mudelipõlvkonna teadaolevad nõrgad kohad ja tehasetagastused.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <h3>VIN veebipildiotsing</h3>
              <p>Otsime auto VIN-koodi järgi varasemaid pilte välismaistelt oksjonitelt ja müügiportaalidest enne remonti.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3>Spikker müüjale</h3>
              <p>Saad kohapealseks ülevaatuseks ja proovisõiduks nimekirja täpsetest küsimustest, mida müüjalt küsida.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3>Kuluprognoos</h3>
              <p>Arvutame tõenäolised hooldus- ja kuluartiklid järgmise 6–24 kuu jooksul, et ostueelarve püsiks kontrolli all.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
