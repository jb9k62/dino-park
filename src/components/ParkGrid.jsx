/**
 * Park grid component for rendering the entire grid
 */

import { Cell } from './Cell.jsx';

export function ParkGrid({ park }) {
  if (!park?.grid) return null;

  return (
    <div className="container">
      {park.grid.map((col, colIndex) => (
        <div key={`col-${colIndex}`}>
          {col.map((cell) => (
            <Cell key={cell.identifier} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}
