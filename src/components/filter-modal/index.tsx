// FilterModal.tsx
import React from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonGrid, IonRow, IonCol } from '@ionic/react';
import Filter from '../filter';
import PriceRangeFilter from '../filterPriceRange';
import { Property } from '../../models';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyFilters: (filters: any) => void;
  filters: any; // Objeto que contiene los valores de los filtros
  setFilters: (filters: any) => void; // Función para actualizar los valores de los filtros
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, applyFilters, filters, setFilters }) => {
  const handleApplyFilters = () => {
    applyFilters(filters);
    onClose(); // Cerrar el modal después de aplicar los filtros
  };

  const handleClearFilters = () => {
    const clearedFilters = Object.keys(filters).reduce<{ [key: string]: any; }>((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});
    setFilters(clearedFilters);
    applyFilters({}); // Aplicar los filtros vacíos
    onClose(); // Cerrar el modal después de limpiar los filtros
  };

  const handleChangeFilter = (filterName: string, value: number) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <IonModal isOpen={isOpen}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filtros</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>

          <Filter
            label="Inmuebles"
            options={["Casa", "Departamento", "Oficina", "Terreno", "Lote", "Comercial", "Estacionamiento"] as Property.PropertyType[]}
            selectedValue={filters.type}
            onChange={(value) => handleChangeFilter('type', value)}
          />

          <Filter
            label="Operación"
            options={["Alquiler", "Venta"] as Property.TransactionType[]}
            selectedValue={filters.transaction}
            onChange={(value) => handleChangeFilter('transaction', value)}
          />


          <Filter
            label="Dormitorios"
            options={[0, 1, 2, 3, 4, 5]}
            selectedValue={filters.bedrooms}
            onChange={(value) => handleChangeFilter('bedrooms', value)}
          />
          <Filter
            label="Baños"
            options={[
              {
                '0': 0
              },
              {
                '1': 1
              },
              {
                '2': 2
              },
              {
                '3': 3
              },
              {
                '4': 4
              },
              {
                '5 o más': 5
              }
            ]}
            selectedValue={filters.bathrooms}
            onChange={(value) => handleChangeFilter('bathrooms', value)}
          />

          <Filter
            label="Estacionamientos"
            options={[0, 1, 2, 3, 4, 5]}
            selectedValue={filters.parkingSpaces}
            onChange={(value) => handleChangeFilter('parkingSpaces', value)}
          />

          <Filter
            label="Maletero"
            options={['Si', 'No']}
            selectedValue={filters.storageRoom}
            onChange={(value) => handleChangeFilter('storageRoom', value)}
          />

          <Filter
            label="Metros cuadrado"
            options={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]}
            selectedValue={filters.squareMeters}
            onChange={(value) => handleChangeFilter('squareMeters', value)}
          />

          {/*    <PriceRangeFilter
            label="Rango de precio" // Etiqueta del filtro
            min={0} // Valor mínimo del rango de precio
            max={150000} // Valor máximo del rango de precio
            onChange={(value) => {
              handleChangeFilter('lowerPriceRange', value.lower);
              handleChangeFilter('upperPriceRange', value.upper);
            }}
          /> */}
          {/* Agregar más filtros según sea necesario */}
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonGrid >
            <IonRow>
              <IonCol size="8">
                <IonButton color="medium" onClick={handleClearFilters}>Limpiar</IonButton>
              </IonCol>
              <IonCol size="2">
                <IonButton color="primary" onClick={handleApplyFilters}>Aplicar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default FilterModal;
