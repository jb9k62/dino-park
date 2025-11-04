/**
 * Park grid component for rendering the entire grid with axis labels
 */

import { Cell } from './Cell.jsx';

export function ParkGrid({ park, onCellClick, selectedCell }) {
  if (!park?.grid) return null;

  const columnLabels = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );
  const rowLabels = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div className="park-container">
      {/* Column headers */}
      <div className="column-headers">
        <div className="corner-cell" aria-hidden="true"></div>
        {columnLabels.map(label => (
          <div key={label} className="column-header">{label}</div>
        ))}
      </div>

      {/* Grid rows with row labels */}
      <div className="grid-with-rows">
        {rowLabels.map((rowLabel, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid-row">
            <div className="row-header">{rowLabel}</div>
            {columnLabels.map((_, colIndex) => {
              const cell = park.grid[colIndex][rowIndex];
              return (
                <Cell
                  key={cell.identifier}
                  cell={cell}
                  onClick={() => onCellClick(cell)}
                  isSelected={selectedCell?.identifier === cell.identifier}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
