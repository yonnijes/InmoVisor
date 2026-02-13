import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import FilterModal from '../../components/filter-modal';
import Map from '../../components/map';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';

const PropertyViewMap: React.FC = () => {
  const {
    properties,
    isModalOpen,
    countFilters,
    filters,
    setSearchText,
    handleOpenModal,
    handleCloseModal,
    setFilters
  } = usePropertyViewLogic();

  const history = useHistory();

  const goToList = () => {
    history.push('/');
  };

  // Extraer las coordenadas de las propiedades ya filtradas
  const coordinates = properties
    .map(property => ({
      id: property.id,
      lat: property?.coordinate?.lat,
      lng: property?.coordinate?.lng
    }))
    .filter(coordinate => coordinate.lat && coordinate.lng);

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
            {properties.length} registros
          </IonTitle>
          <IonButton slot="end" onClick={handleOpenModal}>
            <IonIcon icon={filterOutline} />
            Filtrar {countFilters > 0 && `(${countFilters})`}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {coordinates.length > 0 ? <Map coordinates={coordinates} /> : <p>No hay propiedades para mostrar</p>}
        {/* Modal de Filtros */}
        <FilterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          applyFilters={setFilters} // Ahora solo pasamos setFilters
          filters={filters}
          setFilters={setFilters}
        />
      </IonContent>
    </IonPage>
  );
};

export default PropertyViewMap;
