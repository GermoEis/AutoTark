import { Link } from 'react-router-dom'
import { cars } from '../data/cars'

function SavedCars() {
  return (
    <div className="page saved-cars-page">
      <div className="container">
        <h1>Salvestatud autod</h1>
        {cars.filter(c => c.isSaved).length === 0 ? (
          <div className="no-saved">
            <p>Teil ei ole veel ühtegi autot salvestatud.</p>
            <Link to="/" className="button-link">Otsi auto</Link>
          </div>
        ) : (
          <div className="saved-list">
            {cars.filter(c => c.isSaved).map(car => (
              <div key={car.id} className="saved-card">
                <div className="saved-header">
                  <h3>{car.title}</h3>
                  <div className="saved-price">{car.price.toLocaleString()} €</div>
                </div>
                <div className="saved-meta">
                  <span>{car.year}</span>
                  <span>•</span>
                  <span>{car.mileage.toLocaleString()} km</span>
                  <span>•</span>
                  <span>{car.fuelType}</span>
                </div>
                <div className="saved-actions">
                  <Link to={`/report/${car.id}`} className="button-link button-link-secondary">Vaata analüüsi</Link>
                  <button className="button-link button-link-primary">Salvesta</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedCars