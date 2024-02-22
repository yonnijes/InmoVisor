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
    propertys,
    searchText,
    isModalOpen,
    countFilters,
    filters,
    setPropertys,
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
    const savedData = localStorage.getItem('propertys');
    const propertys: Property.Property[] = savedData ? JSON.parse(savedData) : [];
    setPropertys(propertys);
  }, []);


  useEffect(() => {
    const coordinates = propertys
      .map(property => ({
        id: property.id,
        lat: property?.coordinate?.lat,
        lng: property?.coordinate?.lng
      }))
      .filter(coordinate => coordinate.lat && coordinate.lng);

    setCoordinates(coordinates);
  }, [propertys]);


  useEffect(() => {
    // Filtrar propiedades en función del searchText

    const savedData = localStorage.getItem('propertys');
    const propertys = savedData ? JSON.parse(savedData) : [];


    const filteredPropertys = searchText
      ? propertys.filter((property: Property.Property) =>
        property.address.toLowerCase().includes(searchText.toLowerCase()) ||
        property.type.toLowerCase().includes(searchText.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchText.toLowerCase())
      )
      : propertys;

    setPropertys(filteredPropertys);
  }, [searchText]);


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
