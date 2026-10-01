import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CookieBanner } from '../components/CookieConsent/CookieBanner';
import { cars } from '../data/cars';

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const savedCount = cars.filter(c => c.isSaved).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-container">
          <Link to="/" className="logo" aria-label="AutoTark Avaleht">
            <span className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </span>
            <span className="logo-text">Auto<strong>Tark</strong></span>
            <span className="logo-badge">Eesti</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Peamenüü">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>Kontrolli autot</span>
            </Link>
            <Link to="/saved" className={location.pathname === '/saved' ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Minu autod</span>
              {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
            </Link>
            <Link to="/compare" className={location.pathname.startsWith('/compare') ? 'nav-link active' : 'nav-link'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              <span>Võrdle</span>
            </Link>
            <Link to="/meist" className={location.pathname === '/meist' || location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>
              <span>Meist</span>
            </Link>
            <Link to="/kontakt" className={location.pathname === '/kontakt' || location.pathname === '/contact' ? 'nav-link active' : 'nav-link'}>
              <span>Kontakt</span>
            </Link>
          </nav>

          <div className="header-actions">
            <Link to="/" className="header-cta">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span>Uus kontroll</span>
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Ava menüü"
              aria-expanded={isMenuOpen}
            >
              <div className="hamburger">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>

          {/* Mobile Backdrop & Drawer */}
          <div 
            className={`mobile-nav-backdrop ${isMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMenuOpen(false)}
          />

          <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
              <span>🔍 Kontrolli autot</span>
            </Link>
            <Link to="/saved" className={location.pathname === '/saved' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
              <span>⭐ Minu autod</span>
              {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
            </Link>
            <Link to="/compare" className={location.pathname.startsWith('/compare') ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
              <span>📊 Autode võrdlus</span>
            </Link>
            <Link to="/meist" className={location.pathname === '/meist' || location.pathname === '/about' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
              <span>ℹ️ Meist</span>
            </Link>
            <Link to="/kontakt" className={location.pathname === '/kontakt' || location.pathname === '/contact' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
              <span>✉️ Kontakt</span>
            </Link>
            <hr className="mobile-nav-divider" />
            <Link to="/kasutustingimused" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Kasutustingimused
            </Link>
            <Link to="/privaatsus" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Privaatsuspoliitika
            </Link>
            <Link to="/kupsised" className="nav-link" onClick={() => setIsMenuOpen(false)}>
              Küpsised
            </Link>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
        {children}
      </main>

      <footer className="app-footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <path d="M9 17h6" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              </span>
              <span className="logo-text">Auto<strong>Tark</strong></span>
            </Link>
            <p className="footer-description">
              Sõltumatu analüüsitööriist Eesti autoostjale. Tuvasta tüüpvead, kontrolli VIN-koodi ja väldi ootamatuid remondikulusid.
            </p>
            <div className="footer-trust-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>100% Sõltumatu info</span>
            </div>
          </div>

          <div>
            <h4 className="footer-heading">Funktsioonid</h4>
            <ul className="footer-links">
              <li><Link to="/">Kontrolli kuulutust</Link></li>
              <li><Link to="/saved">Salvestatud autod</Link></li>
              <li><Link to="/compare">Autode võrdlus</Link></li>
              <li><a href="/auto24-import.html">Brauserilaienduse paigaldus</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Ettevõte</h4>
            <ul className="footer-links">
              <li><Link to="/meist">Meist ja metoodika</Link></li>
              <li><Link to="/kontakt">Kontakt ja tagasiside</Link></li>
              <li><Link to="/research-debug">Andmebaasi staatus</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Õiguslik</h4>
            <ul className="footer-links">
              <li><Link to="/kasutustingimused">Kasutustingimused</Link></li>
              <li><Link to="/privaatsus">Privaatsuspoliitika</Link></li>
              <li><Link to="/kupsised">Küpsiste poliitika</Link></li>
            </ul>
          </div>
        </div>

        <div className="container footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} AutoTark. Kõik õigused kaitstud. Loodud Eesti autoostjatele.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privaatsus">Privaatsus</Link>
            <Link to="/kasutustingimused">Tingimused</Link>
            <button onClick={() => alert('Küpsiste seaded: Saate küpsiseid hallata brauseri seadetest või küpsiseribalt.')} className="cookie-settings-link-small">
              Küpsiste seaded
            </button>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}

export default Layout;
