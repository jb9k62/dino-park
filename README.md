# Dino Park

Event-sourced dinosaur park management system demonstrating pure functional programming in React.

## What This Is

Real-world demonstration of:
- **Event sourcing** - reconstructs park state from persistent event log
- **Pure functions** - zero mutations, all domain logic testable without mocks
- **Immutable data structures** - vanilla JS spread/map/filter patterns throughout
- **Derived state** - entire UI recomputes from events on each render (performant via useMemo)

Fetches chronological events from API → processes synchronously → renders current state. No local mutations. No classes. No imperative updates.

## The Problem Domain

Manage 26×16 grid (A-Z columns, 1-16 rows, 416 cells total) tracking:
- Dinosaur locations (dinos can move between cells)
- Feeding schedules (digesting dinos are safe, hungry dinos are dangerous)
- Maintenance windows (cells require service every 30 days)
- Safety status (cell is dangerous if ANY hungry dino inside)

**Events:** `dino_added`, `dino_fed`, `dino_location_updated`, `dino_removed`, `maintenance_performed`

## Architecture Decisions

**Why pure functions over classes?**
- Functions compose. Objects encapsulate.
- Testing doesn't require instantiation/mocking.
- Immutability prevents temporal coupling bugs.
- Aligns with React 18 functional paradigm.

**Why event sourcing?**
- Single source of truth (API event log).
- Reproducible state at any point in time.
- Debugging via event replay.
- Natural fit for functional architecture.

**Performance considerations:**
- Dino location tracking uses `Map<id, location>` for O(1) removal/movement (avoids flattening grid)
- `useMemo` prevents reprocessing events on filter changes
- Filters mark cells `hidden: true` instead of removing (preserves stats)

## Code Structure

```
src/
├── domain/          Pure functions (100% test coverage)
│   ├── park.js      createPark(), getCellByLocation(), updateCell()
│   ├── cell.js      isCellSafe(), cellNeedsMaintenance(), addDinoToCell()
│   ├── dino.js      createDino(), feedDino(), isDinoDigesting()
│   └── processEvents.js   Main event processing loop
├── hooks/           Business logic hooks
│   ├── useParkEvents.js      Fetch + sort events
│   ├── useParkState.js       Memoized event processing
│   ├── useParkStatistics.js  Derive metrics from park
│   └── useFilteredPark.js    Apply user filters
├── components/      Presentational (props in, JSX out)
└── utils/           Constants, coordinates, dates
```

**Data flow:**
```
API → useParkEvents → useParkState(processEvents) → useFilteredPark → UI
                                ↓
                          useParkStatistics → Dashboard
```

## Interesting Implementation Details

**Immutability pattern:**
```js
// Instead of: park.grid[row][col].dinos.push(dino)
export function updateCell(park, location, newCell) {
  return {
    ...park,
    grid: park.grid.map((row, r) =>
      row.map((cell, c) =>
        cell.location === location ? newCell : cell
      )
    )
  };
}
```

**Event processing:**
- Events sorted by ISO 8601 `time` field before processing
- Unknown event kinds silently ignored (forward compatibility)
- Each event produces new park state, never mutates

**Time calculations:**
- Digesting status: `dinoFedTime + digestionPeriod > now`
- Maintenance needed: `lastMaintained + 30days < now`
- Current time: `new Date()` (no mocking, tests use event times)

## Running

```bash
npm install
npm run dev          # Vite dev server (port 5173)
npm test             # 52 tests, 100% domain coverage
npm run test:ui      # Vitest dashboard
npm run build        # Production bundle
```

## Testing Philosophy

**Domain layer: exhaustively tested**
- Every pure function has edge case coverage
- Tests verify immutability (inputs unchanged after calls)
- No mocks needed (functions are pure)
- Fast (52 tests in ~655ms)

**Component layer: untested**
- Presentational components just render props
- Integration already covered by domain tests
- Visual QA sufficient for UI layer

## Tech Stack

- **React 18.2** - functional components + hooks only
- **Vite 3.2** - fast dev server (upgrade to 6.x planned)
- **Vitest 4.0** - test runner with jsdom
- **No TypeScript** - vanilla JS/JSX demonstrates patterns work without type system
- **No state management library** - useState + useMemo sufficient
- **No date library** - vanilla Date API handles requirements
- **No immer** - spread patterns handle immutability

## API Contract

```
GET https://5rz6r1it73.execute-api.eu-west-2.amazonaws.com/nudls/feed

Returns: Array<Event>

Event {
  kind: 'dino_added' | 'dino_fed' | 'dino_location_updated' | 'dino_removed' | 'maintenance_performed',
  time: '2025-01-15T14:23:10Z',  // ISO 8601
  ... (additional fields based on kind)
}
```

Persistent event log. Same events every call. No pagination. No auth.

## Features

- **Three-panel layout:** stats/filters | grid | cell details
- **Multi-filter:** dangerous cells, maintenance needed, occupancy, dino search (AND logic)
- **Click cells:** inspect dinos, maintenance status, safety analysis
- **Visual indicators:** color-coded safety, maintenance icons, dino count badges
- **Error recovery:** retry failed API calls without page reload
- **Keyboard accessible:** Tab navigation, Enter/Space selection

## Why This Matters

Demonstrates that **pure functional programming scales to real UI applications** without sacrificing:
- Performance (memoization handles efficiency)
- Developer experience (no complex state management)
- Testability (100% coverage without mocks)
- Maintainability (functions compose, refactoring is safe)

Event sourcing + immutability + React = predictable, debuggable, testable applications.

## Debug

Development mode exposes park state:
```js
console.log(window.PARK)  // Inspect current park state
```

## License

MIT
