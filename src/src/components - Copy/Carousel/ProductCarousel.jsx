import React, { useEffect } from "react";
import { Navigation, Pagination, Scrollbar, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const ProductCarousel = (props) => {
  useEffect(() => {
    // console.log("Carousel", props);
  }, []);
  return (
    <section className="w-full overflow-hidden my-4">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        pagination={{ clickable: true }}
        className="w-screen lg:w-full homeslider px-4 rounded-md lg:h-[70vh] "
        loop={true}
        autoplay={true}
      >
        {props?.images?.map((image) => (
          <SwiperSlide key={image.id} className="min-h-[180px] w-auto rounded-md">
            <img
              className="h-auto w-auto rounded-md object-contain object-center aspect-square"
              src={
                image?.url || process.env.PUBLIC_URL + "/no-image.jpg"}
              alt={image?.alt || "product image"}
            />
          </SwiperSlide>
        ))}
        {(!props?.images || props?.images?.length === 0) && (
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
