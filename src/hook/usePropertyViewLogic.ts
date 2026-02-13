import { useEffect, useState, useCallback } from 'react';
import { Property } from '../models';

// (La interfaz AppliedFilters se mantiene igual)
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
  // --- Estados ---
  // Estado para la lista original de propiedades, sin filtros.
  const [originalProperties, setOriginalProperties] = useState<Property.Property[]>([]);
  // Estado para las propiedades mostradas en la UI (ya filtradas).
  const [properties, setProperties] = useState<Property.Property[]>([]);
  
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<AppliedFilters>({});

  // --- Lógica de Carga y Filtrado ---

  // Carga las propiedades desde localStorage.
  const loadPropertiesFromStorage = useCallback(() => {
    const savedData = localStorage.getItem('properties');
    const loadedProperties: Property.Property[] = savedData ? JSON.parse(savedData) : [];
    setOriginalProperties(loadedProperties);
  }, []);

  // Función que aplica TODOS los filtros y búsquedas en cadena.
  const applyAllFilters = useCallback(() => {
    let filtered = [...originalProperties];

    // 1. Aplicar filtro de búsqueda por texto
    if (searchText) {
      filtered = filtered.filter((property: Property.Property) =>
        property.address.toLowerCase().includes(searchText.toLowerCase()) ||
        property.type.toLowerCase().includes(searchText.toLowerCase()) ||
        property.description?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 2. Aplicar filtros del modal
    if (Object.keys(filters).length > 0) {
        filtered = filtered.filter(property => {
            if (filters.bedrooms && property.bedrooms !== filters.bedrooms) return false;
            if (filters.bathrooms && property.bathrooms !== filters.bathrooms && !(filters.bathrooms == 5 && property.bathrooms >= 5)) return false;
            if (filters.squareMeters && property.squareMeters !== filters.squareMeters) return false;
            if (filters.lowerPriceRange && property.price < filters.lowerPriceRange) return false;
            if (filters.upperPriceRange && property.price > filters.upperPriceRange) return false;
            if (filters.type && property.type !== filters.type) return false;
            if (filters.transaction && property.transaction !== filters.transaction) return false;
            if (filters.parkingSpaces && property.parkingSpaces !== filters.parkingSpaces) return false;
            if (filters.storageRoom && filters.storageRoom !== 'Indiferente') {
                const storageRoomBoolean = filters.storageRoom === 'Si';
                if (property.storageRoom !== storageRoomBoolean) return false;
            }
            return true;
        });
    }

    setProperties(filtered);
  }, [originalProperties, searchText, filters]);

  // --- Efectos (Lifecycle) ---

  // Carga inicial de propiedades
  useEffect(() => {
    loadPropertiesFromStorage();
  }, [loadPropertiesFromStorage]);

  // Re-aplica los filtros cuando cambia la lista original, el texto de búsqueda o los filtros del modal
  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);
  
  // Listener para cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'properties') {
        loadPropertiesFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadPropertiesFromStorage]);


  // --- Handlers para la UI ---
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const countFilters = Object.values(filters).filter(value => {
    if (typeof value === 'number' && value > 0) return true;
    if (typeof value === 'string' && value && value !== 'Indiferente') return true;
    return false;
  }).length;

  return {
    properties,
    searchText,
    isModalOpen,
    countFilters,
    filters,
    setSearchText,
    handleOpenModal,
    handleCloseModal,
    setFilters, // El modal ahora solo actualiza el estado de los filtros
  };
};
