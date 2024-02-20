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


        // Define el icono personalizado
        const iconoPersonalizado = L.icon({
            iconUrl: './favicon.png',
            iconSize: [20, 20], // Tamaño del icono
            iconAnchor: [20, 40], // Punto en el icono que se alinea con las coordenadas del marcador
            popupAnchor: [0, -40] // Punto en el icono que se alinea con la parte superior del popup
        });


        // Itera sobre las coordenadas y agrega un marcador por cada una
        coordinates.forEach(coord => {
            const marker = L.marker([coord.lat, coord.lng], { icon: iconoPersonalizado }).addTo(map);
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
            const savedData = localStorage.getItem('propertys');
            const propertys: Property.Property[] = savedData ? JSON.parse(savedData) : [];
            const property = propertys.find(property => property.id === id);
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