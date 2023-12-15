import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DisplayPrice from "../Utils/DisplayPrice";

import { openMessage } from "../../redux/actions/client";
import { Card } from "antd";
const ChildCard = ({ product }) => {
  console.log(product?.node?.id);
  const [favorite, setFavorite] = useState(product?.node?.isFavorite || false);
  const messageOpen = useSelector((state) => state?.client?.messageOpen);
  const [logged, setLogged] = useState(localStorage.getItem("vjw-user"));
  const dispatch = useDispatch();

  return (
    <>
      <Card className='flex flex-col items-stretch justify-start w-full min-h-10 shadow-md rounded-md  border-2 scale-95 mb-2 products md:min-h-30 hover:-translate-y-2 duration-200'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='w-full p-2'
        >
          <div className='productCardTop w-full flex  items-center justify-between'>
            {product?.node?.tags ? (
              <h4
                className={
                  "productTag  py-1 px-2 text-white bg-[#E5B02A] rounded-md text-xs " +
                  product?.node?.tags?.toLowerCase()
                }
              >
                {product?.node?.tags?.toUpperCase()}
              </h4>
            ) : (
              <div></div>
            )}
          </div>
          <Link
            to={"/dashboard/b2b/products/" + product?.node?.id}
            className='productImage flex items-center justify-center '
          >
            <img
              src={
                product?.node?.thumbnail?.url ||
                "http://goldclub.co/logo_nav.png"
              }
              alt={product?.node?.name}
              className='w-full h-40 object-fit aspect-video'
            />
          </Link>
          <Link
            to={"/dashboard/b2b/products/" + product?.node?.id}
            className='productDetails flex flex-col w-full md:items-center md:justify-center items-start justify-start mt-4 px-2 hover:text-black'
          >
            <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Name</h4>
              <h4 className=' text-md font-semibold'>{product?.node?.name}</h4>
            </div>
            {/* <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Price</h4>
              <h4 className='text-md font-semibold'>
                <DisplayPrice
                  price={
                    product?.node?.pricing?.priceRange?.start?.net?.amount || 0
                  }
                />
              </h4>
            </div>
            <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Purity</h4>
              <h4 className='text-md font-semibold'>
                {product?.node?.attributes?.filter(
                  (attr) =>
                    attr?.attribute.slug?.includes("gold-carat") ||
                    attr?.attribute.slug?.includes("silver-carat") ||
                    attr?.attribute.slug?.includes("platinum-carat")
                )[0]?.values[0]?.name || "Unavailable"}
              </h4>
            </div> */}
            <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Category</h4>
              <h4 className=' text-md font-semibold'>
                {product?.node?.category?.name}
              </h4>
            </div>
            {/* <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Parent Product</h4>
              <h4 className=' text-md font-semibold'>
                {product?.node?.attributes &&
                  product?.node?.attributes[18]?.values[0]?.name}
              </h4>
            </div> */}
            {/* <div className='w-full flex items-center justify-between '>
              <h4 className='font-bold text-md'>Weight</h4>
              <h4 className='text-md font-semibold'>
                {product?.node?.attributes?.filter((attr) =>
                  attr?.attribute.slug?.includes("net-weight")
                )[0]?.values[0]?.name || "Unavailable"}
              </h4>
            </div> */}
          </Link>
        </motion.div>
      </Card>
    </>
  );
};

export default ChildCard;
