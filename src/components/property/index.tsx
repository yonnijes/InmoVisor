import React, { useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonText, IonButton, IonList, IonItem, IonLabel, IonTitle } from '@ionic/react';
import { Property } from '../../models'; // Importa la interfaz desde otro archivo
import Carousel from '../carouse';
import WhatsAppButton from '../whatsapp-button';

interface PropertyComponentProps {
  property: Property.Property
}

const PropertyComponent: React.FC<PropertyComponentProps> = ({ property }) => {
  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>{`${property.type} en ${property.transaction}`}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <p>{property.condition}</p>
        <p>{property.address}</p>
        <p><strong>{property.money} {property.price}</strong> </p>
        <p>
          {property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''} | &nbsp;
          {property.bathrooms} Baño{property.bathrooms > 1 ? 's' : ''} 
          {property?.parkingSpaces! > 0 && ` | ${property.parkingSpaces} Estacionamiento${property.parkingSpaces! > 1 ? 's' : ''}`}
        </p>
        <p>{property.squareMeters} m<sup>2</sup></p>
        <Carousel images={property.image} />
        {showMore && (
          <>
            <p style={{ textAlign: 'left', padding: '5px' }}>
              <IonText  >
                {property.description}
              </IonText>
            </p>

            <div>
              {property.amenities &&
                <>
                  <IonText>
                    <strong>Caracteristocas destacadad:</strong>
                  </IonText>
                  <ul>
                    {property.amenities?.map((amenity, index) => (
                      <li key={index}>
                        <IonLabel>{amenity}</IonLabel>
                      </li>

                    ))}
                  </ul>
                </>}

            </div>

            <div>
              {property.constructionYear &&

                <IonText>
                  {property.constructionYear} <strong>Año de construcción</strong>
                </IonText>
              }
            </div>

            <div>
              {property.phoneContact &&
                <WhatsAppButton phoneNumber={property.phoneContact} />
              }
            </div>
          </>
        )}
        <IonButton expand="block" fill="clear" onClick={handleShowMore} color="secondary">
          {showMore ? 'Ver menos' : 'Ver más'}
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default PropertyComponent;
