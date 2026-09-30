import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'

function CompareResults() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cars } = location.state as { cars: any[] } || { cars: [] }
  const [activeTab, setActiveTab] = useState('general')

  if (!cars || cars.length === 0) {
    return (
      <div className="page compare-results-page">
        <div className="container">
          <h2>Vordluspuudu</h2>
          <p>Valige esmalt autosid vordluseks.</p>
          <Link to="/compare" className="button-link">Mine vordluslehele</Link>
        </div>
      </div>
    )
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#2e7d32'
      case 'medium': return '#f57c00'
      case 'high': return '#c62828'
      default: return '#666'
    }
  }

  const getRiskText = (risk: string) => {
    switch (risk) {
      case 'low': return 'Madal'
      case 'medium': return 'Keskmine'
      case 'high': return 'Kõrge'
      default: return 'Teadmata'
    }
  }

  return (
    <div className="page compare-results-page">
      <div className="container">
        <div className="compare-results-header">
          <h1>Vordlus</h1>
          <button className="button-secondary" onClick={() => navigate(-1)}>Tagasi</button>
        </div>
        <div className="compare-tabs">
          <button className={activeTab === 'general' ? 'active' : ''} onClick={() => setActiveTab('general')}>Uldine</button>
          <button className={activeTab === 'inspection' ? 'active' : ''} onClick={() => setActiveTab('inspection')}>Inspektsioon</button>
          <button className={activeTab === 'maintenance' ? 'active' : ''} onClick={() => setActiveTab('maintenance')}>Hooldus</button>
        </div>
        <div className="compare-tables">
          {activeTab === 'general' && (
            <div className="compare-table general">
              {['Hind', 'Aasta', 'Labisoit', 'Tyyp', 'Kaigukast', 'Riskitase'].map((label, i) => (
                <div key={i} className="compare-row">
                  <div className="compare-label">{label}</div>
                  {cars.map((car: any, j) => (
                    <div key={j} className="compare-value" style={label === 'Riskitase' ? { color: getRiskColor(car.analysis.summary.overallRisk) } : {}}>
                      {label === 'Hind' ? car.car.price.toLocaleString() + ' €' : label === 'Labisoit' ? car.car.mileage.toLocaleString() + ' km' : label === 'Riskitase' ? getRiskText(car.analysis.summary.overallRisk) : car.car[label === 'Aasta' ? 'year' : label === 'Tyyp' ? 'fuelType' : 'transmission']}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          {activeTab === 'inspection' && (
            <div className="compare-table inspection">
              {cars.map((car: any, i) => (
                <div key={i} className="compare-column">
                  <h3>{car.car.title}</h3>
                  <div className="comparison-risk" style={{ borderColor: getRiskColor(car.analysis.summary.overallRisk) }}>Risk: {getRiskText(car.analysis.summary.overallRisk)}</div>
                  <div className="compare-pros"><h4>Plusid</h4><ul>{car.analysis.summary.pros.map((p: string, j: number) => <li key={j}>{p}</li>)}</ul></div>
                  <div className="compare-cons"><h4>Miinused</h4><ul>{car.analysis.summary.cons.map((c: string, j: number) => <li key={j}>{c}</li>)}</ul></div>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'maintenance' && (
            <div className="compare-table maintenance">
              {cars.map((car: any, i) => (
                <div key={i} className="compare-column">
                  <h3>{car.car.title}</h3>
                  {car.analysis.upcomingMaintenance.map((task: any, j: number) => (
                    <div key={j} className={'maintenance-box ' + task.urgency} style={{ border: '1px solid ' + (task.urgency === 'urgent' ? '#c62828' : task.urgency === 'medium' ? '#f57c00' : '#2e7d32') }}>
                      <h4>{task.category}</h4>
                      <ul>{task.tasks.map((t: string, k: number) => <li key={k}>{t}</li>)}</ul>
                      <div className="cost-estimate"><span>{task.estimatedCost.toLocaleString()} €</span></div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {activeTab === 'general' && (
          <div className="compare-summary">
            <h3>Ulevaade</h3>
            <div className="summary-grid">
              {cars.map((car: any, i) => (
                <div key={i} className="summary-card">
                  <h4>{car.car.title}</h4>
                  <div className="summary-price">{car.car.price.toLocaleString()} €</div>
                  <div className="summary-risk" style={{ borderColor: getRiskColor(car.analysis.summary.overallRisk) }}>{getRiskText(car.analysis.summary.overallRisk)} risk</div>
                  <p>{car.analysis.summary.recommendation}</p>
                  <Link to={'/report/' + car.car.id} className="button-link">Vaata taisaruanet</Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompareResults
