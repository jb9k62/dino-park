/**
 * Park filters component
 * Provides filtering and search functionality for the park grid
 */

export function ParkFilters({ filters, onFiltersChange }) {
  return (
    <div className="park-filters">
      <h2>Filters</h2>
      <div className="filters-grid">
        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.showOnlyDangerous}
            onChange={(e) => onFiltersChange({
              ...filters,
              showOnlyDangerous: e.target.checked
            })}
          />
          <span>Show only dangerous cells</span>
        </label>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.showOnlyNeedsMaintenance}
            onChange={(e) => onFiltersChange({
              ...filters,
              showOnlyNeedsMaintenance: e.target.checked
            })}
          />
          <span>Show only cells needing maintenance</span>
        </label>

        <label className="filter-option">
          <input
            type="checkbox"
            checked={filters.showOnlyOccupied}
            onChange={(e) => onFiltersChange({
              ...filters,
              showOnlyOccupied: e.target.checked
            })}
          />
          <span>Show only occupied cells</span>
        </label>

        <div className="search-container">
          <label htmlFor="dino-search">Search dinosaur:</label>
          <input
            id="dino-search"
            type="text"
            value={filters.dinoSearch}
            onChange={(e) => onFiltersChange({
              ...filters,
              dinoSearch: e.target.value
            })}
            placeholder="Enter dino name..."
            className="search-input"
          />
        </div>
      </div>

      {(filters.showOnlyDangerous || filters.showOnlyNeedsMaintenance || filters.showOnlyOccupied || filters.dinoSearch) && (
        <button
          onClick={() => onFiltersChange({
            showOnlyDangerous: false,
            showOnlyNeedsMaintenance: false,
            showOnlyOccupied: false,
            dinoSearch: ''
          })}
          className="clear-filters-button"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}
