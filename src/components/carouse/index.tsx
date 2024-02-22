import React from 'react';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './index.css';


interface CarouselProps {
  images: Array<string>;
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {

  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <>
    <Swiper 
      grabCursor={true}
      pagination={true} 
      modules={[Pagination]} 
      className="mySwiper">
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img loading='lazy' src={image} alt={`Slide ${index}`} className='carousel-image' onClick={handleOpenModal} />
        </SwiperSlide>
      ))}
    </Swiper>
        <IonModal isOpen={isModalOpen} onDidDismiss={() => setIsModalOpen(false)} onWillDismiss={() => setIsModalOpen(false)} className="custom-modal">
        <IonHeader>
            <IonToolbar>
              <IonTitle>Fotos</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setIsModalOpen(false)}>X</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
          <Swiper 
            grabCursor={true}
            pagination={true} 
            modules={[Pagination]} 
            className="expandedSwiper">
            {images.map((image, index) => (
              <SwiperSlide key={index} className=''>
                <img loading='lazy' src={image} alt={`Slide ${index}`} />
              </SwiperSlide>
            ))}
          </Swiper>
          </IonContent>
        </IonModal>

    </>
  );
};

export default Carousel;
