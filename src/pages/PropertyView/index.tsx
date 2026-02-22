import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react';
import axios, { AxiosError } from 'axios';
import { filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import jsonDataMOK from '../../../data/data_property.json';
import FilterModal from '../../components/filter-modal';
import PropertyComponent from '../../components/property';
import { checkDataVersion, saveDataVersion } from '../../hook/checkDataVersion';
import { usePropertyViewLogic } from '../../hook/usePropertyViewLogic';
import { Property } from '../../models';
import './index.css';



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
    setFilters,
    sortOrder,
    setSortOrder
  } = usePropertyViewLogic();

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  const goToMap = () => {
    history.push('/mapa');
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, check if there's a new version available
        const versionCheck = await checkDataVersion();
        
        // If no update needed, try to load from localStorage first (offline support)
        if (!versionCheck.hasUpdate) {
          const cachedProperties = localStorage.getItem('properties');
          if (cachedProperties) {
            setProperties(JSON.parse(cachedProperties) as Property.Property[]);
            return;
          }
        }

        // Fetch new data from remote
        const baseUrl = `https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/data_property.json`;
        const versionTag = versionCheck.remoteVersion ?? Date.now();
        const url = `${baseUrl}?v=${versionTag}`;
        const response = await axios({
          url,
          method: "GET",
          responseType: 'json',
        });

        const data = await response.data;
        setProperties(data);

        // Guardar los datos en localStorage
        localStorage.setItem('properties', JSON.stringify(data));

        // Actualizar cache de Workbox programáticamente (si está disponible)
        if ('caches' in window) {
          const cache = await caches.open('github-data-cache');
          const cachedResponse = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
          });
          await cache.put(url, cachedResponse);
        }
        
        // Save the new version number after successful update
        if (versionCheck.remoteVersion) {
          saveDataVersion(versionCheck.remoteVersion);
        }
      } catch (error) {
        if (error instanceof AxiosError)
          console.log(`Error fetching data: ${error.status} - ${error.message}`);
        setProperties(jsonDataMOK as  unknown as Property.Property[]);
        localStorage.setItem('properties', JSON.stringify(jsonDataMOK));
      } finally {
        setIsLoading(false);
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
          <div className="property-toolbar-sort-wrap">
            <select
              className="property-toolbar-sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
              <option value="sqm-desc">Mayor m²</option>
              <option value="sqm-asc">Menor m²</option>
            </select>
          </div>
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

        {isLoading ? (
          <div style={{ padding: '12px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ marginBottom: 16, borderRadius: 12, border: '1px solid #e5e7eb', padding: 12 }}>
                <IonSkeletonText animated style={{ width: '55%', height: 22 }} />
                <IonSkeletonText animated style={{ width: '40%', height: 16 }} />
                <IonSkeletonText animated style={{ width: '30%', height: 16 }} />
                <IonSkeletonText animated style={{ width: '100%', height: 180, marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : (
          properties.map((property, i) => (
            <PropertyComponent key={i} property={property} />
          ))
        )}

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
