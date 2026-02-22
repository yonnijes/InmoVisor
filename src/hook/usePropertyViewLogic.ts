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

type SortOrder = 'price-asc' | 'price-desc' | 'newest' | 'sqm-desc' | 'sqm-asc';

const FILTERS_STORAGE_KEY = 'property_filters';
const SORT_STORAGE_KEY = 'property_sort_order';

const defaultFilters: AppliedFilters = {
  bedrooms: 0,
  bathrooms: 0,
  squareMeters: 0,
  lowerPriceRange: 0,
  upperPriceRange: 0,
  type: '' as Property.PropertyType,
  transaction: '' as Property.TransactionType,
  parkingSpaces: 0,
  storageRoom: undefined,
};

export const usePropertyViewLogic = () => {
  const [allProperties, setAllProperties] = useState<Property.Property[]>([]);
  const [properties, setPropertiesState] = useState<Property.Property[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [countFilters, setCountFilters] = useState<number>(0);
  const [filters, setFilters] = useState<AppliedFilters>(() => {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    if (!raw) return defaultFilters;
    try {
      const parsed = JSON.parse(raw) as AppliedFilters;
      return { ...defaultFilters, ...parsed };
    } catch {
      return defaultFilters;
    }
  });
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    return (localStorage.getItem(SORT_STORAGE_KEY) as SortOrder) || 'newest';
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const applyFiltersFn = (source: Property.Property[], appliedFilters: AppliedFilters): Property.Property[] => {
    return source.filter(property => {
      if (appliedFilters.bedrooms && property.bedrooms !== appliedFilters.bedrooms) return false;

      if (appliedFilters.bathrooms && property.bathrooms !== appliedFilters.bathrooms && !(appliedFilters.bathrooms === 5 && property.bathrooms >= 5)) {
        return false;
      }

      if (appliedFilters.squareMeters && property.squareMeters !== appliedFilters.squareMeters) return false;
      if (appliedFilters.lowerPriceRange && property.price < appliedFilters.lowerPriceRange) return false;
      if (appliedFilters.upperPriceRange && property.price > appliedFilters.upperPriceRange) return false;
      if (appliedFilters.type && property.type !== appliedFilters.type) return false;
      if (appliedFilters.transaction && property.transaction !== appliedFilters.transaction) return false;
      if (appliedFilters.parkingSpaces && property.parkingSpaces !== appliedFilters.parkingSpaces) return false;

      const storageRoomBoolean = appliedFilters.storageRoom === 'Si' ? true : false;
      if (appliedFilters.storageRoom !== undefined && appliedFilters.storageRoom !== 0 && property.storageRoom !== storageRoomBoolean) {
        return false;
      }

      return true;
    });
  };

  const applySearchFn = (source: Property.Property[], text: string): Property.Property[] => {
    if (!text) return source;
    const t = text.toLowerCase();
    return source.filter((property) =>
      property.address?.toLowerCase().includes(t) ||
      property.type?.toLowerCase().includes(t) ||
      property.description?.toLowerCase().includes(t)
    );
  };

  const applySortFn = (source: Property.Property[], order: SortOrder): Property.Property[] => {
    const cloned = [...source];
    switch (order) {
      case 'price-asc':
        return cloned.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return cloned.sort((a, b) => b.price - a.price);
      case 'sqm-asc':
        return cloned.sort((a, b) => a.squareMeters - b.squareMeters);
      case 'sqm-desc':
        return cloned.sort((a, b) => b.squareMeters - a.squareMeters);
      case 'newest':
      default:
        return cloned.sort((a, b) => {
          const aNum = parseInt(String(a.id).replace(/\D/g, ''), 10) || 0;
          const bNum = parseInt(String(b.id).replace(/\D/g, ''), 10) || 0;
          return bNum - aNum;
        });
    }
  };

  const recalculate = (source = allProperties, currentFilters = filters, currentSearch = searchText, currentSort = sortOrder) => {
    const filtered = applyFiltersFn(source, currentFilters);
    const searched = applySearchFn(filtered, currentSearch);
    const sorted = applySortFn(searched, currentSort);
    setPropertiesState(sorted);
  };

  const setProperties = (incoming: Property.Property[]) => {
    setAllProperties(incoming);
  };

  const applyFilters = (appliedFilters: AppliedFilters) => {
    setFilters(appliedFilters);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const values = Object.values(filters);
    const count = values.filter(value => (typeof value === 'number' && value > 0) || (typeof value === 'string' && value !== '')).length;
    setCountFilters(count);
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem(SORT_STORAGE_KEY, sortOrder);
  }, [sortOrder]);

  useEffect(() => {
    recalculate();
  }, [allProperties, filters, searchText, sortOrder]);

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
    setFilters,
    sortOrder,
    setSortOrder,
  };
};
