// FilterModal.tsx
import React from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonGrid, IonRow, IonCol } from '@ionic/react';
import Filter from '../filter';

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
            label="Dormitorios"
            options={[0, 1, 2, 3, 4, 5]}
            selectedValue={filters.bedrooms}
            onChange={(value) => handleChangeFilter('bedrooms', value)}
          />
          <Filter
            label="Baños"
            options={[0, 1, 2, 3, 4, 5]}
            selectedValue={filters.bathrooms}
            onChange={(value) => handleChangeFilter('bathrooms', value)}
          />

          <Filter
            label="Metros cuadrado"
            options={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]}
            selectedValue={filters.squareMeters}
            onChange={(value) => handleChangeFilter('squareMeters', value)}
          />
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
