import test from 'node:test';
import assert from 'node:assert/strict';
import { claimKey, normalizeVehicle, vehicleKey } from './normalization.js';

test('normalizes vehicle identity and creates stable duplicate key', () => {
  const first = normalizeVehicle({ make: ' BMW ', model: 'G31', engineCode: ' B57 ', transmission: '8HP' });
  const second = normalizeVehicle({ make: 'bmw', model: 'g31', engineCode: 'b57', transmission: '8hp' });
  assert.equal(vehicleKey(first), vehicleKey(second));
});
test('deduplicates equivalent claims', () => { const vehicle = { make: 'BMW', model: 'G31' }; assert.equal(claimKey(vehicle, 'EGR', 'Coolant leak'), claimKey(vehicle, ' egr ', 'coolant leak')); });
