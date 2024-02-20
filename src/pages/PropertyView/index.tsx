import { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonButton, IonIcon, IonModal } from '@ionic/react';
import { filterOutline, locationOutline } from 'ionicons/icons';
import axios, { Axios, AxiosError } from 'axios';
import PropertyComponent from '../../components/property';
import { Property } from '../../models';
import FilterModal from '../../components/filter-modal';
import { useHistory } from 'react-router';
import jsonDataMOK from '../../../data/data_property.json';



const PropertyView: React.FC = () => {



  const [propertys, setPropertys] = useState<Property.Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [filters, setFilters] = useState<Record<string, unknown>>({
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    // Agregar más filtros según sea necesario
  });


  const history = useHistory();

  const goToMap = () => {
    history.push('/mapa');
  };

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
          alert(`Error fetching data: ${error.status} - ${error.message}`);

        setPropertys(jsonDataMOK as Property.Property[]);
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
        property.type.toLowerCase().includes(searchText.toLowerCase())
      )
      : propertys;

    console.log('filteredPropertys:', filteredPropertys);

    setPropertys(filteredPropertys);
  }, [searchText]);


  useEffect(() => {
    const values = Object.values(filters);
    const count = values.filter(value => typeof value === "number" && value > 0).length;
    setCountFilters(count);

  }, [filters]);




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
