import React from 'react';
import { IonModal, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonFooter } from '@ionic/react';
import Filter from '../filter';
import { Property } from '../../models';
import './index.css';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  applyFilters: (filters: any) => void;
  filters: any;
  setFilters: (filters: any) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, applyFilters, filters, setFilters }) => {
  const handleApplyFilters = () => {
    applyFilters(filters);
    onClose();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      bedrooms: 0,
      bathrooms: 0,
      squareMeters: 0,
      lowerPriceRange: 0,
      upperPriceRange: 0,
      type: '',
      transaction: '',
      parkingSpaces: 0,
      storageRoom: undefined,
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
    onClose();
  };

  const handleChangeFilter = (filterName: string, value: any) => {
    setFilters({ ...filters, [filterName]: value });
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Filtros</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="filter-modal__content">
        <div className="filter-section-title">Ordenar por</div>
        <div className="filter-sort-options">
          <button
            className={`filter-sort-option ${sortOrder === 'newest' ? 'is-active' : ''}`}
            onClick={() => setSortOrder('newest')}
          >
            Más recientes
          </button>
          <button
            className={`filter-sort-option ${sortOrder === 'price-asc' ? 'is-active' : ''}`}
            onClick={() => setSortOrder('price-asc')}
          >
            Precio: menor a mayor
          </button>
          <button
            className={`filter-sort-option ${sortOrder === 'price-desc' ? 'is-active' : ''}`}
            onClick={() => setSortOrder('price-desc')}
          >
            Precio: mayor a menor
          </button>
          <button
            className={`filter-sort-option ${sortOrder === 'sqm-desc' ? 'is-active' : ''}`}
            onClick={() => setSortOrder('sqm-desc')}
          >
            Mayor m²
          </button>
          <button
            className={`filter-sort-option ${sortOrder === 'sqm-asc' ? 'is-active' : ''}`}
            onClick={() => setSortOrder('sqm-asc')}
          >
            Menor m²
          </button>
        </div>

        <div className="filter-section-title">Filtros</div>
        <Filter
          label="Inmuebles"
          options={["Casa", "Departamento", "Oficina", "Terreno", "Lote", "Comercial", "Estacionamiento"] as Property.PropertyType[]}
          selectedValue={filters.type || undefined}
          onChange={(value) => handleChangeFilter('type', value)}
        />

        <Filter
          label="Operación"
          options={["Alquiler", "Venta"] as Property.TransactionType[]}
          selectedValue={filters.transaction || undefined}
          onChange={(value) => handleChangeFilter('transaction', value)}
        />

        <Filter
          label="Dormitorios"
          options={[0, 1, 2, 3, 4, 5]}
          selectedValue={filters.bedrooms || undefined}
          onChange={(value) => handleChangeFilter('bedrooms', value)}
        />

        <Filter
          label="Baños"
          options={[
            { '0': 0 },
            { '1': 1 },
            { '2': 2 },
            { '3': 3 },
            { '4': 4 },
            { '5 o más': 5 }
          ]}
          selectedValue={filters.bathrooms || undefined}
          onChange={(value) => handleChangeFilter('bathrooms', value)}
        />

        <Filter
          label="Estacionamientos"
          options={[0, 1, 2, 3, 4, 5]}
          selectedValue={filters.parkingSpaces || undefined}
          onChange={(value) => handleChangeFilter('parkingSpaces', value)}
        />

        <Filter
          label="Maletero"
          options={['Si', 'No']}
          selectedValue={filters.storageRoom}
          onChange={(value) => handleChangeFilter('storageRoom', value)}
        />

        <Filter
          label="Metros cuadrados"
          options={[0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500]}
          selectedValue={filters.squareMeters || undefined}
          onChange={(value) => handleChangeFilter('squareMeters', value)}
        />
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <div className="filter-modal__footer-actions">
            <IonButton className="filter-modal__btn" color="medium" fill="outline" onClick={handleClearFilters}>Limpiar</IonButton>
            <IonButton className="filter-modal__btn" color="primary" onClick={handleApplyFilters}>Aplicar</IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default FilterModal;
