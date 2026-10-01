import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="page-header">
          <p className="eyebrow">
            <span className="pulse-dot"></span>
            Kasutajatugi ja koostöö
          </p>
          <h1>Võta meiega ühendust</h1>
          <p>
            Kas soovid anda tagasisidet, pakkuda uut funktsiooni või teatada veast? Kirjuta meile ja vastame esimesel võimalusel.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(260px, 0.8fr)', gap: '2rem', alignItems: 'start' }}>
          <div className="report-card">
            <h2>Saada meile sõnum</h2>

            {sent ? (
              <div className="notification success" style={{ margin: '1rem 0' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                  <strong>Aitäh! Sinu sõnum on saadetud.</strong>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>Võtame sinuga ühendust sisestatud e-posti teel.</p>
                </div>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="name">Sinu nimi *</label>
                <input
                  id="name"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Nt. Mart Tamm"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="email">E-posti aadress *</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="mart.tamm@gmail.com"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="subject">Teema *</label>
                <input
                  id="subject"
                  className="input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  placeholder="Nt. Tagasiside BMW raporti kohta või laienduse küsimus"
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="message">Sõnum *</label>
                <textarea
                  id="message"
                  className="input"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  placeholder="Kirjuta siia oma küsimus või ettepanek…"
                  style={{ resize: 'vertical' }}
                />
              </div>

              <button type="submit" className="button lg" style={{ marginTop: '0.5rem' }}>
                <span>Saada sõnum</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </form>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="report-card">
              <h3>Otsene kontakt</h3>
              <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                Võid meile alati kirjutada ka otse e-posti aadressil:
              </p>
              <div style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-dark)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                info@autotark.ee
              </div>
            </div>

            <div className="report-card">
              <h3>Vastamise aeg</h3>
              <p className="text-secondary" style={{ fontSize: '0.875rem', margin: 0 }}>
                Vastame tööpäeviti tavaliselt 24 tunni jooksul.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
