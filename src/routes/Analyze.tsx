import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAnalysis } from '../api';

const tips = [
  'Nipp: Ära kunagi vaata autot vihmasajus või hämaras – vihmapiisad ja kehv valgus peidavad kriime, mõlke ja värvierinevusi.',
  'Nipp: Tee külmkäivitus alati ise. Palu müüjal autot enne sinu saabumist mitte soojaks sõita, et kuulata ebatavalisi keti- või klapihääli.',
  'Nipp: Kontrolli kõigi turvavööde tootmisaastaid – kui need erinevad auto tootmisaastast, võib see viidata varasemale avariile.',
  'Nipp: Küsi alati kahe võtme olemasolu – kaasaegse puldiga võtme asendamine ja programmeerimine võib maksta 200–500 €.',
];

function Analyze() {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(10);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Tip rotation
  useEffect(() => {
    const tipInterval = window.setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => window.clearInterval(tipInterval);
  }, []);

  useEffect(() => {
    if (!listingId) return;
    let stopped = false;
    let timer: number | undefined;
    let connectionRetries = 0;

    const poll = async () => {
      try {
        const analysis = await getAnalysis(listingId);
        if (stopped) return;
        connectionRetries = 0;
        setProgress(analysis.status === 'researching' ? 55 : analysis.status === 'needs_review' ? 90 : analysis.status === 'failed' ? 100 : 100);
        if (analysis.status === 'completed' || analysis.status === 'needs_review' || analysis.status === 'failed') {
          setProgress(100);
          setTimeout(() => {
            navigate(`/report/${listingId}`, { replace: true });
          }, 400);
          return;
        }
        timer = window.setTimeout(poll, 2500);
      } catch (reason) {
        if (!stopped) {
          setError(reason instanceof Error ? reason.message : 'Analüüsi serveriga ei saanud ühendust.');
          connectionRetries += 1;
          if (connectionRetries < 4) timer = window.setTimeout(poll, 6000);
        }
      }
    };

    void poll();

    return () => {
      stopped = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [listingId, navigate]);

  return (
    <div className="page scanner-page">
      <div className="container">
        <div className="scanner-card">
          {/* Animated Radar Pulse */}
          <div className="scanner-radar-wrap">
            <div className="radar-circle"></div>
            <div className="radar-circle"></div>
            <div className="radar-icon-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
          </div>

          <p className="eyebrow" style={{ margin: '0 auto' }}>
            <span className="pulse-dot"></span>
            Diagnostiline skaneerimine käib
          </p>

          <h1 style={{ fontSize: '1.85rem', margin: '0.8rem 0 0.4rem' }}>Koostan sõiduki raportit…</h1>
          <p className="text-secondary" style={{ maxWidth: '480px', margin: '0 auto' }}>
            Analüüsime mudeli, mootori ja käigukasti tüüpvigu, kontrollime VIN-koodi andmebaase ja genereerime ostueelse kontroll-lehe.
          </p>

          {/* Progress Bar */}
          <div className="scanner-progress-bar">
            <div
              className="scanner-progress-bar-fill"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>

          {/* Steps List */}
          <div className="scanner-steps-list">
            <div className="scanner-step-row">
              <span className="step-indicator done">✓</span>
              <span>Kuulutuse parsimine ja tehniliste parameetrite kontroll</span>
            </div>
            <div className="scanner-step-row">
              <span className={`step-indicator ${progress > 40 ? 'done' : 'active'}`}>
                {progress > 40 ? '✓' : '2'}
              </span>
              <span>VIN-koodi valideerimine ja pildiotsingu päringud</span>
            </div>
            <div className="scanner-step-row">
              <span className={`step-indicator ${progress > 70 ? 'done' : progress > 40 ? 'active' : 'pending'}`}>
                {progress > 70 ? '✓' : '3'}
              </span>
              <span>Mudeli tüüpvigade ja foorumite andmebaasi analüüs</span>
            </div>
            <div className="scanner-step-row">
              <span className={`step-indicator ${progress >= 95 ? 'done' : progress > 70 ? 'active' : 'pending'}`}>
                {progress >= 95 ? '✓' : '4'}
              </span>
              <span>Remondikulude kalkulatsioon ja müüjaspikker</span>
            </div>
          </div>

          {/* Buyer Tip Box */}
          <div className="scanner-tip">
            <strong>💡 Autoostja teadmistepagas:</strong>
            <p style={{ margin: '0.25rem 0 0' }}>{tips[currentTipIndex]}</p>
          </div>

          {error && (
            <div className="notification warning" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <div>
                <strong>Teade serverist:</strong> {error}
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/report/${listingId}`} className="button sm">
                    Vaata raportit otse
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analyze;
