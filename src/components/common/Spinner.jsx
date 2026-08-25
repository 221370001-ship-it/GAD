export function GoldSpinner({ size = 22, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-[3px] border-accent-gold/25 border-t-accent-gold ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export default GoldSpinner;
