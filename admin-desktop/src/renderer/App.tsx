import React, { useState, useEffect } from 'react'
import { LayoutDashboard, PlusCircle, Settings, LogOut, Search } from 'lucide-react'
import PropertyForm from '../components/PropertyForm/PropertyForm'

// Typing for Electron API
declare global {
  interface Window {
    electronAPI: {
      getProperties: () => Promise<any[]>;
      saveProperty: (property: any, imagePaths: string[]) => Promise<any>;
      deleteProperty: (id: string) => Promise<any>;
      gitPull: () => Promise<any>;
    }
  }
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list')
  const [properties, setProperties] = useState<any[]>([])

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    const data = await window.electronAPI.getProperties()
    setProperties(data)
  }

  const handleDelete = async (id: string) => {
    if (confirm(`¿Estás seguro de eliminar la propiedad ${id}?`)) {
      await window.electronAPI.deleteProperty(id)
      loadProperties()
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-emerald-400">
            InmoVisor <span className="text-xs bg-emerald-900 px-2 py-0.5 rounded text-white">Admin</span>
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'list' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} />
            Propiedades
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'create' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <PlusCircle size={20} />
            Añadir Nueva
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
            Configuración
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:text-red-300 transition-colors">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-wider text-sm">
            {activeTab === 'list' ? 'Gestión de Inventario' : 'Nueva Propiedad'}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar propiedades..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 transition-all outline-none w-64"
              />
            </div>
            <button className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors">
              Sincronizar Git
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'list' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Propiedad</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ubicación</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.id}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">{p.type} en {p.transaction}</div>
                        <div className="text-xs text-gray-500">{p.squareMeters}m² | {p.bedrooms} Hab</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.address}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-emerald-600">{p.money} {p.price.toLocaleString('es-CL')}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-blue-600 hover:text-blue-800 font-medium mr-3">Editar</button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <PropertyForm onSuccess={() => {
                setActiveTab('list')
                loadProperties()
              }} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
