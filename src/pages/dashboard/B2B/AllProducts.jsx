import React, { useEffect, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Card, Divider, Empty, List, Skeleton, message, FloatButton } from "antd";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SearchComponent from "../../../components/Inputs/Search";
import SectionTitle from "../../../components/Title/SectionTitle";
import ProductCard from "../../../components/Products/ProductCard";
import SelectComponent from "../../../components/Inputs/Select";

import {
  CATEGORIES_LIST, 
  GET_ALL_PARENT_PRODUCTS
} from "../../../GraphQl/Query";


const AllProducts = () => {
  const [messageApi] = message.useMessage();

  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const [searchTerm, setSearchTerm] = useState(null);
  const [page, setPage] = useState({
    hasPreviousPage: false, hasNextPage: true
  })
  const [productList, setProductList] = useState([]);
  const [cursor, setCursor] = useState({});

  const [categoryList, setCatgeoryList] = useState();
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] =useState();
  const [getCategoriesList] = useLazyQuery(CATEGORIES_LIST, {
    variables:{
      "first":100,
      "sort": {
        "direction": "ASC",
        "field": "NAME"
      }
    },
    onCompleted: (data) => {
      setCatgeoryList(data);
      console.log(data)
    },
    onError: (err) => {
      setError(err.message);
    }
  });

  const [initialLoad, load] = useLazyQuery(GET_ALL_PARENT_PRODUCTS, {
    onCompleted: (data) => {
      setProductList(data?.products?.edges);
      let pageInfo = data?.products?.pageInfo;
      setCursor({eCursor: pageInfo.endCursor});
      setPage({hasPreviousPage: pageInfo.hasPreviousPage, hasNextPage: pageInfo.hasNextPage});
      getCategoriesList();
    },
    onError: (err) => {
      setError("Unable to retrieve products");
    },
  });

  const [getAllProducts, products] = useLazyQuery(GET_ALL_PARENT_PRODUCTS, {
    onCompleted: (data) => {
      setProductList(data?.products?.edges);
      let pageInfo = data?.products?.pageInfo;
      setCursor({sCursor: pageInfo.startCursor, eCursor: pageInfo.endCursor});
      setPage({hasPreviousPage: pageInfo.hasPreviousPage, hasNextPage: pageInfo.hasNextPage});
    },
    onError: (err) => {
      setError("Unable to retrieve products");
    },
  });

useEffect(() => {
  initialLoad({
    variables: {
      first: 20,
      filter: {
        attributes: [
          {
            slug: "parent-product-id",
            value: 0
          }
        ]
      },
      sort: {
        direction: "ASC",
        field: "NAME"
      }
    }
  });
}, []);
  
  const handleSearch = (e) => {
    console.log("Search Triggered", e?.target?.value);
    const val = e?.target?.value?.toLowerCase();
    setSearchTerm(val);
    getAllProducts({
      variables: {
        first: 20,
        filter: {
          search: searchTerm,
          attributes: [
            {
              slug: "parent-product-id",
              value: 0
            }
          ]
        },
        sort: {
          direction: "ASC",
          field: "NAME"
        }
      }
    });
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
      <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
        <section className='w-full px-[30px] my-4 flex gap-4 flex-wrap justify-between'>
          
          <SearchComponent handleSearch={handleSearch} className="w-[50%]"/>
          <div className="flex w-[50%] gap-4">
            <SelectComponent
              placeholder='Select category'
              options={categoryList?.categories?.edges?.map((edge) => {
                return {
                  value: edge?.node?.name,
                  label: edge?.node?.name
                };
              })}
              handleChange={(e) => {
                const selectedCategory = categoryList?.categories?.edges?.find((edge) => edge.node.name === e);
                setSubcategoryList(selectedCategory?.node?.children || []);
                console.log(selectedCategory?.node?.children)
              }} className="w-3/10"
            />
            <SelectComponent
              placeholder='Select subcategory'
              options={subcategoryList?.edges?.map((edge) => ({
                value: edge.node.id,
                label: edge.node.name
              }))}
              handleChange={(selectedValue) => {
                console.log(selectedValue);
                setSelectedCategory(selectedValue);
                getAllProducts({
                  variables: {
                    first: 20,
                    filter: {
                      categories: selectedValue,
                      attributes: [
                        {
                          slug: "parent-product-id",
                          value: 0
                        }
                      ]
                    },
                    sort: {
                      direction: "ASC",
                      field: "NAME"
                    }
                  }
                });
              }} className="w-3/10"
            />
          </div> 
        </section>
      </motion.div>
    
      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4 '>
        {products?.loading &&
          Array(6)?.fill(0)?.map((item) => (
              <Card className='w-full md:w-[45%] lg:w-[30%] scale-95 flex flex-col gap-y-2'>
                <Skeleton.Image active={true} className='w-full' />
                <div className='mt-2'>
                  <Skeleton active />
                </div>
              </Card>
            ))}
        {!products?.loading && (
          <>
            {productList?.length === 0 ? (
              <Empty description={<span className='dark:text-white'>No data available</span>} />
            ) : (
              <List
                grid={{
                  gutter: 12,
                  xs: 1,
                  sm: 2,
                  md: 2,
                  lg: 3,
                  xl: 4,
                }}
                className='w-full'
                dataSource={productList || []}
                renderItem={(product) => <ProductCard product={product} />}
              />
            )}
          </>
        )}
      </section>
      <section className='px-4 flex justify-center '>
        <div class="w-full flex justify-between">
        {page.hasPreviousPage ? (<FloatButton icon={<AiOutlineArrowLeft />} type="primary"
              onClick={() => {
                getAllProducts({
                  variables: {
                    first: 0,
                    last: 20,
                    before: cursor.sCursor,
                    filter: {
                      attributes: [
                        {
                          slug: "parent-product-id",
                          value: 0
                        }
                      ]
                    },
                    search: searchTerm,
                    sort: {
                      direction: "ASC",
                      field: "NAME"
                    }
                  }
                })
              }}
              style={{right: 120}}
              />)
              : (<FloatButton icon={<AiOutlineArrowLeft />} type="primary" disabled={true} style={{right: 120 }}/>)
                }
              {page.hasNextPage ? (<FloatButton icon={<AiOutlineArrowRight />} type="primary"
                  onClick={() => {
                    getAllProducts({
                      variables: {
                        first: 20,
                        after: cursor.eCursor,
                        filter: {
                          attributes: [
                            {
                              slug: "parent-product-id",
                              value: 0
                            }
                          ]
                        },
                        search: searchTerm,
                        sort: {
                          direction: "ASC",
                          field: "NAME"
                        }
                      }
                    })
                  }}
                  style={{right: 60}}
              />)
              : (<FloatButton icon={<AiOutlineArrowRight />} type="primary" disabled style={{right: 60}}/>)
          }
        </div>
      </section>
    </section>
  );
};

export default AllProducts;