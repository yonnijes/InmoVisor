import { IonButton, IonContent, IonHeader, IonIcon, IonPage, IonSearchbar, IonSkeletonText, IonTitle, IonToolbar } from '@ionic/react';
import axios, { AxiosError } from 'axios';
import { alertCircleOutline, filterOutline, locationOutline } from 'ionicons/icons';
import { useEffect, useMemo, useState } from 'react';
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
    setSortOrder,
  } = usePropertyViewLogic();

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [allPropertiesCache, setAllPropertiesCache] = useState<Property.Property[]>([]);

  const goToMap = () => {
    history.push('/mapa');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const versionCheck = await checkDataVersion();

        if (!versionCheck.hasUpdate) {
          const cachedProperties = localStorage.getItem('properties');
          if (cachedProperties) {
            const parsed = JSON.parse(cachedProperties) as Property.Property[];
            setAllPropertiesCache(parsed);
            setProperties(parsed);
            return;
          }
        }

        const baseUrl = `https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/data_property.json`;
        const versionTag = versionCheck.remoteVersion ?? Date.now();
        const url = `${baseUrl}?v=${versionTag}`;
        const response = await axios({
          url,
          method: 'GET',
          responseType: 'json',
        });

        const data = await response.data;
        setAllPropertiesCache(data);
        setProperties(data);
        localStorage.setItem('properties', JSON.stringify(data));

        if ('caches' in window) {
          const cache = await caches.open('github-data-cache');
          const cachedResponse = new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' },
          });
          await cache.put(url, cachedResponse);
        }

        if (versionCheck.remoteVersion) {
          saveDataVersion(versionCheck.remoteVersion);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(`Error fetching data: ${error.status} - ${error.message}`);
        }
        const fallback = jsonDataMOK as unknown as Property.Property[];
        setAllPropertiesCache(fallback);
        setProperties(fallback);
        localStorage.setItem('properties', JSON.stringify(jsonDataMOK));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            <IonButton fill="outline" onClick={goToMap} className="toolbar-btn">
              <IonIcon icon={locationOutline} />
              Ver mapa
            </IonButton>
            <IonTitle size="small">{properties.length} registros</IonTitle>
            <IonButton fill="outline" onClick={handleOpenModal} className="toolbar-btn">
              <IonIcon icon={filterOutline} />
              Filtrar {countFilters > 0 && `(${countFilters})`}
            </IonButton>
          </div>
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
        ) : properties.length > 0 ? (
          properties.map((property, i) => <PropertyComponent key={i} property={property} />)
        ) : (
          <div className="list-empty-wrapper">
            <div className="list-empty-state">
              <IonIcon icon={alertCircleOutline} className="list-empty-state__icon" />
              <h2>No encontramos propiedades</h2>
              <p>Prueba cambiando la búsqueda o limpiando filtros para ver más resultados.</p>
            </div>

            {similarProperties.length > 0 && (
              <section className="list-similar-section">
                <h3>Propiedades similares</h3>
                <p>Estas podrían interesarte mientras ajustas tu búsqueda.</p>
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

export default PropertyView;
