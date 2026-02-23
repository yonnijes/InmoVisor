import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { alertCircleOutline, filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import FilterModal from '../../components/filter-modal';
import Map from '../../components/map';
import PropertyComponent from '../../components/property';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';
import { Property } from '../../models';
import './index.css';

const defaultFilters = {
  bedrooms: 0,
  bathrooms: 0,
  squareMeters: 0,
  lowerPriceRange: 0,
  upperPriceRange: 0,
  type: '',
  transaction: '',
  parkingSpaces: 0,
  storageRoom: undefined,
};

const PropertyViewMap: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Property.Coordinate[]>([]);
  const [allPropertiesCache, setAllPropertiesCache] = useState<Property.Property[]>([]);

  const {
    properties,
    isModalOpen,
    countFilters,
    filters,
    setProperties,
    setSearchText,
    handleOpenModal,
    handleCloseModal,
    applyFilters,
    setFilters,
    sortOrder,
    setSortOrder,
  } = usePropertyViewLogic();

  const history = useHistory();

  const goToList = () => {
    history.push('/');
  };

  const handleResetFilters = () => {
    setSearchText('');
    setFilters(defaultFilters as any);
    setSortOrder('newest');
    applyFilters(defaultFilters as any);
  };

  useEffect(() => {
    const savedData = localStorage.getItem('properties');
    const loadedProperties: Property.Property[] = savedData ? JSON.parse(savedData) : [];
    setAllPropertiesCache(loadedProperties);
    setProperties(loadedProperties);
  }, []);

  useEffect(() => {
    const formatCurrency = (money: string | undefined, price: number) => {
      const amount = Number(price || 0).toLocaleString('es-CL');
      if (money === 'USD' || money === '$') return `$ ${amount}`;
      if (money === 'EUR') return `€ ${amount}`;
      if (money === 'Bs') return `Bs ${amount}`;
      return `${money || ''} ${amount}`.trim();
    };

    const coords = properties
      .map((property) => {
        const latRaw = property?.coordinate?.lat ?? (property as any)?.lat;
        const lngRaw = property?.coordinate?.lng ?? (property as any)?.lng;
        const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw;
        const lng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw;

        return {
          id: property.id,
          lat,
          lng,
          label: formatCurrency((property as any)?.money, Number(property?.price || 0)),
        };
      })
      .filter((coordinate) => Number.isFinite(coordinate.lat) && Number.isFinite(coordinate.lng));

    setCoordinates(coords as Property.Coordinate[]);
  }, [properties]);

  const similarProperties = useMemo(() => {
    const visibleIds = new Set(properties.map((p) => p.id));
    return allPropertiesCache.filter((p) => !visibleIds.has(p.id)).slice(0, 3);
  }, [allPropertiesCache, properties]);

  return (
    <IonPage>
      <IonHeader className="property-header-sticky">
        <IonToolbar>
          <IonSearchbar placeholder="Buscar" onIonChange={(e) => setSearchText(e.detail.value!)} />
        </IonToolbar>

        <IonToolbar>
          <div className="property-toolbar-actions">
            <IonButton fill="outline" onClick={goToList} className="toolbar-btn">
              <IonIcon icon={locationOutline} />
              Ver lista
            </IonButton>
            <IonTitle size="small">{coordinates.length} registros</IonTitle>
            <IonButton fill="outline" onClick={handleOpenModal} className="toolbar-btn">
              <IonIcon icon={filterOutline} />
              Filtrar {countFilters > 0 && `(${countFilters})`}
            </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {coordinates.length > 0 ? (
          <Map coordinates={coordinates} />
        ) : (
          <div className="map-empty-wrapper">
            <div className="map-empty-state">
              <IonIcon icon={alertCircleOutline} className="map-empty-state__icon" />
              <h2>No encontramos propiedades</h2>
              <p>Prueba cambiando la búsqueda o limpiando filtros para ver más resultados.</p>
              <div className="map-empty-state__actions">
                <IonButton onClick={handleResetFilters} color="primary">Limpiar filtros</IonButton>
                <IonButton onClick={goToList} fill="outline">Ver todas en lista</IonButton>
              </div>
            </div>

            {similarProperties.length > 0 && (
              <section className="map-similar-section">
                <h3>Propiedades similares</h3>
                <p>Estas podrían interesarte mientras ajustas tus filtros.</p>
                {similarProperties.map((property) => (
                  <PropertyComponent key={property.id} property={property} />
                ))}
              </section>
            )}
          </div>
        )}

        <FilterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applyFilters={applyFilters}
          filters={filters}
          setFilters={setFilters}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />
      </IonContent>
    </IonPage>
  );
};

export default PropertyViewMap;
