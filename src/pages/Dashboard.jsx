import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const stats = [
  { label: 'Proyectos', value: '12', hint: '+2 esta semana' },
  { label: 'Usuarios activos', value: '348', hint: '+18 hoy' },
  { label: 'Tareas', value: '57', hint: '9 pendientes' },
  { label: 'Reportes', value: '4', hint: 'Actualizados' },
]

function Dashboard() {
  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">
              Panel base de la aplicación. Listo para construir sobre él.
            </p>
          </div>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-800">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-slate-400">{stat.hint}</p>
              </div>
            ))}
          </section>

          <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800">
              Contenido principal
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Este es el área de contenido del dashboard. Agrega aquí tablas,
              gráficas u otros componentes de la aplicación.
            </p>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
