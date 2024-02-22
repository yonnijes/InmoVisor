import { useEffect, useState } from 'react';
import { Property } from '../models';

export const usePropertyViewLogic = () => {
  const [propertys, setPropertys] = useState<Property.Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [filters, setFilters] = useState<Record<string, unknown>>({
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    lowerpriceRange: 0,
    upperpriceRange: 0,
    type: '' as Property.PropertyType,
    transaction: '' as Property.TransactionType,
    parkingSpaces: 0,
    storageRoom: undefined,
  });


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
      if (appliedFilters.lowerpriceRange && property.price < appliedFilters.lowerpriceRange) {
        return false;
      }
      if (appliedFilters.upperpriceRange && property.price > appliedFilters.upperpriceRange) {
        return false;
      }
      if (appliedFilters.type && property.type !== appliedFilters.type) {
        return false;
      }

      if (appliedFilters.transaction && property.transaction !== appliedFilters.transaction) {
        return false;
      }

      if (appliedFilters.parkingSpaces && property.parkingSpaces !== appliedFilters.parkingSpaces) {
        return false;
      }
      const storageRoomBoolean = appliedFilters.storageRoom === 'Si' ? true : false;
      if (appliedFilters.storageRoom !== undefined && property.storageRoom === storageRoomBoolean) {
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
    const values = Object.values(filters);
    const count = values.filter(value => typeof value === "number" && value > 0 || typeof value === "string" && value !== "").length;
    setCountFilters(count);

  }, [filters]);

  return {
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
  };
};
