import { Link } from 'react-router-dom';

export default function CookiePolicyPage() {
  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Veebiküpsised
          </p>
          <h1>Küpsiste kasutamise poliitika</h1>
          <p>Kuidas ja miks AutoTark kasutab veebiküpsiseid.</p>
        </div>

        <div className="report-card">
          <h2>Mis on küpsised?</h2>
          <p>
            Küpsised on väikesed tekstifailid, mis salvestatakse sinu seadmesse veebilehe külastamisel. Need võimaldavad veebilehel meeles pidada sinu tegevusi ja eelistusi (nt salvestatud autod või keelevalik).
          </p>
        </div>

        <div className="report-card">
          <h2>Milliseid küpsiseid me kasutame?</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>1. Hädavajalikud küpsised</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Vajalikud lehe nõuetekohaseks toimimiseks ja turvalisuseks. Neid ei saa välja lülitada.
              </p>
            </div>

            <div style={{ padding: '1rem', background: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.05rem' }}>2. Funktsionaalsed seaded</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Võimaldavad meeles pidada sinu nõusolekueelistusi ja salvestatud sõidukeid.
              </p>
            </div>
          </div>
        </div>

        <div className="report-card">
          <h2>Kuidas küpsiseid hallata?</h2>
          <p>
            Saad igal ajal oma veebibrauseri seadetes küpsiseid blokeerida või kustutada. Lisainfot privaatsuse kohta leiad meie <Link to="/privaatsus">privaatsuspoliitikast</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
