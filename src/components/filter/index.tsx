// Filter.tsx
import React from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';

interface FilterProps {
  label: string;
  options: number[] | string[] | Record<string, unknown>[];
  selectedValue: any;
  onChange: (value: any) => void;
}

const Filter: React.FC<FilterProps> = ({ label, options, selectedValue, onChange }) => {
  return (
    <IonItem className="filter-item" lines="full">
      <IonLabel className="filter-item__label">{label}</IonLabel>
      <IonSelect
        interface="popover"
        placeholder="Cualquiera"
        value={selectedValue}
        onIonChange={e => onChange(e.detail.value)}
        className="filter-item__select"
      >
        {options.map(option => {
          const key = typeof option === 'object' ? Object.keys(option)[0] : option;
          const value = typeof option === 'object' ? Object.values(option)[0] : option;
          return (
            <IonSelectOption key={key} value={value}>
              {key}
            </IonSelectOption>
          );
        })}
       
      </IonSelect>
    </IonItem>
  );
};

export default Filter;
