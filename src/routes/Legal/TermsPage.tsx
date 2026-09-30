import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="page terms-page">
      <div className="container">
        <h1 className="page-title">Kasutustingimused</h1>

        <div className="content-section">
          <p className="intro-text">
            Käesolevad kasutustingimused kirjeldavad teie õigusi kui kasutajale
            ja teid huvitavate tingimuste kohta, mis kehtivad AutoTark veebilehe
            ja teenuse kasutamise kohta.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">1. Üldine kirjeldus</h2>
          <p>
            AutoTark on veebipõhine tööriist, mis aitab auto ostjatel analüüsida
            kuulutusi ja teha informatsioonipõhiseid otsuseid. Teenus põhineb
            külgutuste andmetel, mille kogume teie esitatud lingidest.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">2. Teenuse kasutamine</h2>
          <p>
            Kasutades AutoTark teenust nõustute järgmiste tingimustega:
          </p>
          <ul className="info-list">
            <li>Teenuse kasutate ainult seaduslikel eesmärkidel</li>
            <li>Te ei katasta teenust kolmandatele osapooltele</li>
            <li>Te ei kasuta automaatseid sisteeme, mis võiksid häirata teenuse tööd</li>
            <li>Te edastate ainult korrektsed ja täielikud andmed</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">3. Andmete kaitse</h2>
          <p>
            Täielikud andmete käsitlemise tingimused leiate meie
            <Link to="/privaatsus">privaatsuspoliitikast</Link>. Kasutades teenust,
            nõustute andmete käsitlemise tingimustega.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">4. Auto kuulutuste analüüs</h2>
          <p>
            AutoTark ei garantieri analüüsi täpsust. Analüüs põhineb ainult
            kuulutuses esitatud teatel ja ei välista võimalikke vigu. Te olete
            vastutavad oma otsuste eest.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">5. Vastutus</h2>
          <p>
            AutoTark ei vastuta kahjude eest, mis võivad olla seotud teenuse
            kasutamise või võimatuks jäämisega. Teenust pakutakse "nagu on"
            põhimõttel.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">6. Üldased sätted</h2>
          <p>
            Me võime muuta neid tingimusi aja jooksul. Muudatused avaldatakse
            veebilehel ja neid kasutatakse alates muudatuse kuupäevast.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">7. Küsimused</h2>
          <p>
            Kui teil on küsimusi kasutustingimustega seoses, võtke meiega ühendust:
          </p>
          <p className="contact-email">
            {/* Email will be configured from config.ts when available */}
          </p>
        </div>
      </div>
    </div>
  );
}
