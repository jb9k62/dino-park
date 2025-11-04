/**
 * Park statistics dashboard component
 * Displays comprehensive statistics about the park state
 */

import { useParkStatistics } from '../hooks/useParkStatistics.js';

export function ParkStats({ park }) {
  const stats = useParkStatistics(park);

  if (!park) return null;

  const safetyPercentage = stats.totalCells > 0
    ? ((stats.safeCells / stats.totalCells) * 100).toFixed(1)
    : 0;

  return (
    <div className="stats-dashboard">
      <h2>Park Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Park Safety</h3>
          <p className="stat-value">{safetyPercentage}%</p>
          <small className="stat-detail">
            {stats.safeCells} / {stats.totalCells} cells safe
          </small>
        </div>

        <div className="stat-card">
          <h3>Dinosaurs</h3>
          <p className="stat-value">{stats.totalDinos}</p>
          <small className="stat-detail">
            {stats.digestingDinos} digesting, {stats.hungryDinos} hungry
          </small>
        </div>

        <div className="stat-card">
          <h3>Maintenance</h3>
          <p className={`stat-value ${stats.cellsNeedingMaintenance > 0 ? 'text-warning' : 'text-success'}`}>
            {stats.cellsNeedingMaintenance}
          </p>
          <small className="stat-detail">cells need maintenance</small>
        </div>

        <div className="stat-card">
          <h3>Diet Distribution</h3>
          <p className="stat-value">{stats.herbivores} 🌿 / {stats.carnivores} 🥩</p>
          <small className="stat-detail">herbivores / carnivores</small>
        </div>

        <div className="stat-card">
          <h3>Dangerous Cells</h3>
          <p className="stat-value text-red">{stats.dangerousCells}</p>
          <small className="stat-detail">cells with hungry dinos</small>
        </div>
      </div>
    </div>
  );
}
