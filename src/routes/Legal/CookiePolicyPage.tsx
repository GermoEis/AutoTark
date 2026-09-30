export default function CookiePolicyPage() {
  return (
    <div className="page cookie-page">
      <div className="container">
        <h1 className="page-title">Küpsiste kasutamine</h1>

        <div className="content-section">
          <p className="intro-text">
            Kui kasutate AutoTark veebilehte, kasutame küpsiseid, et tagada lehe parem
            kasutajaliides ja täiustada teie kogemust. See leht kirjeldab, milliseid
            küpsiseid me kasutame ja milleks.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Mis on küpsised?</h2>
          <p>
            Küpsised on väiksed tekstifailid, millele loetakse teie arvutist või seadmest.
            Need aitavad meil määrata teie eelistused ja tagada, et veebileht toimiks
            nii, nagu te eeldate.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Milliseid küpsiseid me kasutame?</h2>
          <p>
            Me kasutame järgmisi küpsise tüüpe:
          </p>

          <h3 className="subsection-heading">1. Vajalikud küpsised</h3>
          <p>
            Need küpsised on vajalikud Teenuse tööks. Ilma neil ei saa me teie
            päringuid täita. Neid ei saa teie seadmest kustutada.
          </p>

          <h3 className="subsection-heading">2. Funktsionaalsed küpsised</h3>
          <p>
            Need küpsised võimaldavad meil määrata teie eelistused ja tagada, et
            Teenus toimiks nii, nagu te ootate. Näiteks meeles peame, et olete
            salvestanud autoandid või valisinud keele.
          </p>

          <h3 className="subsection-heading">3. Analüütilised küpsised</h3>
          <p>
            Need küpsised aitavad meil mõista, kuidas kasutajad Teenust kasutavad.
            See aitab meil lehte täiustada ja paremini vastata teie vajadustele.
            Analüütilised küpsised koguvad anonüümset teavet.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Kuidas saate küpsiseid hallata?</h2>
          <p>
            Saate oma brauseri seadistustes muuta küpsiste kasutamist. Kui keelate
            küpsiste kasutamise, võib Teenus mitte töötada korralikult.
          </p>
          <p>
            Kui lülitate analüütilised küpsised välja, ei koguta teie kohta
            analüütilist teavet, kuid mõned funktsioonid võivad olla piiratud.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Küpsiste eemaldamine</h2>
          <p>
            Saate kustutada küpsised oma brauserist. Kuid selle tulemusena võib
            Teenus mitte töötada nii, nagu te eeldate.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Muudatused küpsiste poliitikas</h2>
          <p>
            Me võime muuta seda küpsiste poliitikat aja jooksul. Muudatused
            avaldatakse meie veebilehele ja Need hakkavad kehtima kohe pärast
            avaldamist.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Küsimused</h2>
          <p>
            Kui teil on küsimusi küpsiste kasutamise kohta, võtke meiega ühendust:
          </p>
          <p className="contact-email">
            {/* Email will be configured from config.ts when available */}
          </p>
        </div>
      </div>
    </div>
  );
}
