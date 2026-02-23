import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Property } from '../../models';
import { IonModal } from '@ionic/react';
import './index.css';
import PropertyComponent from '../property';

interface MapProps {
  coordinates: Property.Coordinate[];
}

const PRICE_LABEL_MIN_ZOOM = 13;

const PropertyMap: React.FC<MapProps> = ({ coordinates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property.Property>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!mapRef.current || coordinates.length === 0) return;

    const savedData = localStorage.getItem('properties');
    const properties: Property.Property[] = savedData ? JSON.parse(savedData) : [];
    const propertyById = new Map(properties.map((p) => [p.id, p]));

    const centerLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0) / coordinates.length;
    const centerLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0) / coordinates.length;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      minZoom: 3,
    }).setView([centerLat, centerLng], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const createPriceMarkerIcon = (label: string, showLabel: boolean) => {
      if (!showLabel) {
        return L.divIcon({
          className: 'custom-price-marker custom-price-marker--dot',
          html: `<div class="price-dot"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
      }

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
        iconSize: [0, 0],
        iconAnchor: [0, 0],
        popupAnchor: [0, -10],
      });
    };

    const clusterLayer = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      removeOutsideVisibleBounds: true,
      maxClusterRadius: 52,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        const cls = count < 10 ? 'small' : count < 40 ? 'medium' : 'large';
        return L.divIcon({
          html: `<div><span>${count}</span></div>`,
          className: `custom-cluster custom-cluster--${cls}`,
          iconSize: L.point(42, 42),
        });
      },
    });

    const markers: L.Marker[] = [];

    const applyLabelVisibility = () => {
      const showLabel = map.getZoom() >= PRICE_LABEL_MIN_ZOOM;
      markers.forEach((marker) => {
        const markerLabel = (marker as any).__label as string;
        marker.setIcon(createPriceMarkerIcon(markerLabel, showLabel));
      });
    };

    const initialShowLabel = map.getZoom() >= PRICE_LABEL_MIN_ZOOM;

    coordinates.forEach((coord) => {
      const marker = L.marker([coord.lat, coord.lng], {
        icon: createPriceMarkerIcon(coord.label, initialShowLabel),
      });

      (marker as any).__label = coord.label;

      marker.on('click', () => {
        setSelectedProperty(propertyById.get(coord.id));
        setShowModal(true);
      });

      markers.push(marker);
      clusterLayer.addLayer(marker);
    });

    map.addLayer(clusterLayer);

    const bounds = L.latLngBounds(coordinates.map((coord) => [coord.lat, coord.lng] as [number, number]));

    if (coordinates.length === 1) {
      map.setView([coordinates[0].lat, coordinates[0].lng], 15);
    } else {
      map.fitBounds(bounds, {
        paddingTopLeft: [16, 140],
        paddingBottomRight: [16, 24],
      });
    }

    applyLabelVisibility();
    map.on('zoomend', applyLabelVisibility);

    return () => {
      map.off('zoomend', applyLabelVisibility);
      map.remove();
    };
  }, [coordinates]);

  return (
    <>
      <div ref={mapRef} style={{ width: '100%', height: '95%' }} />
      <IonModal className="viewMapProperty" isOpen={showModal} initialBreakpoint={1} breakpoints={[0, 1]} onDidDismiss={() => setShowModal(false)}>
        {selectedProperty && <PropertyComponent property={selectedProperty} />}
      </IonModal>
    </>
  );
};

export default PropertyMap;
