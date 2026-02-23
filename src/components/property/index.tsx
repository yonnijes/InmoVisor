import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonButton, IonLabel } from '@ionic/react';
import { Property } from '../../models';
import Carousel from '../carouse';
import WhatsAppButton from '../whatsapp-button';
import './index.css';

interface PropertyComponentProps {
  property: Property.Property
}

const PropertyComponent: React.FC<PropertyComponentProps> = ({ property }) => {
  const [showMore, setShowMore] = useState(false);

  const formatCurrency = (money: string | undefined, price: number) => {
    const amount = Number(price || 0).toLocaleString('es-CL');
    if (money === 'USD' || money === '$') return `$ ${amount}`;
    if (money === 'EUR') return `€ ${amount}`;
    if (money === 'Bs') return `Bs ${amount}`;
    return `${money || ''} ${amount}`.trim();
  };

  return (
    <IonCard className="property-card">
      <IonCardHeader>
        <IonCardTitle className="property-card__title">{`${property.type} en ${property.transaction}`}</IonCardTitle>
      </IonCardHeader>

      <IonCardContent>
        <p>{property.address}</p>

        <div className="property-card__chips">
          {property.condition && <span className="property-chip property-chip--condition">{property.condition}</span>}
          <span className="property-chip property-chip--transaction">{property.transaction}</span>
        </div>

        <p className="property-card__price">{formatCurrency(property.money as unknown as string, property.price)}</p>

        <p className="property-card__meta">
          {property?.bedrooms! > 0 && `${property.bedrooms} Dormitorio${property.bedrooms > 1 ? 's' : ''} · `}
          {property?.bathrooms! > 0 && `${property.bathrooms} Baño${property.bathrooms > 1 ? 's' : ''} · `}
          {property?.parkingSpaces! > 0 && `${property.parkingSpaces} Estacionamiento${property.parkingSpaces! > 1 ? 's' : ''}`}
        </p>

        <p className="property-card__surface">
          {property.squareMeters} m²
          {property.landSquareMeters && ` · ${property.landSquareMeters} m² de terreno`}
          {property?.storageRoom && ' · Maletero'}
        </p>

        <Carousel images={property.image} />

        {showMore && (
          <div className="property-card__section">
            <p style={{ textAlign: 'left', padding: '5px 0' }}>
              <IonText>{property.description}</IonText>
            </p>

            {property.amenities && property.amenities.length > 0 && (
              <>
                <IonText><strong>Características destacadas:</strong></IonText>
                <ul className="property-card__list">
                  {property.amenities.map((amenity, index) => (
                    <li key={index}>
                      <IonLabel>{amenity}</IonLabel>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {property.constructionYear && (
              <IonText>
                {property.constructionYear} <strong>Año de construcción</strong>
              </IonText>
            )}

            {property.phoneContact && (
              <div className="property-card__whatsapp">
                <WhatsAppButton
                  phoneNumber={property.phoneContact}
                  propertyId={property.id}
                  propertyType={property.type}
                  propertyAddress={property.address}
                  propertyPrice={property.price}
                  propertyMoney={property.money as unknown as string}
                />
              </div>
            )}
          </div>
        )}

        <IonButton expand="block" fill="clear" onClick={() => setShowMore((v) => !v)} color="secondary" className="property-card__toggle">
          {showMore ? 'Ver menos' : 'Ver más'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default PropertyComponent;
