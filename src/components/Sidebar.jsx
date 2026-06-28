const navItems = [
  { label: 'Dashboard', icon: '🏠' },
  { label: 'Proyectos', icon: '📁' },
  { label: 'Reportes', icon: '📊' },
  { label: 'Usuarios', icon: '👥' },
  { label: 'Configuración', icon: '⚙️' },
]

function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r border-slate-200 bg-white md:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item, index) => (
          <a
            key={item.label}
            href="#"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              index === 0
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
