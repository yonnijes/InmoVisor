import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon, IonModal } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import axios, { Axios, AxiosError } from 'axios';
import PropertyComponent from '../../components/property';
import { Property } from '../../models';
import FilterModal from '../../components/filter-modal';
import { useHistory } from 'react-router';
import jsonDataMOK from '../../../data/data_property.json';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';



const PropertyView: React.FC = () => {

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
        setPropertys(data);

        // Guardar los datos en localStorage
        localStorage.setItem('propertys', JSON.stringify(data));
      } catch (error) {
        if (error instanceof AxiosError)
          console.log(`Error fetching data: ${error.status} - ${error.message}`);
        setPropertys(jsonDataMOK as  unknown as Property.Property[]);
        localStorage.setItem('propertys', JSON.stringify(jsonDataMOK));
      }
    }

    fetchData();
  }, []);

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
          <IonButton slot="start" onClick={goToMap} >
            <IonIcon icon={locationOutline} />
            Ver mapa
          </IonButton>
          <IonTitle size="small" >
            {propertys.length} registros
          </IonTitle>
          <IonButton slot="end" onClick={handleOpenModal}>
            <IonIcon icon={filterOutline} />
            Filtrar {countFilters > 0 && `(${countFilters})`}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>


        {propertys.map((property, i) => (
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
