import React, { useRef, useEffect } from 'react';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';
import './index.css';


interface CarouselProps {
  images: Array<string>;
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (swiperRef.current) {
      new Swiper(swiperRef.current, {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    }
  }, []);

  return (
    <div className="swiper-container" ref={swiperRef}>
      <div className="swiper-wrapper">
        {images.map((image, index) => (
          <div className="swiper-slide" key={index}>
            <img loading='lazy'  src={image} alt={`Slide ${index}`} className='carousel-image' />
          </div>
        ))}
      </div>
      <div className="swiper-pagination"></div>
    </div>
  );
};

export default Carousel;
