import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Sõnum saadetud! Võtame teiega ühendust esimesel võimalusel.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact-page">
      <div className="container">
        <h1 className="page-title">Kontakt</h1>

        <div className="content-section">
          <p className="intro-text">
            Olete leidnud midagi, mis teid huvi ei ärrita, või soovite lihtsalt rääkida?
            Me oleme alati valmis kuulma ja aitama.
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Vormi kaudu</h2>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="name">Nimi</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Teie nimi"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-post</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="teie@postileht.ee"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Teema</label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
                placeholder="Sõnumi teema"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Sõnum</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                placeholder="Kirjutage siia oma sõnum..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg">
              Saada sõnum
            </button>
          </form>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Otsene kontakt</h2>
          <p>
            Kui soovite otse ühendust, saate meid võtta üles e-posti teel:
          </p>
          <p className="contact-email">
            {/* Email will be configured from config.ts when available */}
          </p>
        </div>

        <div className="content-section">
          <h2 className="section-heading">Kasutajatugi</h2>
          <p>
            Kui teil on küsimusi AutoTark kasutamise kohta, konsulteerige meie
            Meist lehte või jälgige meie teavitusi.
          </p>
        </div>
      </div>
    </div>
  );
}
