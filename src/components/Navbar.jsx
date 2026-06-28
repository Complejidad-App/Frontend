function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-indigo-600 font-bold text-white">
          C
        </span>
        <span className="text-lg font-semibold text-slate-800">
          Complejidad App
        </span>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Buscar..."
          className="hidden w-64 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 sm:block"
        />
        <button
          type="button"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          aria-label="Notificaciones"
        >
          <span className="text-xl">🔔</span>
        </button>
        <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 font-medium text-slate-700">
          U
        </div>
      </div>
    </header>
  )
}

export default Navbar
