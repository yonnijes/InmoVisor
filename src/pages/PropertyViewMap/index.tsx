import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import FilterModal from '../../components/filter-modal';
import Map from '../../components/map';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';
import { Property } from '../../models';


const PropertyViewMap: React.FC = () => {
  const [coordinates, setCoordinates] = useState<Property.Coordinate[]>([])
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
    setFilters
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
    const coordinates = properties
      .map(property => {
        // Compatibilidad: algunas propiedades guardan coordinate.{lat,lng}
        // y otras guardan lat/lng en raíz (string o number)
        const latRaw = property?.coordinate?.lat ?? (property as any)?.lat;
        const lngRaw = property?.coordinate?.lng ?? (property as any)?.lng;
        const lat = typeof latRaw === 'string' ? parseFloat(latRaw) : latRaw;
        const lng = typeof lngRaw === 'string' ? parseFloat(lngRaw) : lngRaw;

        return {
          id: property.id,
          lat,
          lng,
          label: property?.price?.toString() + ' ' + property?.money
        };
      })
      .filter(coordinate => Number.isFinite(coordinate.lat) && Number.isFinite(coordinate.lng));

    setCoordinates(coordinates as Property.Coordinate[]);
  }, [properties]);



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSearchbar placeholder="Buscar" onIonChange={(e) => setSearchText(e.detail.value!)} />
        </IonToolbar>

        <IonToolbar>
          <IonButton slot="start" onClick={goToList} >
            <IonIcon icon={locationOutline} />
            Ver Lista
          </IonButton>
          <IonTitle size="small" >
            {coordinates.length} registros
          </IonTitle>
          <IonButton slot="end" onClick={handleOpenModal}>
            <IonIcon icon={filterOutline} />
            Filtrar {countFilters > 0 && `(${countFilters})`}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {coordinates.length !== 0 ? <Map coordinates={coordinates} /> : <p>No hay propiedades para mostrar</p>}
        {/* Modal de Filtros */}
        <FilterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applyFilters={applyFilters}
          filters={filters}
          setFilters={setFilters}
        />
      </IonContent>
    </IonPage>
  );
};

export default PropertyViewMap;
