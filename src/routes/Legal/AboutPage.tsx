import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="page about-page">
      <div className="container">
        <h1 className="page-title">Meist</h1>

        <div className="content-section">
          <p className="intro-text">
            AutoTark aitab kasutatud auto ostjal märgata kuulutuses asju, mis võivad muidu kahe silma vahele jääda.
          </p>
          <p>
            Meie eesmärk on teha autoostu läbipaistvamaks ja vähendada ostmise riskide. Me ei inspekteeri autot
            kohapeal, kuid anname teile vahendused, et ennast paremini valmis hoida.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Miks AutoTark loodi</h2>
          <p>
            Kasutatud auto ostmise maailm on keeruline. Kuulutused sisaldavad sageli vajalikku informatsiooni
            puuduliselt või peituvad tõsiseid probleeme. AutoTark loodi selleks, et aidata ostjatel
            mõistlikke otsuseid teha, põhinedes kuulutuses esitatud teatel.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Mida AutoTark teeb</h2>
          <ul className="info-list">
            <li>Analüüsib kuulutuse sisu ja tuvastab potentsiaalsed probleemid</li>
            <li>Kontrollib mudeli tüüpilisi veapunkte ja hooldustarbeid</li>
            <li>Kogub ja kajastab kasutaja salvestatud autoandmeid</li>
            <li>Võrdleb erinevaid autoandid või sarnaseid mudелеid</li>
            <li>Koostab aruande koondkogemuse ja soovituste kohta</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Mida AutoTark ei tee</h2>
          <ul className="info-list warning-list">
            <li>AutoTark ei inspekteeri autot füüsiliselt ega teosta kohapealset kontrolli</li>
            <li>Me ei garanteeri kuulutuses esitatud teabe õigsust</li>
            <li>Me ei garanteeri, et kõiki võimalikke vigu leitakse</li>
            <li>AutoTark ei ole asendus professionaalsele auto inspektsioonile</li>
            <li>Me ei vastuta auto seisukorda ega selle väärtuse eest</li>
          </ul>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Kuidas infot käsitleme</h2>
          <p>
            Kui kasutate AutoTark teenust, kogume ja kasutame teie poolt esitatud kuulutuste andmeid.
            Andmeid kasutatakse ainult teenuse pakkumise jaoks ja mitte kolmandate osapooltega jagatud.
          </p>
          <p>
            Täielikud andmete käsitlemise tingimused leiate meie <Link to="/privaatsus">privaatsuspoliitikast</Link>.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Kontakt</h2>
          <p>Kui teil on küsimusi või soovite lisainfot, võtke meiega ühendust:</p>
          <Link to="/kontakt" className="btn btn-primary">
            Võta ühendust
          </Link>
        </div>
      </div>
    </div>
  );
}
