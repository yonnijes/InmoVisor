import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '../../models';
import { IonModal } from '@ionic/react';
import './index.css';
import PropertyComponent from '../property';

interface MapProps {
    coordinates: Property.Coordinate[];
}

const Map: React.FC<MapProps> = ({ coordinates }) => {


    const mapRef = useRef<HTMLDivElement>(null);
    const [selectedProperty, setSelectedProperty] = useState<Property.Property>();
    const [showModal, setShowModal] = useState(false);



    useEffect(() => {
        if (!mapRef.current) return;

        if (coordinates.length === 0) return;


        // Calcula el centro de todas las coordenadas
        const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
        const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

        // Establece la vista del mapa en el centro de las coordenadas y un nivel de zoom adecuado
        const map = L.map(mapRef.current).setView([centerLat, centerLng], 10);

        // Agrega una capa de mosaico de OpenStreetMap al mapa
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);


        // Función para crear el icono personalizado con el precio
        const createPriceMarkerIcon = (label: string) => {
            return L.divIcon({
                className: 'custom-price-marker',
                html: `
                    <div class="price-marker-container">
                        <div class="price-marker-content">
                            <span class="price-marker-text">${label}</span>
                        </div>
                        <div class="price-marker-arrow"></div>
                    </div>
                `,
                iconSize: [0, 0], // Tamaño automático basado en el contenido
                iconAnchor: [0, 0], // Se ajusta con CSS
                popupAnchor: [0, -10]
            });
        };


        // Itera sobre las coordenadas y agrega un marcador por cada una
        coordinates.forEach(coord => {
            const customIcon = createPriceMarkerIcon(coord.label);
            const marker = L.marker([coord.lat, coord.lng], { icon: customIcon }).addTo(map);
            marker.on('click', () => {
                setShowModal(true);
                setSelectedProperty(getProperty(coord.id));
            });
        });


        // Calcula los límites del área visible en el mapa
        const bounds = L.latLngBounds(coordinates.map(coord => [coord.lat, coord.lng]));

        // Ajusta el nivel de zoom para que todos los marcadores sean visibles
        map.fitBounds(bounds);

        const getProperty = (id: string) => {
            const savedData = localStorage.getItem('properties');
            const properties: Property.Property[] = savedData ? JSON.parse(savedData) : [];
            const property = properties.find(property => property.id === id);
            return property;
        }


        return () => {
            // Limpia el mapa al desmontar el componente
            map.remove();
        };
    }, [coordinates]);


    return <>
        <div ref={mapRef} style={{ width: "100%", height: "95%" }} />
        <IonModal className="viewMapProperty" isOpen={showModal} initialBreakpoint={1} breakpoints={[0, 1]} onDidDismiss={() => setShowModal(false)}>
            {selectedProperty && <PropertyComponent property={selectedProperty} />}
        </IonModal>
    </>
};

export default Map;
// 