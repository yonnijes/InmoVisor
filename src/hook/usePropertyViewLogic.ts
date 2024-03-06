import { useEffect, useState } from 'react';
import { Property } from '../models';

interface AppliedFilters {
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  lowerPriceRange?: number;
  upperPriceRange?: number;
  type?: Property.PropertyType;
  transaction?: Property.TransactionType;
  parkingSpaces?: number;
  storageRoom?: string | number | undefined;
}


export const usePropertyViewLogic = () => {
  const [properties, setProperties] = useState<Property.Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [filters, setFilters] = useState<AppliedFilters>({
    bedrooms: 0,
    bathrooms: 0,
    squareMeters: 0,
    lowerPriceRange: 0,
    upperPriceRange: 0,
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


  const applyFilters = (appliedFilters: AppliedFilters) => {


    const savedData = localStorage.getItem('properties');
    const properties: Property.Property[] = savedData ? JSON.parse(savedData) : [];

    // Filtrar las propiedades en función de los filtros aplicados
    const filteredProperties = properties.filter(property => {
      // Verificar si se han aplicado filtros y si la propiedad cumple con esos filtros
      if (appliedFilters.bedrooms && property.bedrooms !== appliedFilters.bedrooms) {
        return false;
      }

      if (appliedFilters.bathrooms && property.bathrooms !== appliedFilters.bathrooms && !(appliedFilters.bathrooms == 5 && property.bathrooms >= 5)) {
        console.log(property.bathrooms);
        return false;
      }



      if (appliedFilters.squareMeters && property.squareMeters !== appliedFilters.squareMeters) {
        return false;
      }
      if (appliedFilters.lowerPriceRange && property.price < appliedFilters.lowerPriceRange) {
        return false;
      }
      if (appliedFilters.upperPriceRange && property.price > appliedFilters.upperPriceRange) {
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
      if (appliedFilters.storageRoom !== undefined && appliedFilters.storageRoom !== 0 && property.storageRoom !== storageRoomBoolean) {
        return false;
      }


      // Agregar más condiciones para otros filtros si es necesario

      // Si la propiedad pasa todos los filtros, devolver true
      return true;
    });

    // Actualizar el estado de las propiedades filtradas
    setProperties(filteredProperties);
  };


  const applySearchText = (properties:Property.Property[], text: string):Property.Property[]  => {
   
    const filteredProperties = text
      ? properties.filter((property: Property.Property) =>
        property.address.toLowerCase().includes(text.toLowerCase()) ||
        property.type.toLowerCase().includes(text.toLowerCase()) ||
        property.description?.toLowerCase().includes(text.toLowerCase())
      )
      : properties;


    return filteredProperties;
  }

  useEffect(() => {
    const values = Object.values(filters);
    const count = values.filter(value => typeof value === "number" && value > 0 || typeof value === "string" && value !== "").length;
    setCountFilters(count);

  }, [filters]);

  useEffect(() => {
    // Filtrar propiedades en función del searchText
    const propertiesSearched =  applySearchText(properties,searchText);
    setProperties(propertiesSearched);

  }, [searchText]);

  return {
    properties,
    searchText,
    isModalOpen,
    countFilters,
    filters,
    setProperties,
    setSearchText,
    handleOpenModal,
    handleCloseModal,
    applyFilters,
    setFilters
  };
};
