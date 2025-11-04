/**
 * Cell details panel component
 * Displays detailed information about a selected cell
 */

import { isCellSafe, cellNeedsMaintenance } from '../domain/cell.js';
import { isDinoDigesting } from '../domain/dino.js';

export function CellDetails({ cell, onClose }) {
  if (!cell) return null;

  const isSafe = isCellSafe(cell);
  const needsMaint = cellNeedsMaintenance(cell);

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="cell-details-panel" role="dialog" aria-labelledby="cell-details-title">
      <div className="cell-details-header">
        <h2 id="cell-details-title">Cell {cell.identifier}</h2>
        <button onClick={onClose} aria-label="Close details" className="close-button">×</button>
      </div>

      <div className="detail-section">
        <h3>Status</h3>
        <p className={isSafe ? 'text-green' : 'text-red'}>
          {isSafe ? '✓ Safe' : '⚠ Dangerous'}
        </p>
      </div>

      <div className="detail-section">
        <h3>Dinosaurs ({cell.dinos.length})</h3>
        {cell.dinos.length === 0 ? (
          <p>No dinosaurs</p>
        ) : (
          <ul className="dino-list">
            {cell.dinos.map(dino => (
              <li key={dino.id} className="dino-item">
                <strong>{dino.name}</strong> ({dino.species})
                <br />
                <span className={isDinoDigesting(dino) ? 'text-green' : 'text-orange'}>
                  Status: {isDinoDigesting(dino) ? 'Digesting' : 'Hungry'}
                </span>
                <br />
                <span>{dino.herbivore ? '🌿 Herbivore' : '🥩 Carnivore'}</span>
                <br />
                <span className="text-muted">Gender: {dino.gender}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="detail-section">
        <h3>Maintenance</h3>
        <p>
          Last maintained: {formatDate(cell.lastMaintained)}
        </p>
        {needsMaint && (
          <p className="warning">⚠️ Maintenance required</p>
        )}
      </div>
    </div>
  );
}
