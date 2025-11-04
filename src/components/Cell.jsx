/**
 * Cell component for rendering individual park cells
 */

import { useMemo } from 'react';
import { isCellSafe, cellNeedsMaintenance } from '../domain/cell.js';

export function Cell({ cell }) {
  const isSafe = useMemo(() => isCellSafe(cell), [cell]);
  const needsMaint = useMemo(() => cellNeedsMaintenance(cell), [cell]);

  return (
    <div className={`box ${isSafe ? 'safe' : 'danger'}`}>
      <span>{cell.identifier}</span>
      {needsMaint && (
        <img
          src="dino-parks-wrench.png"
          alt="Needs maintenance"
          style={{ width: "50%" }}
        />
      )}
    </div>
  );
}
