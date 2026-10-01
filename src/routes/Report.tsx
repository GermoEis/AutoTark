import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getAnalysis, getVinImages, saveCar, deleteSavedCar, getSavedCars } from '../api';
import type { Analysis, Claim, VinImageResult } from '../api';

const evidenceLabels: Record<string, string> = {
  anecdotal: 'Esmane viide – kontrolli',
  recurring_report: 'Korduv kasutajateade',
  confirmed: 'Kinnitatud tüüpviga',
  well_supported: 'Hästi toetatud allikatega',
  positive: 'Hea näitaja',
  neutral: 'Informatiivne',
  warning: 'Kõrge tähelepanu',
  attention: 'Kontrolli eraldi',
};

const formatNumber = (value: number | null | undefined, suffix = '') =>
  value == null ? '—' : `${value.toLocaleString('et-EE')}${suffix}`;

const formatCost = (claim: Claim) =>
  claim.cost_min_eur == null && claim.cost_max_eur == null
    ? 'Täpsustamata'
    : `${claim.cost_min_eur ?? '—'}–${claim.cost_max_eur ?? '—'} €`;

const defaultChecklist = [
  'Tee külmkäivitus täiesti külma mootoriga ja kuula ketihääli esimese 5 sekundi jooksul.',
  'Kontrolli kerepaneelide vahesid ja värvipinna lakikihi paksust.',
  'Veendu, et mõlemad originaalvõtmed on olemas ja töötavad.',
  'Kontrolli käigukasti sujuvust: lülita paigal olles R -> D ning tee kiirendus ja pidurdus.',
  'Kontrolli kliimaseadme toimimist nii maksimaalsel külmal kui soojal režiimil.',
  'Küsi viimase 2–3 aasta hooldus- ja remondiarvete paberkandjal väljavõtet.',
];

const defaultQuestions = [
  'Millal viimati vahetati automaatkäigukasti- ja diferentsiaaliõli?',
  'Kas mootoril on teostatud EGR jahuti ametlik tagasikutsumine?',
  'Kas autol on olnud varasemaid liiklus- või kaskokahjusid?',
  'Millal on viimati vahetatud pidurikettad ja -klotsid?',
  'Kas heitgaasisüsteem (DPF, katalüsaator, AdBlue) on originaal ja täiesti töökorras?',
];

