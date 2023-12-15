import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Card, Divider, Empty, List, Skeleton, message } from "antd";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { CgArrowLongRight } from "react-icons/cg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchComponent from "../../../components/Inputs/Search";

import { GET_ALL_PRODUCTS, GET_ALL_PRODUCTS_PARENT_ID } from "../../../GraphQl/Query";

import Spinner from "../../../components/Spinner/Spinner";
import SectionTitle from "../../../components/Title/SectionTitle";
import ProductCard from "../../../components/Products/ProductCard";

const AllProducts = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const setTrial = (message) => {
    messageApi.open({
      type: "loading",
      content: message,
    });
  };
  const setSuccess = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const search = useSelector((state) => state.client.homeSearchOpen);
  const [searchParams, setSearchParams] = useSearchParams();
  const [after, setAfter] = useState(null);
  const [localList, setLocalList] = useState([]);
  const [localproduct, setLocalproduct] = useState([]);
  const [getAllProducts, products] = useLazyQuery(GET_ALL_PRODUCTS_PARENT_ID, {
    variables:{
  "first": 20,
  "filter": {
    "attributes": [
      {
        "slug": "parent-product-id",
        "value": 0
      }
    ],
    "categories": null,
    "collections": null,
    "isPublished": null,
    "price": null,
    "productTypes": null,
    "stockAvailability": null
  },
  "sort": {
    "direction": "ASC",
    "field": "NAME"
}
},
    onCompleted: (data) => {
      console.log(data);
      setLocalList(data?.products?.edges);
    },
    onError: (err) => {
      setError("Unable to retrieve products");
    },
  });
  const dispatch = useDispatch();

  // useEffect(() => {
  //   getAllProducts();
  //   console.log(searchParams?.get("search"));
  // }, []);
  useEffect(() => {
    getAllProducts();
  }, [searchParams]);
  const handleSearch = (e) => {
    const val = e?.target?.value?.toLowerCase();
    console.log(val);
    if (val !== "" || val !== undefined)
      setLocalList(
        products?.data?.products?.edges?.filter(
          (edge) =>
            edge?.node?.name?.toLowerCase()?.includes(val) ||
            edge?.node?.category?.name?.toLowerCase()?.includes(val)
        )
      );
    else setLocalList(products?.data?.products?.edges);
  };
  return (
    <section className='w-full flex flex-col  justify-center '>
      <div className="flex w-full items-center justify-between">
      <SectionTitle title='Products' />
      <Link to={"../add-product"} class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md">
          Add new product
      </Link>
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='w-full px-[10px] my-4 '>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <SearchComponent handleSearch={handleSearch} />
        </motion.div>
      </section>

      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4 '>
        {products?.loading &&
          Array(6)
            ?.fill(0)
            ?.map((item) => (
              // <ProductCard product={product} key={product?.node?.id} />
              <Card className='w-full md:w-[45%] lg:w-[30%] scale-95 flex flex-col gap-y-2'>
                <Skeleton.Image active={true} className='w-full' />
                <div className='mt-2'>
                  <Skeleton active />
                </div>
              </Card>
            ))}
        {!products?.loading && localList?.length == 0 && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}{" "}
        {!products?.loading && localList?.length > 0 && (
          <List
            grid={{
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 2,
              lg: 3,
              xl: 4,
            }}
            className='w-full'
            dataSource={localList.filter(
              (prod) => prod?.node?.attributes[18]?.values[0].name == 0
            )}
            renderItem={(product) => (
              <ProductCard product={product} key={product?.node?.id} />
            )}
          />
        )}
      </section>
    </section>
  );
};

export default AllProducts;
