import { useState, useEffect } from 'react';

export const CookieSettings = ({ onSave }: { onSave: () => void }) => {
  const [essential, setEssential] = useState(true);
  const [preferences, setPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('autovaata-cookie-consent');
    if (stored) {
      const consent = JSON.parse(stored);
      setEssential(consent.essential);
      setPreferences(consent.preferences);
      setAnalytics(consent.analytics);
    }
  }, []);

  const handleSave = () => {
    const consent = { essential, preferences, analytics };
    localStorage.setItem('autovaata-cookie-consent', JSON.stringify(consent));
    onSave();
  };

  return (
    <div className="cookie-settings-modal">
      <div className="cookie-settings-content">
        <h3>Küpsiste seaded</h3>
        
        <div className="cookie-setting">
          <div className="cookie-setting-info">
            <strong>Vajalikud küpsised</strong>
            <p>Neid vajatakse veebilehe põhifunktsionaalsuse jaoks.</p>
          </div>
          <div className="cookie-setting-toggle">
            <input
              type="checkbox"
              checked={essential}
              onChange={() => setEssential(true)}
              disabled
            />
          </div>
        </div>

        <div className="cookie-setting">
          <div className="cookie-setting-info">
            <strong>Eelistused</strong>
            <p>Määravad eelistatud funktsioonid ja seaded.</p>
          </div>
          <div className="cookie-setting-toggle">
            <input
              type="checkbox"
              checked={preferences}
              onChange={(e) => setPreferences(e.target.checked)}
            />
          </div>
        </div>

        <div className="cookie-setting">
          <div className="cookie-setting-info">
            <strong>Analüütika</strong>
            <p>Aitab mõista, kuidas lehte kasutatakse ja parandada kasutajakogemust.</p>
          </div>
          <div className="cookie-setting-toggle">
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </div>
        </div>

        <div className="cookie-settings-actions">
          <button onClick={handleSave} className="btn btn-primary">
            Salvesta seaded
          </button>
        </div>
      </div>
    </div>
  );
};