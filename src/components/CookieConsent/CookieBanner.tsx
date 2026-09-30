import { useState, useEffect } from 'react';
import { appConfig } from '../../config';

export const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('autovaata-cookie-consent');
    if (!stored && appConfig.features.cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = { essential: true, preferences: true, analytics: true };
    localStorage.setItem('autovaata-cookie-consent', JSON.stringify(newConsent));
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    const newConsent = { essential: true, preferences: false, analytics: false };
    localStorage.setItem('autovaata-cookie-consent', JSON.stringify(newConsent));
    setShowBanner(false);
  };

  const handleSettings = () => {
    const newConsent = { essential: true, preferences: true, analytics: false };
    localStorage.setItem('autovaata-cookie-consent', JSON.stringify(newConsent));
    setShowBanner(false);
  };

  if (!appConfig.features.cookieConsent || !showBanner) {
    return null;
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner-content">
        <p className="cookie-banner-text">
          AutoTark kasutab veebilehe toimimiseks vajalikke küpsiseid. Soovi korral saad lubada ka täiendavad analüütikaküpsised.
        </p>
        <div className="cookie-banner-actions">
          <button onClick={handleAcceptAll} className="btn btn-primary">
            Luba kõik
          </button>
          <button onClick={handleEssentialOnly} className="btn btn-secondary">
            Ainult vajalikud
          </button>
          <button onClick={handleSettings} className="btn btn-tertiary">
            Seaded
          </button>
        </div>
      </div>
    </div>
  );
};
