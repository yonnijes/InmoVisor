import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import axios, { AxiosError } from 'axios';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import jsonDataMOK from '../../../data/data_property.json';
import FilterModal from '../../components/filter-modal';
import PropertyComponent from '../../components/property';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';
import { Property } from '../../models';



const PropertyView: React.FC = () => {

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

  const goToMap = () => {
    history.push('/mapa');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = `https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/data_property.json`;
        const response = await axios({
          url,
          method: "GET",
          responseType: 'json',
        });

        const data = await response.data;
        setProperties(data);

        // Guardar los datos en localStorage
        localStorage.setItem('properties', JSON.stringify(data));
      } catch (error) {
        if (error instanceof AxiosError)
          console.log(`Error fetching data: ${error.status} - ${error.message}`);
        setProperties(jsonDataMOK as  unknown as Property.Property[]);
        localStorage.setItem('properties', JSON.stringify(jsonDataMOK));
      }
    }

    fetchData();
  }, []);


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonSearchbar placeholder="Buscar" onIonChange={(e) => setSearchText(e.detail.value!)} />
        </IonToolbar>

        <IonToolbar>
          <IonButton slot="start" onClick={goToMap} >
            <IonIcon icon={locationOutline} />
            Ver mapa
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


        {properties.map((property, i) => (
          <PropertyComponent key={i} property={property} />
        ))}

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

export default PropertyView;
