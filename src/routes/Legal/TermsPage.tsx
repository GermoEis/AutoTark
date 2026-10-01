import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Õiguslik teave
          </p>
          <h1>Kasutustingimused</h1>
          <p>Viimati uuendatud: jaanuar 2025</p>
        </div>

        <div className="report-card">
          <h2>1. Üldised põhimõtted</h2>
          <p>
            AutoTark on veebipõhine analüüsitööriist, mis aitab kasutatud auto ostjatel analüüsida kuulutuste andmeid, kaardistada mudelite tüüpvigu ning saada ostueelseid soovitusi.
          </p>
        </div>

        <div className="report-card">
          <h2>2. Teenuse kasutamine</h2>
          <p>Teenust kasutades nõustute järgnevaga:</p>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            <li>Kasutate teenust üksnes isiklikuks ja seaduslikuks otstarbeks.</li>
            <li>Te ei kuritarvita teenust ega kasuta automaatseid skripte teenuse töö häirimiseks.</li>
            <li>Te sisestate kontrolliks korrektseid avalike kuulutuste linke ja kehtivaid VIN-koode.</li>
          </ul>
        </div>

        <div className="report-card">
          <h2>3. Vastutuse piirang</h2>
          <p>
            AutoTark koondab avalikest allikatest pärinevat teavet. Me ei garanteeri auto täielikku vigadeta seisukorda ega asenda professionaalset autotehniku kohapealset ülevaatust. Lõpliku ostuotsuse ja sellega seotud riskide eest vastutab ostja.
          </p>
        </div>

        <div className="report-card">
          <h2>4. Kontakt ja küsimused</h2>
          <p>
            Küsimuste korral tutvu meie <Link to="/meist">tutvustusega</Link> või kirjuta meile <Link to="/kontakt">kontaktilehe</Link> kaudu.
          </p>
        </div>
      </div>
    </div>
  );
}
