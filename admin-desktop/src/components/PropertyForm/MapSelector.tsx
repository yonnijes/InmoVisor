import React, { useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet icon issue in React
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapSelectorProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapSelector: React.FC<MapSelectorProps> = ({ onLocationSelect }) => {
  const [position, setPosition] = useState<[number, number]>([10.35, -67.04]) // Default Los Teques

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng])
        onLocationSelect(e.latlng.lat, e.latlng.lng)
      },
    })
    return null
  }

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-200 mt-2">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <MapEvents />
      </MapContainer>
    </div>
  )
}

export default MapSelector
