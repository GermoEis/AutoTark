import { useEffect, useState } from 'react';

type Claim = {
  id: string;
  make: string;
  model: string;
  variant: string | null;
  component: string;
  issue: string;
  symptoms: string[];
  repair: string | null;
  evidence_level: string;
  confidence: number;
  language: string;
  source_count: number;
};

type Job = {
  id: string;
  make: string;
  model: string;
  status: string;
  error: string | null;
};

const api = 'http://localhost:8787/api';

type VehicleForm = {
  make: string;
  model: string;
  generation: string;
  variant: string;
  engine: string;
  engineCode: string;
  transmission: string;
};

const emptyVehicle: VehicleForm = {
  make: '',
  model: '',
  generation: '',
  variant: '',
  engine: '',
  engineCode: '',
  transmission: '',
};

function ResearchDebug() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState('');
  const [url, setUrl] = useState('');
  const [vehicle, setVehicle] = useState<VehicleForm>(emptyVehicle);
  const [activeVehicle, setActiveVehicle] = useState<VehicleForm | null>(null);
  const [inspectMessage, setInspectMessage] = useState('');

  const reload = (filter?: VehicleForm | null) => {
    const query = filter
      ? `?${new URLSearchParams(
          Object.entries({
            make: filter.make,
            model: filter.model,
            variant: filter.variant,
            engine: filter.engine,
          }).filter(([, value]) => Boolean(value)) as string[][]
        ).toString()}`
      : '';

    return Promise.all([
      fetch(`${api}/claims${query}`).then((r) => r.json()),
      fetch(`${api}/jobs`).then((r) => r.json()),
    ]).then(([claimData, jobData]) => {
      setClaims(Array.isArray(claimData) ? claimData : []);
      setJobs(Array.isArray(jobData) ? jobData : []);
    });
  };

  useEffect(() => {
    fetch(`${api}/jobs`)
      .then((r) => r.json())
      .then((jobData) => {
        if (Array.isArray(jobData)) setJobs(jobData);
      })
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : 'Research API ei ole käivitatud')
      );
  }, []);

  const inspect = async () => {
    setInspectMessage('Loen Auto24 linki…');
    try {
      const result = await fetch(`${api}/auto24/inspect`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url }),
      }).then((r) => r.json());

      if (result.vehicle) {
        setVehicle({
          ...emptyVehicle,
          ...Object.fromEntries(
            Object.entries(result.vehicle).map(([key, value]) => [
              key === 'engineCode' ? 'engineCode' : key,
              value ?? '',
            ])
          ),
        });
      }
      setInspectMessage(result.message ?? 'Andmed tuvastatud — kontrolli need üle.');
    } catch {
      setInspectMessage('Auto24 linki ei saanud lugeda. Täida andmed käsitsi.');
    }
  };

  const queue = async () => {
    const result = await fetch(`${api}/research-jobs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ vehicle, priority: 10 }),
    }).then((r) => r.json());

    if (result.error) {
      setInspectMessage(result.error);
    } else {
      setActiveVehicle(vehicle);
      setInspectMessage(`Auto lisati research-järjekorda: ${result.id}`);
      await reload(vehicle);
    }
  };

  return (
    <div className="page" style={{ padding: '2rem 0 5rem' }}>
      <div className="container">
        <div className="page-header">
          <p className="eyebrow">Arendaja tööriist</p>
          <h1>Research-agendi ülevaade</h1>
          <p>Lokaalne vaade PostgreSQL-i salvestatud andmetele ja taustatöödele.</p>
        </div>

        {error && (
          <div className="notification warning">
            {error}. Käivita eraldi terminalis <code>npm run research:api</code>.
          </div>
        )}

        <div className="report-card">
          <h2>Auto24 import ja käsitsi lisamine</h2>
          <p className="text-secondary">
            Kleebi kuulutuse link või täida tehnilised parameetrid käsitsi, et lisada auto research-järjekorda.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0' }}>
            <input
              className="input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.auto24.ee/soidukid/..."
            />
            <button className="button" onClick={inspect}>
              Kontrolli linki
            </button>
          </div>

          {inspectMessage && (
            <div className="notification info" style={{ margin: '1rem 0' }}>
              {inspectMessage}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
            {(Object.keys(emptyVehicle) as Array<keyof VehicleForm>).map((field) => (
              <div key={field}>
                <label className="form-label" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
                  {field}
                </label>
                <input
                  className="input sm"
                  value={vehicle[field]}
                  onChange={(e) => setVehicle({ ...vehicle, [field]: e.target.value })}
                  placeholder={field}
                />
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button className="button lg" onClick={queue}>
              Lisa research-järjekorda
            </button>
          </div>
        </div>

        <div className="report-card">
          <h2>
            {activeVehicle
              ? `Leitud probleemid: ${activeVehicle.make} ${activeVehicle.model} (${claims.length})`
              : `Leitud probleemid (${claims.length})`}
          </h2>

          {!activeVehicle ? (
            <p className="text-secondary">Vali või lisa auto andmed, et filtreerida spetsiifilisi probleeme.</p>
          ) : claims.length === 0 ? (
            <p className="text-secondary">Selle auto kohta ei ole veel probleeme salvestatud.</p>
          ) : (
            <div className="claim-list">
              {claims.map((claim) => (
                <article key={claim.id} className="claim-card">
                  <h3>
                    {claim.make} {claim.model} {claim.variant ?? ''}: {claim.issue}
                  </h3>
                  <p><strong>Komponent:</strong> {claim.component}</p>
                  <p><strong>Sümptomid:</strong> {claim.symptoms.join(', ')}</p>
                  <p><strong>Parandus:</strong> {claim.repair ?? '—'}</p>
                  <div className="claim-meta-row">
                    <span>Tõend: <strong>{claim.evidence_level}</strong></span>
                    <span>Kindlus: <strong>{claim.confidence}</strong></span>
                    <span>Allikaid: <strong>{claim.source_count}</strong></span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="report-card">
          <h2>Research-tööd järjekorras ({jobs.length})</h2>
          <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--color-text-secondary)' }}>
            {jobs.map((job) => (
              <li key={job.id}>
                <strong>{job.make} {job.model}</strong> — <span className="status-pill">{job.status}</span>
                {job.error ? ` — Viga: ${job.error}` : ''}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResearchDebug;
