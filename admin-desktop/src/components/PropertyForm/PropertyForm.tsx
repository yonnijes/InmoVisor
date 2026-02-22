import React, { useState } from 'react'
import { MapPin, Camera, UploadCloud, Save, X, CheckSquare, Square } from 'lucide-react'
import MapSelector from './MapSelector'
import { PropertyData } from '../../services/propertyRepository'

const PROPERTY_TYPES = ['Departamento', 'Casa', 'Comercial', 'Terreno', 'Oficina'];
const TRANSACTION_TYPES = ['Venta', 'Alquiler'];
const CURRENCY_OPTIONS = [
  { label: 'Dólar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'Bolívares (Bs)', value: 'Bs' },
];
const CONDITION_OPTIONS = ['Nuevo', 'Usado'];
const COMMON_AMENITIES = [
  'Piscina', 'Gimnasio', 'Salon de fiesta', 'Seguridad 24/7', 
  'Quincho', 'Estacionamiento Visitas', 'Bodega', 'Jardín'
];

const PropertyForm: React.FC<{ initialData?: any; onSuccess: () => void }> = ({ initialData, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<{ path: string; preview: string; isExisting?: boolean }[]>(
    initialData?.image?.map((url: string) => ({ path: url, preview: url, isExisting: true })) || []
  )
  const [customAmenity, setCustomAmenity] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<PropertyData>>(initialData || {
    id: `A-${Date.now().toString().slice(-6)}`,
    type: 'Departamento',
    transaction: 'Venta',
    money: 'USD',
    price: 0,
    squareMeters: 0,
    bedrooms: 0,
    bathrooms: 0,
    parkingSpaces: 0,
    constructionYear: new Date().getFullYear(),
    condition: 'Usado',
    phoneContact: '',
    address: '',
    description: '',
    lat: '10.3532',
    lng: '-67.0410',
    amenities: []
  })

  const handleInputChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const toggleAmenity = (amenity: string) => {
    const current = formData.amenities || [];
    const updated = current.includes(amenity) 
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    handleInputChange('amenities', updated);
  }

  const addCustomAmenity = () => {
    const value = customAmenity.trim();
    if (!value) return;
    const current = formData.amenities || [];
    if (!current.includes(value)) {
      handleInputChange('amenities', [...current, value]);
    }
    setCustomAmenity('');
  }

  const appliesRoomsAndParking = formData.type !== 'Terreno';

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        path: (file as any).path, // Electron specific
        preview: URL.createObjectURL(file)
      }))
      setImages(prev => [...prev, ...newImages])
    }
  }

  const handleDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleDrop = (dropIndex: number) => {
    if (dragIndex === null || dragIndex === dropIndex) return

    setImages(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(dropIndex, 0, moved)
      return next
    })

    setDragIndex(null)
  }

  const handleSubmit = async () => {
    if (!formData.address || !formData.price || Number(formData.price) <= 0) {
      alert('Por favor, completa la dirección y un precio válido.');
      return;
    }

    if (!formData.phoneContact || String(formData.phoneContact).trim().length < 8) {
      alert('El teléfono de contacto es obligatorio para enlazar a WhatsApp.');
      return;
    }

    if (appliesRoomsAndParking && (formData.bedrooms === undefined || formData.parkingSpaces === undefined)) {
      alert('Completa habitaciones y estacionamientos para este tipo de propiedad.');
      return;
    }

    setLoading(true)
    try {
      if (initialData) {
        // Edit Mode
        const newImagePaths = images.filter(img => !img.isExisting).map(img => img.path);
        const existingImages = images.filter(img => img.isExisting).map(img => img.path);
        
        // Pass the updated image list (existing + new ones to be processed)
        const updatedData = { ...formData, image: existingImages };
        await window.electronAPI.updateProperty(initialData.id, updatedData, newImagePaths)
        alert('¡Propiedad actualizada y sincronizada! 🧙‍♂️✨')
      } else {
        // Create Mode
        const paths = images.map(img => img.path);
        await window.electronAPI.saveProperty(formData, paths)
        alert('¡Propiedad guardada y sincronizada con éxito! 🧙‍♂️✨')
      }
      onSuccess()
    } catch (error) {
      console.error(error)
      alert('Error al sincronizar con GitHub. Revisa la consola.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Info */}
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-bold text-gray-900">Información General</h3>
        <p className="text-sm text-gray-500">Define los datos básicos del inmueble</p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Identificador Único (ID)</label>
          <input 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-emerald-700"
            value={formData.id}
            onChange={e => handleInputChange('id', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Dirección Completa</label>
          <input 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Ej: Calle Miranda, Los Teques"
            value={formData.address}
            onChange={e => handleInputChange('address', e.target.value)}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Tipo</label>
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            value={formData.type}
            onChange={e => handleInputChange('type', e.target.value)}
          >
            {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Operación</label>
          <select 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            value={formData.transaction}
            onChange={e => handleInputChange('transaction', e.target.value)}
          >
            {TRANSACTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Moneda</label>
          <select
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            value={String(formData.money || 'USD')}
            onChange={e => handleInputChange('money', e.target.value)}
          >
            {CURRENCY_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Precio</label>
          <input 
            type="number"
            value={Number(formData.price || 0)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-emerald-600"
            onChange={e => handleInputChange('price', Number(e.target.value))}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Superficie (M²)</label>
          <input 
            type="number"
            value={Number(formData.squareMeters || 0)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('squareMeters', Number(e.target.value))}
          />
        </div>

        {appliesRoomsAndParking && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Habitaciones</label>
              <input
                type="number"
                value={Number(formData.bedrooms || 0)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                onChange={e => handleInputChange('bedrooms', Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Estacionamientos</label>
              <input
                type="number"
                value={Number(formData.parkingSpaces || 0)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
                onChange={e => handleInputChange('parkingSpaces', Number(e.target.value))}
              />
            </div>
          </>
        )}

        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Baños</label>
          <input
            type="number"
            value={Number(formData.bathrooms || 0)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('bathrooms', Number(e.target.value))}
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Año de construcción</label>
          <input
            type="number"
            value={Number(formData.constructionYear || new Date().getFullYear())}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('constructionYear', Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Condición</label>
          <select
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            value={String(formData.condition || 'Usado')}
            onChange={e => handleInputChange('condition', e.target.value)}
          >
            {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700">Teléfono de contacto (obligatorio)</label>
          <input
            type="text"
            value={String(formData.phoneContact || '')}
            placeholder="Ej: 584121234567"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl"
            onChange={e => handleInputChange('phoneContact', e.target.value.replace(/\D/g, ''))}
          />
        </div>
      </section>

      {/* Amenities grid */}
      <section className="bg-gray-50 p-6 rounded-2xl space-y-4">
        <label className="block text-sm font-bold text-gray-700">Comodidades (Amenities)</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COMMON_AMENITIES.map(amenity => (
            <TouchableOpacity 
              key={amenity}
              onPress={() => toggleAmenity(amenity)}
              className="flex items-center gap-2"
            >
              {formData.amenities?.includes(amenity) 
                ? <CheckSquare size={20} className="text-emerald-600" />
                : <Square size={20} className="text-gray-300" />
              }
              <span className="text-sm text-gray-600">{amenity}</span>
            </TouchableOpacity>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Agregar otro amenity"
            className="flex-1 p-3 bg-white border border-gray-200 rounded-xl"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomAmenity();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomAmenity}
            className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold"
          >
            Agregar
          </button>
        </div>

        {(formData.amenities || []).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Seleccionadas:</p>
            <div className="flex flex-wrap gap-2">
              {(formData.amenities || []).map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                  title="Quitar"
                >
                  {amenity} ✕
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Description */}
      <section className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Descripción Detallada</label>
        <textarea 
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl h-32 outline-none focus:ring-2 focus:ring-emerald-500"
          placeholder="Escribe aquí los detalles destacados de la propiedad..."
          value={formData.description}
          onChange={e => handleInputChange('description', e.target.value)}
        />
      </section>

      {/* Map Selector Integration */}
      <section className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <MapPin size={18} className="text-emerald-500" /> Ubicación Geográfica
          </label>
          <span className="text-[10px] font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
            {formData.lat}, {formData.lng}
          </span>
        </div>
        <MapSelector onLocationSelect={(lat, lng) => {
          handleInputChange('lat', lat.toFixed(6))
          handleInputChange('lng', lng.toFixed(6))
        }} />
      </section>

      {/* Image Gallery Polish */}
      <section className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Camera size={18} className="text-emerald-500" /> Galería de Fotos
        </label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 transition-colors relative overflow-hidden">
            <UploadCloud size={32} className="text-gray-300 mb-2" />
            <p className="text-[10px] text-gray-400 text-center px-2">Subir fotos</p>
            <input 
              type="file" 
              multiple 
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageAdd}
            />
          </div>

          {images.map((img, idx) => (
            <div
              key={`${img.path}-${idx}`}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => setDragIndex(null)}
              className={`aspect-square rounded-2xl border relative group overflow-hidden bg-gray-200 cursor-move ${dragIndex === idx ? 'border-emerald-500 opacity-70' : 'border-gray-100'}`}
              title="Arrastra para reordenar"
            >
              <img src={img.preview} className="w-full h-full object-cover" />
              <div className="absolute left-2 top-2 text-[10px] px-2 py-1 rounded bg-black/55 text-white">
                #{idx + 1}
              </div>
              <button 
                onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        {images.length > 1 && (
          <p className="text-xs text-gray-500">Tip: arrastra las fotos para cambiar su orden. El carrusel mostrará ese mismo orden.</p>
        )}
      </section>

      {/* Submit Button */}
      <button 
        disabled={loading}
        onClick={handleSubmit}
        className={`w-full py-5 rounded-2xl text-white font-bold flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-100 hover:shadow-emerald-200'
        }`}
      >
        <Save size={20} />
        {loading ? 'PROCESANDO Y SUBIENDO A GITHUB...' : (initialData ? 'GUARDAR CAMBIOS' : 'PUBLICAR PROPIEDAD')}
      </button>
    </div>
  )
}

// Simple Touchable wrapper for standard web/electron environment
const TouchableOpacity: React.FC<{ children: React.ReactNode; onClick?: () => void; onPress?: () => void; className?: string }> = ({ children, onClick, onPress, className }) => (
  <button onClick={onClick || onPress} className={`cursor-pointer hover:opacity-70 active:opacity-50 transition-opacity ${className}`}>
    {children}
  </button>
);

export default PropertyForm
