import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Property } from '../../models';
import Map from '../../components/map';
import FilterModal from '../../components/filter-modal';


const PropertyViewMap: React.FC = () => {
  const [propertys, setPropertys] = useState<Property.Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [coordinates, setCoordinates] = useState<Property.Coordinate[]>([])

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [filters, setFilters] = useState<Record<string, unknown>>({
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    // Agregar más filtros según sea necesario
  });


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
        property.type.toLowerCase().includes(searchText.toLowerCase())
      )
      : propertys;

    setPropertys(filteredPropertys);
  }, [searchText]);

  useEffect(() => {
    const values = Object.values(filters);
    const count = values.filter(value => typeof value === "number" && value > 0).length;
    setCountFilters(count);

  }, [filters]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const applyFilters = (appliedFilters: any) => {

    const savedData = localStorage.getItem('propertys');
    const propertys: Property.Property[] = savedData ? JSON.parse(savedData) : [];

    // Filtrar las propiedades en función de los filtros aplicados
    const filteredPropertys = propertys.filter(property => {
      // Verificar si se han aplicado filtros y si la propiedad cumple con esos filtros
      if (appliedFilters.bedrooms && property.bedrooms !== appliedFilters.bedrooms) {
        return false;
      }
      if (appliedFilters.bathrooms && property.bathrooms !== appliedFilters.bathrooms) {
        return false;
      }
      if (appliedFilters.squareMeters && property.squareMeters !== appliedFilters.squareMeters) {
        return false;
      }

      // Agregar más condiciones para otros filtros si es necesario

      // Si la propiedad pasa todos los filtros, devolver true
      return true;
    });

    // Actualizar el estado de las propiedades filtradas
    setPropertys(filteredPropertys);
  };

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
