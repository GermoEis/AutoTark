import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { CookieBanner } from '../components/CookieConsent/CookieBanner';

interface LayoutProps {
  children?: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="app">
      <header className="app-header">
        <div className="container header-container">
          <Link to="/" className="logo">
            AutoTark
          </Link>

          {/* Desktop Navigation */}
          <nav className="nav desktop-nav">
            <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>
              Kontrolli autot
            </Link>
            <Link to="/saved" className={location.pathname === '/saved' ? 'nav-link active' : 'nav-link'}>
              Minu autod
            </Link>
            <Link to="/compare" className={location.pathname === '/compare' ? 'nav-link active' : 'nav-link'}>
              Võrdle
            </Link>
            <Link to="/meist" className={location.pathname === '/meist' ? 'nav-link active' : 'nav-link'}>
              Meist
            </Link>
            <Link to="/kontakt" className={location.pathname === '/kontakt' ? 'nav-link active' : 'nav-link'}>
              Kontakt
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menüü"
          >
            <span className="hamburger"></span>
          </button>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="nav mobile-nav">
              <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
                Kontrolli autot
              </Link>
              <Link to="/saved" className={location.pathname === '/saved' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
                Minu autod
              </Link>
              <Link to="/compare" className={location.pathname === '/compare' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
                Võrdle
              </Link>
              <Link to="/meist" className={location.pathname === '/meist' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
                Meist
              </Link>
              <Link to="/kontakt" className={location.pathname === '/kontakt' ? 'nav-link active' : 'nav-link'} onClick={() => setIsMenuOpen(false)}>
                Kontakt
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
              <button onClick={() => setIsMenuOpen(false)} className="cookie-settings-link">
                Küpsiste seaded
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="app-main">
        <Outlet />
        {children}
      </main>

      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h4 className="footer-heading">AutoTark</h4>
            <p className="footer-description">
              Kontrolli kasutatud auto kuulutust enne ostu.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Teenused</h4>
            <ul className="footer-links">
              <li><Link to="/">Kontrolli autot</Link></li>
              <li><Link to="/saved">Minu autod</Link></li>
              <li><Link to="/compare">Autode võrdlus</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Ettevõte</h4>
            <ul className="footer-links">
              <li><Link to="/meist">Meist</Link></li>
              <li><Link to="/kontakt">Kontakt</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Õiguslik</h4>
            <ul className="footer-links">
              <li><Link to="/kasutustingimused">Kasutustingimused</Link></li>
              <li><Link to="/privaatsus">Privaatsuspoliitika</Link></li>
              <li><Link to="/kupsised">Küpsiste kasutamine</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} AutoTark. Kõik õigused kaitstud.
          </p>
          <button onClick={() => alert('Küpsiste seaded avatud')} className="cookie-settings-link-small">
            Küpsiste seaded
          </button>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}

export default Layout;
