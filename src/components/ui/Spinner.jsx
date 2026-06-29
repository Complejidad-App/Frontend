function Spinner({ size = 20, className = '' }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-violet-400/30 border-t-violet-400 ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando"
    />
  )
}

export default Spinner
