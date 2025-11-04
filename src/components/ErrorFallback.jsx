/**
 * Error fallback component for error boundary
 */

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="container" style={{ padding: "20px", textAlign: "center" }}>
      <h2>Oops! Something went wrong</h2>
      <p style={{ color: "red" }}>{error.message}</p>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}
