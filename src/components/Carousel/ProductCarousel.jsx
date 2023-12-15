import React, { useEffect } from "react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const ProductCarousel = (props) => {
  useEffect(() => {
    console.log("Carousel", props);
  }, []);
  return (
    <section className="w-full overflow-hidden my-4">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        // navigation
        pagination={{ clickable: true }}
        className="w-screen lg:w-full homeslider px-4 rounded-md lg:h-[70vh] "
        loop={true}
        autoplay={true}
      >
        {props?.images?.map((image) => (
          <SwiperSlide className="min-h-[180px] w-auto rounded-md ">
            <img
              className="h-auto w-auto rounded-md object-contain object-center aspect-square"
              src={
                image?.url ||
                "https://images.pexels.com/photos/3266700/pexels-photo-3266700.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              }
              alt={image?.alt || "product image"}
            />
          </SwiperSlide>
        ))}
        {(!props?.images || props?.images?.length == 0) && (
          <SwiperSlide className="min-h-[180px] w-auto rounded-md ">
            <img
              className="h-auto w-auto rounded-md object-contain object-center aspect-square"
              src="https://placehold.co/600x400?text=No+Images+Found&font=Poppins"
              alt="no product  found"
            />
          </SwiperSlide>
        )}
      </Swiper>
    </section>
  );
};

export default ProductCarousel;
