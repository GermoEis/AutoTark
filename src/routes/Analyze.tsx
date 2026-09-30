import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAnalysis } from '../api';

function Analyze() {
  const { listingId } = useParams<{ listingId: string }>(); const navigate = useNavigate(); const [error, setError] = useState('');
  useEffect(() => { if (!listingId) return; let stopped = false; let timer: number | undefined; const poll = async () => { try { const analysis = await getAnalysis(listingId); if (stopped) return; if (analysis.status === 'completed' || analysis.status === 'needs_review' || analysis.status === 'failed') { navigate(`/report/${listingId}`, { replace: true }); return; } timer = window.setTimeout(poll, 2500); } catch (reason) { if (!stopped) { setError(reason instanceof Error ? reason.message : 'Analüüsi olekut ei saanud lugeda.'); timer = window.setTimeout(poll, 5000); } } }; void poll(); return () => { stopped = true; if (timer) window.clearTimeout(timer); }; }, [listingId, navigate]);
  return <main className="page"><div className="container loading-state"><div className="spinner" /><p className="eyebrow">2 · Analüüs käib</p><h1>Koostan auto kohta raportit</h1><p>Otsin mudeli, mootori ja käigukasti kohta korduvaid probleeme ning kontrollin iga väidet allika vastu.</p>{error && <div className="notification warning">{error}<br />Proovin uuesti.</div>}<p className="muted">See võib võtta mõne minuti, sest raporti kvaliteet sõltub allikate kontrollimisest.</p></div></main>;
}
export default Analyze;
