# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm run dev` - Start Vite dev server with hot-reload (default port 5173)
- `npm run build` - Build production bundle to dist/
- `npm run preview` - Preview production build locally

### Testing

- `npm test` - Run all tests in watch mode using Vitest
- `npm run test:ui` - Run tests with Vitest UI dashboard
- `npm run test:coverage` - Generate code coverage report

### Utility Scripts

- `node compareResponses.js` - Development utility to verify API response consistency (polls API every 200ms and throws error if responses differ)

## Architecture Overview

This is a **React 18 + Vite** application demonstrating **pure functional programming** with **immutable data structures**. It simulates a dinosaur park management system that processes events from an external API to maintain and visualize park state.

### Core Concepts

**Event-Driven Architecture:**

- Fetches persistent event log from external API endpoint
- Events are sorted chronologically and processed synchronously in order
- Five event types: `dino_added`, `dino_fed`, `dino_location_updated`, `dino_removed`, `maintenance_performed`
- Each event updates park state immutably
- UI renders current state after all events are processed

**Park Grid System:**

- 26 columns (A-Z) × 16 rows (1-16) = 416 cells total
- Each cell identified by coordinates (e.g., "A1", "B5", "Z16")
- Cells track dinosaurs currently located within them and maintenance status
- Grid has axis labels (column headers A-Z, row headers 1-16)

**Safety Logic:**

- A cell is **safe** (green) if empty OR all dinosaurs inside are digesting
- A cell is **dangerous** (red) if it contains any hungry dinosaur (not digesting)
- Dinosaurs digest for N hours after being fed (based on `digestion_period_in_hours` property)
- Cells require maintenance every 30 days

### Data Flow

```
API Events → useParkEvents → useParkState (processEvents) → useFilteredPark → UI
                                        ↓
                                useParkStatistics → Dashboard
```

1. **useParkEvents** hook fetches events from API endpoint and manages loading/error states
2. Events are sorted chronologically by `time` field
3. **useParkState** hook calls **processEvents** to apply events to Park model
4. **useFilteredPark** hook applies user filters to park state
5. React state updates trigger UI re-render showing current park status

### Functional Architecture

The codebase follows **pure functional programming** principles with **immutable data structures** throughout:

**Domain Layer (Pure Functions):**

- `src/domain/park.js` - `createPark()`, `getCellByLocation()`, `updateCell()` (all return new objects)
- `src/domain/cell.js` - `createCell()`, `addDinoToCell()`, `removeDinoFromCell()`, `isCellSafe()`, `cellNeedsMaintenance()`
- `src/domain/dino.js` - `createDino()`, `feedDino()`, `isDinoDigesting()`
- `src/domain/processEvents.js` - Main event processing loop, returns new park state for each event

**Custom Hooks:**

- `src/hooks/useParkEvents.js` - Fetches and sorts events from API, manages loading/error/refetch
- `src/hooks/useParkState.js` - Memoizes park state derived from events using `processEvents()`
- `src/hooks/useParkStatistics.js` - Derives statistics (total dinos, safe cells, etc.) from park state
- `src/hooks/useFilteredPark.js` - Applies multiple filters to park (dangerous cells, maintenance, occupancy, dino search)

**Components:**

- `src/components/ParkGrid.jsx` - Renders grid with axis labels, passes click handlers to cells
- `src/components/Cell.jsx` - Individual cell with safety status, dino count, maintenance icon, click handling
- `src/components/CellDetails.jsx` - Details panel showing cell status, dino list, maintenance info
- `src/components/ParkStats.jsx` - Statistics dashboard with 5 metric cards
- `src/components/ParkFilters.jsx` - Filter controls (checkboxes + search input)
- `src/components/ErrorFallback.jsx` - Error boundary fallback UI

**Utilities:**

- `src/utils/constants.js` - Configuration constants (grid dimensions, maintenance interval, API endpoint)
- `src/utils/coordinates.js` - Grid coordinate helpers (parseLocation, getColumnLetter, etc.)
- `src/utils/dates.js` - Date utilities (addDays, addHours, needsMaintenanceCheck)

### Key Implementation Details

**Immutability:**

- All domain functions return new objects instead of mutating
- Example: `updateCell(park, location, newCell)` returns new park with updated grid
- Uses spread operator and array methods (map, filter) for immutable updates
- No classes, no mutable state in domain layer

**Performance Optimizations:**