function Report() {
  const { carId } = useParams<{ carId: string }>();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [images, setImages] = useState<VinImageResult[]>([]);
  const [googleSearchUrl, setGoogleSearchUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'checklist' | 'questions'>('all');
  const [copiedVin, setCopiedVin] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  useEffect(() => {
    if (!carId) return;

    getAnalysis(carId)
      .then((data) => {
        setAnalysis(data);
        getSavedCars().then((saved) => setIsSaved(saved.some((car) => car.url === data.url))).catch(() => undefined);
      })
      .catch((reason) => {
        setError(reason instanceof Error ? reason.message : 'Raportit ei õnnestunud laadida. Kontrolli, kas Research API töötab.');
      });

    getVinImages(carId)
      .then((result) => {
        setImages(result.images);
        setGoogleSearchUrl(result.googleSearchUrl);
      })
      .catch(() => setImages([]));
  }, [carId]);

  const copyVinToClipboard = (vin: string) => {
    navigator.clipboard.writeText(vin);
    setCopiedVin(true);
    setTimeout(() => setCopiedVin(false), 2000);
  };

  const toggleSaved = async () => {
    if (!analysis || saveBusy) return;
    setSaveBusy(true);
    try {
      if (isSaved) {
        const saved = await getSavedCars();
        const current = saved.find((car) => car.url === analysis.url);
        if (current) await deleteSavedCar(current.id);
        setIsSaved(false);
      } else {
        await saveCar(analysis, analysis.id);
        setIsSaved(true);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Auto salvestamine ebaõnnestus.');
    } finally { setSaveBusy(false); }
  };

  if (error) {
    return (
      <main className="page">
        <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
          <div className="notification error">{error}</div>
          <Link className="button secondary" to="/">
            Tagasi avalehele
          </Link>
        </div>
      </main>
    );
  }

  if (!analysis) {
    return (
      <main className="page">
        <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <div className="scanner-radar-wrap">
            <div className="radar-circle"></div>
            <div className="radar-icon-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          <h2>Laadin auto raportit…</h2>
          <p className="text-secondary">Palun oota, kogun andmeid ja vormistan aruannet.</p>
        </div>
      </main>
    );
  }

  const claims = (analysis.claims ?? []).filter(
    (claim) =>
      !(
        analysis.year &&
        analysis.year < 2024 &&
        claim.sources?.some((source) => /2024\+|2025|2026|s650/i.test(`${source.title ?? ''} ${source.url}`))
      )
  );

  const confirmedCount = claims.filter(
    (c) => c.evidence_level === 'confirmed' || c.evidence_level === 'well_supported'
  ).length;

  const filteredClaims =
    activeTab === 'critical'
      ? claims.filter((c) => c.evidence_level === 'confirmed' || c.evidence_level === 'well_supported')
      : claims;

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const checklistProgress = Math.round((checkedCount / defaultChecklist.length) * 100);

  // Calculate reliability score (100 minus weighted risks)
  const reliabilityScore = Math.max(50, Math.min(94, 92 - confirmedCount * 7));
  const riskLevel = reliabilityScore >= 80 ? 'low' : reliabilityScore >= 65 ? 'medium' : 'high';
  const riskLabel = riskLevel === 'low' ? 'Madal risk' : riskLevel === 'medium' ? 'Keskmine risk' : 'Kõrge risk';

  return (
    <div className="page report-page">
      <div className="container">
        {/* Top Header Banner */}
        <section className="report-header-banner">
          <div className="report-top-actions">
            <div className="report-title-group">
              <p className="eyebrow">
                <span className="pulse-dot"></span>
                AutoTark Põhjalik Raport
              </p>
              <h1>
                {analysis.make} {analysis.model}
                {analysis.variant ? ` · ${analysis.variant}` : ''}
              </h1>
              <p className="text-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span>Allikas: <a href={analysis.url} target="_blank" rel="noreferrer">Auto24 kuulutus ↗</a></span>
                {analysis.vin && (
                  <span>
                    VIN: <strong style={{ fontFamily: 'var(--font-mono)' }}>{analysis.vin}</strong>
                    <button
                      onClick={() => copyVinToClipboard(analysis.vin!)}
                      style={{ marginLeft: '0.35rem', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: 600 }}
                    >
                      {copiedVin ? '✓ Kopeeritud' : 'Kopeeri'}
                    </button>
                  </span>
                )}
              </p>
            </div>

            <div className="report-header-btns">
              <button
                className="button secondary"
                onClick={() => void toggleSaved()}
                disabled={saveBusy}
                title={isSaved ? 'Eemalda lemmikutest' : 'Salvesta lemmikuks'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? '#e11d48' : 'none'} stroke={isSaved ? '#e11d48' : 'currentColor'} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>{isSaved ? 'Salvestatud' : 'Salvesta'}</span>
              </button>

              <button
                className="button secondary"
                onClick={() => navigate('/compare')}
                title="Võrdle teiste autodega"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
                <span>Võrdle</span>
              </button>

              <button className="button" onClick={() => window.print()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 6 2 18 2 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                  <rect x="6" y="14" width="12" height="8"></rect>
                </svg>
                <span>Prindi / PDF</span>
              </button>
            </div>
          </div>

          {/* Vehicle Specs Grid */}
          <div className="vehicle-summary-grid">
            <div className="summary-cell">
              <span className="label">Väljalaskeaasta</span>
              <span className="value">{formatNumber(analysis.year)}</span>
            </div>
            <div className="summary-cell">
              <span className="label">Läbisõit</span>
              <span className="value">{formatNumber(analysis.mileageKm, ' km')}</span>
            </div>
            <div className="summary-cell">
              <span className="label">Kuulutuse hind</span>
              <span className="value price">{formatNumber(analysis.priceEur, ' €')}</span>
            </div>
            <div className="summary-cell">
              <span className="label">Mootor</span>
              <span className="value" style={{ fontSize: '1.05rem' }}>{analysis.engine ?? 'Diisel'}</span>
            </div>
            <div className="summary-cell">
              <span className="label">Käigukast</span>
              <span className="value" style={{ fontSize: '1.05rem' }}>{analysis.transmission ?? 'Automaat'}</span>
            </div>
          </div>
        </section>

        {/* Main Grid: Content + Sidebar */}
        <div className="report-grid">
          <div>
            {/* Risk Gauge Card */}
            <div className="risk-gauge-card">
              <div className={`gauge-circle ${riskLevel}`}>
                <span className="gauge-score">{reliabilityScore}</span>
                <span className="gauge-caption">PUNKTISI</span>
              </div>
              <div className="gauge-details">
                <h3>
                  Üldine riskihinnang: <span className={`text-${riskLevel === 'low' ? 'success' : riskLevel === 'medium' ? 'warning' : 'danger'}`}>{riskLabel}</span>
                </h3>
                <p>
                  Tuvastatud {claims.length} tüüpilist kontrollpunkti, millest {confirmedCount} on kõrgema tõenäosusega või ametlikult kinnitatud tagasikutsumised.
                </p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="compare-tabs">
              <button
                className={`compare-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                Kõik kontrollpunktid ({claims.length})
              </button>
              <button
                className={`compare-tab-btn ${activeTab === 'critical' ? 'active' : ''}`}
                onClick={() => setActiveTab('critical')}
              >
                Kriitilised vead ({confirmedCount})
              </button>
              <button
                className={`compare-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
                onClick={() => setActiveTab('checklist')}
              >
                Ostueelne leht ({checkedCount}/{defaultChecklist.length})
              </button>
              <button
                className={`compare-tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
                onClick={() => setActiveTab('questions')}
              >
                Küsimused müüjale
              </button>
            </div>

            {/* Claims / Inspection Points */}
            {(activeTab === 'all' || activeTab === 'critical') && (
              <section className="report-card">
                <h2>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  <span>Tüüpilised vead ja spetsiifilised kontrollkohad</span>
                </h2>
                <p className="text-secondary">
                  Alljärgnevad punktid põhinevad selle mootori ja keremudeli teadaolevatel tehasevigadel ja omanike foorumiandmetel.
                </p>

                <div className="claim-list">
                  {filteredClaims.map((claim) => (
                    <article className="claim-card" key={claim.id}>
                      <div className="claim-header">
                        <div>
                          <h3>{claim.issue}</h3>
                          <div className="claim-component-tag">Süsteem: {claim.component}</div>
                        </div>
                        <span className={`evidence-badge ${claim.evidence_level}`}>
                          <span className={`risk-dot ${claim.evidence_level}`}></span>
                          {evidenceLabels[claim.evidence_level] ?? claim.evidence_level}
                        </span>
                      </div>

                      <div className="claim-body">
                        {claim.symptoms.length > 0 && (
                          <p>
                            <strong>Kuidas ära tunda (sümptomid):</strong>{' '}
                            {claim.symptoms.join('; ')}.
                          </p>
                        )}
                        <p>
                          <strong>Mida teha kohapeal:</strong>{' '}
                          {claim.repair ?? 'Lase sõiduk spetsialistil ja diagnostikaseadmega üle kontrollida.'}
                        </p>
                      </div>

                      <div className="claim-meta-row">
                        <span className="claim-cost-pill">
                          Eeldatav kulu: {formatCost(claim)}
                        </span>
                        <span className="claim-meta-item">
                          Kindlusaste: <strong>{Math.round(claim.confidence * 100)}%</strong>
                        </span>
                        <span className="claim-meta-item">
                          Allikate arv: <strong>{claim.source_count}</strong>
                        </span>
                      </div>

                      {claim.sources?.length > 0 && (
                        <div className="claim-sources">
                          {claim.sources.map((src, i) => (
                            <a key={i} href={src.url} target="_blank" rel="noreferrer">
                              <span>🔗 {src.title || src.url}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Checklist Tab */}
            {activeTab === 'checklist' && (
              <section className="report-card">
                <h2>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"></polyline>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  <span>Ostueelne kontroll-leht auto juures</span>
                </h2>
                <p className="text-secondary">
                  Märgi punktid, mida oled auto ülevaatusel ja proovisõidul isiklikult kontrollinud.
                </p>

                <div className="checklist-progress">
                  <span>Kontrollitud {checkedCount} / {defaultChecklist.length}</span>
                  <span>{checklistProgress}% valmis</span>
                </div>
                <div className="checklist-bar">
                  <div className="checklist-bar-fill" style={{ width: `${checklistProgress}%` }}></div>
                </div>

                <div className="checklist">
                  {defaultChecklist.map((item, index) => (
                    <label key={index} className={`checklist-item ${checked[index] ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={!!checked[index]}
                        onChange={() => setChecked((prev) => ({ ...prev, [index]: !prev[index] }))}
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {/* Questions Tab */}
            {activeTab === 'questions' && (
              <section className="report-card">
                <h2>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Mida müüjalt kindlasti küsida</span>
                </h2>
                <p className="text-secondary">
                  Need spetsiifilised küsimused aitavad välja selgitada tegelikku hooldusajalugu ja välistada ootamatuid lisakulusid.
                </p>

                <div className="seller-questions-list">
                  {defaultQuestions.map((q, idx) => (
                    <div key={idx} className="seller-question-card">
                      <p className="question-text">{q}</p>
                      <button
                        className="button sm secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(q);
                          alert('Küsimus kopeeritud lõikelauale!');
                        }}
                      >
                        Kopeeri
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VIN Photos Section */}
            <section className="report-card">
              <h2>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>VIN-põhine veebipildiotsing</span>
              </h2>
              <p className="text-secondary">
                Otsime avalikest oksjoni- ja müügiarhiividest pilte, et tuvastada varasemat remonti või avariikahjusid enne Eestisse registreerimist.
              </p>

              {images.length > 0 ? (
                <div className="vin-image-grid">
                  {images.map((image, idx) => (
                    <a
                      className="vin-image-card"
                      key={idx}
                      href={image.searchUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img src={image.url} alt={image.title} loading="lazy" />
                      <span>{image.title}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1.25rem', background: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Sellele VIN-koodile ei leitud otseseid avalikke avariipilte rahvusvahelistest oksjoniarhiividest.
                  </p>
                </div>
              )}

              {googleSearchUrl && (
                <a className="button secondary" href={googleSearchUrl} target="_blank" rel="noreferrer">
                  Ava Google Images VIN-otsing ↗
                </a>
              )}
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="report-sidebar">
            {/* Quick Actions & Background Check */}
            <div className="report-card">
              <h3 style={{ margin: '0 0 0.5rem' }}>Ametlik taustakontroll</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                Kontrolli Eesti ametlikest registritest kindlustusjuhtumeid ja tehnoülevaatuste ajalugu:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                <a
                  className="button sm secondary"
                  href="https://www.lkf.ee/et/kahjukontroll"
                  target="_blank"
                  rel="noreferrer"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>LKF Liikluskahjude kontroll</span>
                  <span>↗</span>
                </a>
                <a
                  className="button sm secondary"
                  href="https://eteenindus.mnt.ee/public/soidukTaustakontroll.jsf"
                  target="_blank"
                  rel="noreferrer"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>Transpordiameti taust</span>
                  <span>↗</span>
                </a>
              </div>
            </div>

            {/* Maintenance Estimate Box */}
            <div className="report-card">
              <h3 style={{ margin: '0 0 0.5rem' }}>Eeldatavad hooldused</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                Soovituslikud tööd järgmise 12 kuu jooksul:
              </p>

              <div className="maintenance-card urgent">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>Esmased filtrid ja vedelikud</span>
                  <span style={{ color: 'var(--color-primary)' }}>~250–400 €</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Mootoriõli, kütusefilter, salongifiltrid, pidurivedelik.
                </p>
              </div>

              <div className="maintenance-card medium">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                  <span>Käigukasti dünaamiline õlivahetus</span>
                  <span style={{ color: 'var(--color-warning)' }}>~350–550 €</span>
                </div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                  Soovitatav iga 80 000 – 100 000 km tagant.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="report-card" style={{ background: 'var(--color-primary-surface)', borderColor: 'var(--color-primary-light)' }}>
              <h4 style={{ margin: '0 0 0.35rem', color: 'var(--color-primary)' }}>⚠️ Oluline meelespea</h4>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                AutoTark raport koondab avalikke tehnilisi andmeid ja teadaolevaid mudelipõhiseid tüüpvigu. Enne ostu teostamist soovitame alati teha professionaalse ostueelse tehnilise ülevaatuse autoteeninduses.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Report;

