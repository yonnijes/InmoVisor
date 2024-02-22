// Filter.tsx
import React from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';

interface FilterProps {
  label: string;
  options: number[] | string[];
  selectedValue: number;
  onChange: (value: number) => void;
}

const Filter: React.FC<FilterProps> = ({ label, options, selectedValue, onChange }) => {
  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      <IonSelect value={selectedValue} onIonChange={e => onChange(e.detail.value)} label="seleccionar">
        {options.map(option => (
          <IonSelectOption key={option} value={option}>
            {option}
          </IonSelectOption>
        ))}
      </IonSelect>
    </IonItem>
  );
};

export default Filter;
