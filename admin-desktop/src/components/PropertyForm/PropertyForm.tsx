import React, { useState } from 'react'
import { MapPin, Camera, UploadCloud, Save, X } from 'lucide-react'
import MapSelector from './MapSelector'
import { PropertyData } from '../../services/propertyRepository'

const PropertyForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [formData, setFormData] = useState<Partial<PropertyData>>({
    id: `A-${Date.now()}`,
    type: 'Departamento',
    transaction: 'Venta',
    money: '$',
    price: 0,
    squareMeters: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    address: '',
    description: '',
    lat: '10.35',
    lng: '-67.04',
    amenities: []
  })

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const paths = Array.from(e.target.files).map(file => (file as any).path)
      setImages(prev => [...prev, ...paths])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await window.electronAPI.saveProperty(formData, images)
      alert('Propiedad guardada y sincronizada con Git! 🚀')
      onSuccess()
    } catch (error) {
      console.error(error)
      alert('Error al guardar la propiedad.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Basic Info */}
      <section className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Título / ID</label>
          <input 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            value={formData.id}
            onChange={e => handleInputChange('id', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Dirección</label>
          <input 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Calle, Ciudad..."
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
          />
        </div>
      </section>

      {/* Technical Details */}
      <section className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Precio</label>
          <input 
            type="number"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('price', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">M²</label>
          <input 
            type="number"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('squareMeters', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Habitaciones</label>
          <input 
            type="number"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('bedrooms', Number(e.target.value))}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Baños</label>
          <input 
            type="number"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('bathrooms', Number(e.target.value))}
          />
        </div>
      </section>

      {/* Location Selector */}
      <section>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
          <MapPin size={18} className="text-emerald-500" /> Ubicación en el Mapa
        </label>
        <MapSelector onLocationSelect={(lat, lng) => {
          handleInputChange('lat', lat.toString())
          handleInputChange('lng', lng.toString())
        }} />
        <p className="text-xs text-gray-400 mt-2">Lat: {formData.lat} | Lng: {formData.lng}</p>
      </section>

      {/* Image Upload */}
      <section>
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
          <Camera size={18} className="text-emerald-500" /> Imágenes de la Propiedad
        </label>
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 transition-colors relative">
          <UploadCloud size={48} className="text-gray-300 mb-4" />
          <p className="text-sm text-gray-500">Arrastra fotos aquí o haz clic para subir</p>
          <input 
            type="file" 
            multiple 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageAdd}
          />
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {images.map((path, idx) => (
            <div key={idx} className="bg-white border border-gray-100 p-2 rounded-lg text-[10px] flex items-center gap-2">
               <span className="truncate w-32">{path.split('/').pop()}</span>
               <X size={14} className="text-red-400" onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))} />
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <button 
        disabled={loading}
        onClick={handleSubmit}
        className={`w-full py-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'}`}
      >
        <Save size={20} />
        {loading ? 'Procesando y Sincronizando...' : 'Guardar Propiedad'}
      </button>
    </div>
  )
}

export default PropertyForm
