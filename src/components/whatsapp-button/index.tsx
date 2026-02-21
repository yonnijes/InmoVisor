import { IonButton } from '@ionic/react';

interface WhatsAppButtonProps { 
  phoneNumber: string;
  propertyId?: string;
  propertyType?: string;
  propertyAddress?: string;
  propertyPrice?: number;
  propertyMoney?: string;
}

const formatCurrency = (money: string | undefined, price: number | undefined) => {
  const amount = Number(price || 0).toLocaleString('es-CL');
  if (money === 'USD' || money === '$') return `$ ${amount}`;
  if (money === 'EUR') return `€ ${amount}`;
  if (money === 'Bs') return `Bs ${amount}`;
  return `${money || ''} ${amount}`.trim();
};

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber,
  propertyId,
  propertyType,
  propertyAddress,
  propertyPrice,
  propertyMoney,
}) => {
  const text = `Hola 👋, me interesa esta propiedad${propertyId ? ` (${propertyId})` : ''}: ${propertyType || 'Inmueble'} en ${propertyAddress || 'ubicación por confirmar'} por ${formatCurrency(propertyMoney, propertyPrice)}. ¿Sigue disponible?`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(text)}`;

  return (
    <IonButton href={whatsappUrl} target="_blank" color="success">
      Consultar por WhatsApp
    </IonButton>
  );
};

export default WhatsAppButton;
