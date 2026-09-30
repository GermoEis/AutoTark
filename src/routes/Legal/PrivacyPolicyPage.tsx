export default function PrivacyPolicyPage() {
  return (
    <div className="page privacy-page">
      <div className="container">
        <h1 className="page-title">Privaatsuspoliitika</h1>

        <div className="content-section">
          <p className="intro-text">
            AutoTark on pühendunud teie privaatsuse kaitsele ja andmete turvalisuse tagamisele.
            See privaatsuspoliitika kirjeldab, kuidas me kogume, kasutame ja kaitseme teie isikuandmeid.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">1. Andmete kogumine</h2>
          <p>
            Kui kasutate AutoTark teenust, kogume järgmisi andmeid:
          </p>
          <ul className="info-list">
            <li>Kuulutuste URL-id ja nende sisu (auto kirjeldus, hind, pilt jms)</li>
            <li>Teie poolt salvestatud autoandmed (mudel, aasta, kilomeetriloendus jms)</li>
            <li>Teie sisestatud kontaktandmed (nimi, e-posti aadress), kui saadate meile sõnumi</li>
            <li>Küpsiste abil salvestatud eelistused ja seaded</li>
            <li>IP-aadress, brauseri teave ja kasutusandmed, et tagada teenuse töö</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">2. Andmete kasutamine</h2>
          <p>
            Me kasutame kogutud andmeid järgmiste eesmärkide saavutamiseks:
          </p>
          <ul className="info-list">
            <li>Teenuse töötagamiseks ja analüüsiks</li>
            <li>Teie poolt esitatud kuulutuste analüüsimiseks ja aruannete koostamiseks</li>
            <li>Kontaktihoolduseks, kui esitate taotluse või küsimuse</li>
            <li>Teie eelistuste järgimiseks (nt salvestatud autoandid)</li>
            <li>Meie teenuste arendamiseks ja parandamiseks</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">3. Andmete jagamine</h2>
          <p>
            Me ei jagata teie isikuandmeid kolmandate osapooltega, välja arvatud juhul, kui:
          </p>
          <ul className="info-list">
            <li>Te selle eelnevalt nõus olete</li>
            <li>See on vajalik teenuse pakumiseks (nt e-posti saatmiseks)</li>
            <li>See on ettenähtud seaduses või õigusaktides</li>
            <li>See on vajalik meie õiguste kaitseks</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">4. Andmete turvalisus</h2>
          <p>
            Kõigepealt peame tähtsuseks teie andmete turvalisust. Kõik andmed salvestatakse
            turvaliselt ja ligipääs neile on piiratud ainult volitatud isikutele.
            Me kasutame kvalifitseeritud turvameetmeid, et hoida teie andmed turvaliselt.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">5. Teie õigused</h2>
          <p>
            Teil on õigus:
          </p>
          <ul className="info-list">
            <li>Juurdepääsule oma isikuandmetele</li>
            <li>Nende andmete parandamisele, kui need on vigased</li>
            <li>Andmete kustutamisele, kui see on õiguslikult võimalik</li>
            <li>Andmete kasutamise piiramisele</li>
            <li>Andmete portability õigus (andmete edastamine teisele teenusepakkujale)</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">6. Küpsised</h2>
          <p>
            Me kasutame küpsiseid, et tagada meie veebilehe toimimine. Küpsised on väiksed failid,
            millele lehitsetakse teie arvutis. Enamik küpsiseid on vajalikudTeenuse tööks
            ja neid ei saa kustutada.
          </p>
          <p>
            Täpsemalt teave küpsiste kasutamise kohta leiate meie
            <a href="/kupsised">Küpsiste kasutamine</a> lehelt.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">7. Muudatused poliitikas</h2>
          <p>
            Me võime muuta seda privaatsuspoliitikat aja jooksul. Muudatused avaldatakse
            meie veebilehele ja need hakkavad kehtima kohe pärast avaldamist.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">8. Küsimused</h2>
          <p>
            Kui teil on küsimusi selle privaatsuspoliitikaga seoses, võtke meiega ühendust:
          </p>
          <p className="contact-email">
            {/* Email will be configured from config.ts when available */}
          </p>
        </div>
      </div>
    </div>
  );
}
