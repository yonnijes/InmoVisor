// Filter.tsx
import React from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';

interface FilterProps {
  label: string;
  options: number[] | string[] | Record<string, unknown>[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const Filter: React.FC<FilterProps> = ({ label, options, selectedValue, onChange }) => {
  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      <IonSelect value={selectedValue} onIonChange={e => onChange(e.detail.value)} label="seleccionar">
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
