import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Analyze from './routes/Analyze';
import Report from './routes/Report';
import SavedCars from './routes/SavedCars';
import Compare from './routes/Compare';
import ResearchDebug from './routes/ResearchDebug';
import Layout from './components/Layout';

// Legal pages
import { AboutPage, ContactPage, PrivacyPolicyPage, CookiePolicyPage, TermsPage } from './routes/Legal';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze/:listingId" element={<Analyze />} />
        <Route path="/report/:carId" element={<Report />} />
        <Route path="/saved" element={<SavedCars />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/research-debug" element={<ResearchDebug />} />
        
        {/* Legal pages */}
        <Route path="/kasutustingimused" element={<TermsPage />} />
        <Route path="/privaatsus" element={<PrivacyPolicyPage />} />
        <Route path="/kupsised" element={<CookiePolicyPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
