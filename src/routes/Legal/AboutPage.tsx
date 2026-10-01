import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Meie missioon
          </p>
          <h1>Meist ja AutoTark platvormist</h1>
          <p>
            AutoTark on loodud selleks, et anda Eesti autoostjale teadlikkus ja kindlustunne kasutatud auto valimisel.
          </p>
        </div>

        <div className="report-card">
          <h2>Miks AutoTark loodi?</h2>
          <p>
            Kasutatud auto ostmine on üks suuremaid finantsotsuseid, mida eraisik teeb, kuid müügikuulutused on sageli puudulikud, ilustatud või peidavad kalleid tehnilisi puudusi.
          </p>
          <p>
            AutoTark toob kokku foorumite teadmised, tehasetagastused, spetsiifilised mootoripõlvkondade tüüpvead ja VIN-koodi avalikud arhiivid, et sa teaksid täpselt, mida enne ostu kontrollida ja müüjalt küsida.
          </p>
        </div>

        <div className="report-card">
          <h2>Mida AutoTark teeb?</h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingLeft: '1.25rem', color: 'var(--color-text-secondary)', fontSize: '0.95rem' }}>
            <li>✓ Analüüsib Auto24 kuulutuse tehnilisi andmeid sekunditega.</li>
            <li>✓ Tuvastab mootori, käigukasti ja mudelipõlvkonna kriitilised nõrgad kohad.</li>
            <li>✓ Koostab kohapealseks kontrolliks spetsiifilise ostueelse kontroll-lehe.</li>
            <li>✓ Annab valmis küsimuste nimekirja proovisõiduks ja müüjaga vestlemiseks.</li>
            <li>✓ Hinnangulised remondikulud ja hoolduste ajastus järgmise 12–24 kuu jooksul.</li>
          </ul>
        </div>

        <div className="report-card" style={{ background: 'var(--color-warning-bg)', borderColor: 'var(--color-warning-border)' }}>
          <h2 style={{ color: 'var(--color-warning-text)' }}>⚠️ Oluline piirang ja selgitus</h2>
          <p style={{ color: 'var(--color-warning-text)', fontSize: '0.9375rem', lineHeight: 1.6 }}>
            AutoTark pakub informatiivset analüüsi avalike andmete põhjal. AutoTark ei asenda füüsilist tehnoülevaatust ega ekspertiisi autotöökojas. Enne lõpliku ostuotsuse tegemist soovitame alati lasta sõiduk spetsialistil ja tõstukil üle vaadata.
          </p>
        </div>

        <div className="report-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem' }}>Kas sul on küsimusi või ettepanekuid?</h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Oleme avatud koostööle ja kasutajate tagasisidele.</p>
          </div>
          <Link to="/kontakt" className="button">
            Võta meiega ühendust
          </Link>
        </div>
      </div>
    </div>
  );
}
