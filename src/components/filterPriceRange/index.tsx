// PriceRangeFilter.tsx
import React from 'react';
import { IonItem, IonLabel, IonRange } from '@ionic/react';

interface PriceRangeFilterProps {
  label: string;
  min: number;
  max: number;
  onChange: (value: { lower: number; upper: number }) => void;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({ label, min, max, onChange }) => {
  return (
    <IonItem>
      <IonLabel>{label}</IonLabel>
      <IonRange
        dualKnobs={true}
        min={min}
        max={max}
        pin={true}
        onIonChange={e => onChange(e.detail.value as { lower: number; upper: number })}
        aria-label={label}
      />
    </IonItem>
  );
};

export default PriceRangeFilter;