- `useMemo` in hooks to prevent unnecessary recalculations (useParkState, useParkStatistics, useFilteredPark)
- Dino location tracking with Map for O(1) lookups during movement/removal (avoids O(n) grid flattening)
- Memoized filter logic only recalculates when park or filters change

**Time Handling:**

- Events have ISO 8601 `time` strings
- All date comparisons use JavaScript Date objects
- Current time is `new Date()` for digesting/maintenance calculations
- Maintenance requires 30 days from lastMaintained date

**Error Handling:**

- React Error Boundary wraps entire app (using `react-error-boundary` package)
- API error handling with HTTP status checks and user-friendly messages
- Retry functionality without page reload (refetch hook)
- Loading states for async operations

**Filtering System:**

- Multiple filters can be active simultaneously (AND logic)
- "Show only dangerous cells" - filters to cells with hungry dinos
- "Show only cells needing maintenance" - filters to cells overdue for maintenance
- "Show only occupied cells" - filters to cells with at least one dino
- Dino search - case-insensitive search across dino names and species
- Filtered park marks cells as `hidden: true` instead of removing them (preserves statistics)

**User Interface:**

- Three-panel layout: left sidebar (stats + filters), center (grid), right sidebar (cell details)
- Click any cell to view detailed information in right panel
- Selected cell gets gold border indicator
- Keyboard accessible (Tab navigation, Enter/Space to select cells)
- Color-coded safety status (green = safe, red = dangerous)
- Maintenance icons (wrench) appear on cells needing maintenance
- Dino count badges on occupied cells
- Responsive design with media queries

### Testing

**Test Setup:**

- Vitest 4.0 with jsdom environment
- React Testing Library for component tests (deferred until Vite upgrade)
- Test setup file: `src/test/setup.js` extends Vitest with jest-dom matchers

**Test Coverage:**

- Domain layer: 100% coverage (52 tests across dino, cell, park, processEvents)
- All pure functions thoroughly tested with edge cases
- Tests verify immutability (functions don't mutate inputs)
- Tests cover: empty cells, digesting/hungry dinos, maintenance windows, event ordering, unknown events

**Running Tests:**

- `npm test` runs in watch mode
- `npm run test:coverage` generates coverage report
- All 52 tests pass in ~655ms

### Known Architectural Decisions

**Why Pure Functions Over Classes:**

- Better testability (no mocks needed)
- Immutability prevents accidental mutations
- Aligns with React 18 functional component paradigm
- Easier to reason about and compose
- No hidden state mutations

**Why No date-fns or immer:**

- Vanilla JavaScript sufficient for date operations
- Standard spread/map/filter patterns handle immutability without helpers
- Reduces dependency footprint

**Why Cells Use Arrays Instead of Maps for Dinos:**

- Immutability easier with arrays (spread operator, filter, map)
- Maps require new Map() constructor for copies
- Small array sizes (typically <5 dinos per cell) make linear search acceptable

**Window.PARK Debug Export:**

- Only exposed in development mode
- Allows console inspection: `window.PARK.grid[0][0]`
- Assigned in useEffect to avoid side effects during render

## Development Notes

- The app uses **ES modules** (`"type": "module"` in package.json)
- No TypeScript - vanilla JavaScript with JSX
- Vite 3.2 (older version) - upgrade to 6.x planned but not yet done
- React 18.2 (stable) with functional components and hooks throughout
- No class components anywhere in codebase
- Error boundaries require class components but handled via `react-error-boundary` package

## Important File Locations

**Entry Point:** `src/main.jsx` renders App into root div

**Main App:** `src/App.jsx` contains:

- ErrorBoundary wrapper
- ParkContainer component with all state management
- Three-panel layout integration

**Domain Logic:** All pure functions in `src/domain/`
**Business Logic:** All custom hooks in `src/hooks/`
**UI Components:** All presentational components in `src/components/`
**Configuration:** All constants in `src/utils/constants.js`

## API Integration

**Endpoint:** `https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed`

**Response Format:** Array of event objects with properties:

- `kind` - Event type string
- `time` - ISO 8601 timestamp
- Additional fields based on event kind (id, dinosaur_id, location, species, etc.)

**API Characteristics:**

- Returns consistent persistent event log (same events each call)
- Events may arrive unsorted, must be sorted by `time` before processing
- No pagination, returns full event log
- No authentication required

The application has been fully modernized with functional patterns, comprehensive tests, and production-ready features.
