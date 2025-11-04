/**
 * Cell component for rendering individual park cells
 */

import { useMemo } from 'react';
import { isCellSafe, cellNeedsMaintenance } from '../domain/cell.js';

export function Cell({ cell, onClick, isSelected }) {
  const isSafe = useMemo(() => isCellSafe(cell), [cell]);
  const needsMaint = useMemo(() => cellNeedsMaintenance(cell), [cell]);

  return (
    <div
      className={`box ${isSafe ? 'safe' : 'danger'} ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <span className="cell-identifier">{cell.identifier}</span>
      {needsMaint && (
        <img
          src="dino-parks-wrench.png"
          alt="Needs maintenance"
          className="maintenance-icon"
          style={{ width: "50%" }}
        />
      )}
      {cell.dinos.length > 0 && (
        <span className="dino-count">{cell.dinos.length}</span>
      )}
    </div>
  );
}
