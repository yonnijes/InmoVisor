import { IonButton } from '@ionic/react';

interface WhatsAppButtonProps { 
    phoneNumber: string;
}


const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({phoneNumber}) => {
  // Número de teléfono al que enviar el mensaje de WhatsApp

  // URL de WhatsApp con el número de teléfono y el mensaje (opcional)
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}`;

  return (
    <IonButton href={whatsappUrl} target="_blank" color="success">
      Abrir WhatsApp
    </IonButton>
  );
};

export default WhatsAppButton;
