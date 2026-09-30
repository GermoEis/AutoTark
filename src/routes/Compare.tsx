import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { cars, type Car } from '../data/cars'
import { mockAnalysis } from '../data/mockAnalysis'

interface ComparisonCar {
  car: Car
  analysis: typeof mockAnalysis
}

function Compare() {
  const [comparisonCars, setComparisonCars] = useState<ComparisonCar[]>([])
  const navigate = useNavigate()

  const addCar = (car: Car) => {
    if (comparisonCars.length >= 4) return
    if (comparisonCars.find(c => c.car.id === car.id)) return
    setComparisonCars([...comparisonCars, { car, analysis: mockAnalysis }])
  }

  const removeCar = (id: string) => {
    setComparisonCars(comparisonCars.filter(c => c.car.id !== id))
  }

  const handleCarSelect = (car: Car) => {
    addCar(car)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#2e7d32'
      case 'medium': return '#f57c00'
      case 'high': return '#c62828'
      default: return '#666'
    }
  }

  return (
    <div className="page compare-page">
      <div className="container">
        <h1>Auto võrdlus</h1>
        <p className="compare-intro">Vali kuni 4 autot võrreldavaks</p>

        {/* Search Box */}
        <div className="compare-search">
          <input 
            type="text" 
            placeholder="Otsi autot..." 
            onChange={(e) => {
              const query = e.target.value.toLowerCase()
              const matchedCars = cars.filter(c => 
                c.title.toLowerCase().includes(query) || 
                (c.brand && c.brand.toLowerCase().includes(query))
              )
              if (matchedCars.length > 0) {
                handleCarSelect(matchedCars[0])
              }
            }}
          />
          <span className="compare-hint">Kirjuta auto mark või mudel</span>
        </div>

        {/* Comparison Cars */}
        <div className="comparison-list">
          {comparisonCars.map((item) => (
            <div key={item.car.id} className="comparison-item">
              <div className="comparison-header">
                <h3>{item.car.title}</h3>
                <button 
                  onClick={() => removeCar(item.car.id)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
              <div className="comparison-price">{item.car.price.toLocaleString()} €</div>
              <div className="comparison-meta">
                <div><span>Aasta:</span> {item.car.year}</div>
                <div><span>Läbisõit:</span> {item.car.mileage.toLocaleString()} km</div>
                <div><span>Polnud:</span> {item.car.fuelType}</div>
                <div><span>Kaas:</span> {item.car.transmission}</div>
              </div>
              <div className="comparison-risk" style={{ borderColor: getRiskColor(item.car.mileage > 200000 ? 'high' : 'low') }}>
                <span>Risk: {item.car.mileage > 200000 ? 'kõrge' : 'madal'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Actions */}
        {comparisonCars.length >= 2 && comparisonCars.length <= 4 && (
          <div className="compare-actions">
            <button 
              className="button-primary"
              onClick={() => navigate('/compare/results', { state: { cars: comparisonCars } })}
            >
              Näita võrdlust
            </button>
          </div>
        )}

        {/* Saved Cars List */}
        <div className="compare-saved-list">
          <h3>Salvestatud autod</h3>
          <div className="saved-options">
            {cars.filter(c => !comparisonCars.find(x => x.car.id === c.id)).map(car => (
              <button 
                key={car.id} 
                className="compare-add-btn"
                onClick={() => addCar(car)}
                disabled={comparisonCars.length >= 4}
              >
                <div className="compare-add-title">{car.title}</div>
                <div className="compare-add-price">{car.price.toLocaleString()} €</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Compare