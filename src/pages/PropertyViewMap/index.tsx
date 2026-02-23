import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import FilterModal from '../../components/filter-modal';
import Map from '../../components/map';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';
import { Property } from '../../models';
import './index.css';

const PropertyViewMap: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Property.Coordinate[]>([]);
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

  useEffect(() => {
    const savedData = localStorage.getItem('properties');
    const properties: Property.Property[] = savedData ? JSON.parse(savedData) : [];
    setProperties(properties);
  }, []);

  useEffect(() => {
    const formatCurrency = (money: string | undefined, price: number) => {
      const amount = Number(price || 0).toLocaleString('es-CL');
      if (money === 'USD' || money === '$') return `$ ${amount}`;
      if (money === 'EUR') return `€ ${amount}`;
      if (money === 'Bs') return `Bs ${amount}`;
      return `${money || ''} ${amount}`.trim();
    };

    const coordinates = properties
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

    setCoordinates(coordinates as Property.Coordinate[]);
  }, [properties]);

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
        {coordinates.length !== 0 ? <Map coordinates={coordinates} /> : <p>No hay propiedades para mostrar</p>}
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
