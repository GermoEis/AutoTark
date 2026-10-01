import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Andmekaitse
          </p>
          <h1>Privaatsuspoliitika</h1>
          <p>Kuidas AutoTark kaitseb ja töötleb sinu andmeid.</p>
        </div>

        <div className="report-card">
          <h2>1. Andmete töötlemise põhimõtted</h2>
          <p>
            AutoTark suhtub kasutajate privaatsusesse äärmiselt tõsiselt. Me ei müü ega jaga teie isikuandmeid kolmandatele osapooltele turunduslikel eesmärkidel.
          </p>
        </div>

        <div className="report-card">
          <h2>2. Milliseid andmeid me töötleme?</h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            <li>Teie poolt analüüsimiseks sisestatud kuulutuste lingid ja tehnilised andmed (VIN, mudel, aasta).</li>
            <li>Teie brauseris kohapeal salvestatud lemmikautode nimekiri (LocalStorage).</li>
            <li>Kontaktvormi kaudu saadetud nimi ja e-posti aadress vastamiseks.</li>
          </ul>
        </div>

        <div className="report-card">
          <h2>3. Küpsised ja kohalik salvestus</h2>
          <p>
            Kasutame veebilehe põhifunktsioonide tagamiseks vajalikke küpsiseid ja brauseri kohalikku mälu. Lisateabe saamiseks tutvu meie <Link to="/kupsised">küpsiste poliitikaga</Link>.
          </p>
        </div>

        <div className="report-card">
          <h2>4. Teie õigused</h2>
          <p>
            Teil on igal ajal õigus tutvuda enda andmetega, nõuda nende parandamist või kustutamist. Küsimuste korral võtke ühendust aadressil <Link to="/kontakt">info@autotark.ee</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
