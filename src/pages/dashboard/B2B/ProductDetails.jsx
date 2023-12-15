/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  GET_ALL_PRODUCTS_FILTERED,
  GET_PRODUCT_BY_ID,
} from "../../../GraphQl/Query";
import { QuestionCircleOutlined } from "@ant-design/icons";

import Spinner from "../../../components/Spinner/Spinner";
import SectionTitle from "../../../components/Title/SectionTitle";
import {
  Card,
  Divider,
  List,
  Skeleton,
  message,
  Checkbox,
  Col,
  Empty,
  Button,
  Modal,
} from "antd";
import { CgArrowLongRight } from "react-icons/cg";
import ProductCarousel from "../../../components/Carousel/ProductCarousel";
import DisplayPrice from "../../../components/Utils/DisplayPrice";
import { DELETE_PRODUCT } from "../../../GraphQl/Mutations";
import ChildCard from "../../../components/Products/ChildCard";

const DetailWrapper = (props) => {
  return (
    <div
      className={
        "flex flex-col items-start justify-start gap-y-1 my-3" +
        " " +
        props?.className
      }
    >
      <h2 className='font-semibold text-sm dark:text-slate-400'>
        {props?.query}
      </h2>
      <h3 className='font-semibold text-lg dark:text-slate-50 break-all'>
        {props?.value}
      </h3>

      {props?.children}
    </div>
  );
};
const DetailCheck = (props) => {
  return (
    <Col span={10} className='m-2'>
      {/* <Checkbox
        checked={props?.value == true ? true : false}
        className={
          "pointer-events-none min-w-[40%] lg:min-w-[30%] max-w-full" +
          " " +
          props?.className
        }
      ></Checkbox> */}
      <div class='flex items-start  '>
        <img
          src={
            process.env.PUBLIC_URL + props?.value == "true"
              ? "/tick.png"
              : "/remove.png"
          }
          alt={props?.value == "true" ? "true" : "false"}
          className='w-4 h-4 mr-2 mt-1'
        />

        <h5 className='text-sm w-full font-bold  dark:text-slate-400 pr-4'>
          {props?.title}
        </h5>
      </div>
    </Col>
  );
};
const ProductDetails = () => {
  const params = useParams();
  const [modalopen, setmodalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [localProducts, setLocalProducts] = useState(null);

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
  const navigate = useNavigate();
  const [getAllProducts, allProducts] = useLazyQuery(
    GET_ALL_PRODUCTS_FILTERED,
    {
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const [fetchProduct, product] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {
      console.log(data);
      getAllProducts({
        variables: {
          // filter: {
          //   search: null,
          //   categories: data?.product?.category?.id,
          //   collections: null,
          //   productType: null,
          //   attributes: product?.node?.id,
          // },  
            // first: 100,
            
            filter: {
              // ids: ["UHJvZHVjdDoxMDQ4"],
              attributes: [{
                slug: "parent-product-id",
                value: params?.id
            }],
          },
          sort: { direction: "DESC", field: "PUBLICATION_DATE" },
        },
        onCompleted: (subCatData) => {
          let temp = subCatData?.products?.edges?.filter(
            (subcat) =>
              subcat?.node?.attributes[18]?.values[0]?.name == params?.id
          );
          let child = 
          setLocalProducts(temp);
        },
      });
    },
    onError: (err) => {
      setError("Unable to retrieve product");
    },
  });

  const [deleteProduct, deletedProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: (data) => {
      setSuccess("Product deleted successfully!");

      setTimeout(() => {
        navigate("/dashboard/b2b/products");
      }, 1000);

      console.log(data);
    },
    onError: (err) => {
      setError(err?.message);
    },
  });
  useEffect(() => {
    fetchProduct();
  }, []);
  const handleDelete = () => {
    setTrial("Deleting Product");
    deleteProduct({ variables: { id: params?.id } });
    localProducts.forEach((localProduct) => {
      const productToDeleteId = localProduct?.node?.id;

      // Call the deleteProduct mutation for each product
      deleteProduct({ variables: { id: productToDeleteId } });
    });
  };
  return (
    <>
      <section className='py-4'>
        {contextHolder}
        {product?.loading && <Spinner />}
        <SectionTitle title='Product Detail' />
        <Divider className='bg-white/10' />

        {!product?.loading && product?.data?.product ? (
          <section className='flex flex-wrap w-full items-start justify-around'>
            <div className='w-full h-auto md:w-5/12 relative lg:px-5 md:sticky lg:top-[10%] '>
              <div className='relative lg:px-5 lg:sticky lg:top-[10%]'>
                {product?.loading && <Skeleton.Image active />}
                {!product?.loading && (
                  <div className=' w-full flex flex-col items-end justify-end'>
                    <Link
                      to='upload'
                      className='text-blue-500 dark:text-slate-200 font-semibold cursor-pointer'
                    >
                      Edit Images
                    </Link>
                    <ProductCarousel images={product?.data?.product?.images} />
                  </div>
                )}
              </div>
            </div>
            <div className='w-full md:w-6/12'>
              {product?.loading && (
                <>
                  {" "}
                  <Skeleton active /> <br />
                  <Skeleton active />
                </>
              )}
              {!product?.loading && (
                <>
                  <Card
                    title={
                      <span className='dark:text-slate-200'>Basic Details</span>
                    }
                    extra={
                      <span
                        className='text-blue-500 dark:text-slate-200 font-semibold cursor-pointer'
                        onClick={() =>
                          navigate(
                            "/dashboard/b2b/products/" + params?.id + "/edit"
                          )
                        }
                      >
                        Edit
                      </span>
                    }
                    type='inner'
                    className=' dark:bg-slate-800 dark:text-slate-400 mb-4 '
                  >
                    <section className='flex flex-wrap items-start justify-start gap-2'>
                      <DetailWrapper
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%]'
                        query='Name'
                        value={product?.data?.product?.name || "N/A"}
                      />
                      <DetailWrapper
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%]'
                        query='Pricing'
                        value={
                          <div className='flex items-center justify-start gap-x-3'>
                            {!product?.data?.product?.pricing
                              ?.priceRangeUndiscounted?.start?.gross?.amount &&
                              !product?.data?.product?.pricing
                                ?.priceRangeUndiscounted?.stop?.gross?.amount &&
                              "N/A"}
                            <DisplayPrice
                              price={
                                product?.data?.product?.pricing
                                  ?.priceRangeUndiscounted?.start?.gross?.amount
                              }
                            />
                            {product?.data?.product?.pricing
                              ?.priceRangeUndiscounted?.stop?.gross?.amount && (
                              <CgArrowLongRight />
                            )}
                            <DisplayPrice
                              price={
                                product?.data?.product?.pricing
                                  ?.priceRangeUndiscounted?.stop?.gross?.amount
                              }
                            />
                          </div>
                        }
                      />
                      <DetailWrapper
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%]'
                        query='Publish Date'
                        value={product?.data?.product?.publicationDate || "N/A"}
                      />
                      <DetailWrapper
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%]'
                        query='Category'
                        value={product?.data?.product?.category?.name || "N/A"}
                      />
                      <DetailWrapper
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%] flex-wrap'
                        query='Collections'
                        value={product?.data?.product?.collections?.map(
                          (collection) => (
                            <div className='inline-flex text-white bg-gray-400 border-0 p-2 rounded text-xs mr-2'>
                              {collection?.name}
                            </div>
                          )
                        )}
                      />
                      <DetailWrapper
                        query='Weight'
                        className='max-w-full md:min-w-[45%] lg:min-w-[30%]'
                        value={
                          product?.data?.product?.weight?.value +
                            ' gm' ||
                          "N/A"
                        }
                      />
                    </section>
                  </Card>

                  <Card
                    type='inner'
                    title={
                      <span className='dark:text-slate-200'>Attributes</span>
                    }
                    // extra={
                    //   <Link
                    //     to='edit'
                    //     className='text-blue-500 dark:text-slate-200 font-semibold cursor-pointer'
                    //   >
                    //     Edit
                    //   </Link>
                    // }
                    className='dark:bg-slate-800 dark:text-slate-400 mb-4'
                  >
                    <section className='flex flex-wrap gap-4'>
                      <List
                        grid={{
                          gutter: 16,
                          xs: 1,
                          sm: 2,
                          md: 2,
                          lg: 3,
                          xl: 3,
                        }}
                        dataSource={product?.data?.product?.attributes.filter(attr => {
                          const attributeName = attr?.attribute?.name?.toLowerCase();
                          // Exclude specific attributes
                          return !["gemstone details product", "hsn code", "gst", "title", "parent product id","manufacturer id", "Is Design bank", "design product id", "display made to order size", "is common gemstone", "is common wastage charge", "is common making charge"].includes(attributeName);
                        })}
                        renderItem={(attr) => (
                          <div className='flex flex-col items-start justify-between w-full m-2 '>
                            <h5 className='text-sm w-full font-bold break-normal dark:text-slate-400 pr-4'>
                              {attr?.attribute?.name}
                            </h5>
                            <h5 className='text-sm w-full font-semibold dark:text-slate-50'>
                              {attr?.values[0]?.name || "N/A"}
                            </h5>
                          </div>
                        )}
                      />
                    </section>
                  </Card>

                  <Card
                    type='inner'
                    title={
                      <span className='dark:text-slate-200'>Metadata</span>
                    }
                    // extra={
                    //   <Link
                    //     to='edit'
                    //     className='text-blue-500 dark:text-slate-200 font-semibold cursor-pointer'
                    //   >
                    //     Edit
                    //   </Link>
                    // }
                    className='dark:bg-slate-800 dark:text-slate-400  mb-4'
                  >
                    {/* <section className="flex flex-wrap items-start justify-start "> */}
                    <Checkbox.Group
                      style={{
                        width: "100%",
                      }}
                    >
                      {/* <DetailCheck
                        title='Taxes Charged'
                        value={product?.data?.product?.chargeTaxes}
                      /> */}

                      {/* <DetailCheck
                        title='Available'
                        value={product?.data?.product?.isAvailable}
                      /> */}

                      <DetailCheck
                        title='Available for Purchase'
                        value={product?.data?.product?.isAvailableForPurchase}
                      />

                      <DetailCheck
                        title='Published'
                        value={product?.data?.product?.isPublished}
                      />
                      <DetailCheck
                        title='Visible in Listings'
                        value={product?.data?.product?.visibleInListings}
                      />

                      {/* </section> */}
                    </Checkbox.Group>
                  </Card>
                  <Card
                    type='inner'
                    title={
                      <span className='dark:text-slate-200'>Variants</span>
                    }
                    extra={
                      <Link
                        to='variant-creator'
                        className='text-blue-500 dark:text-slate-200 font-semibold cursor-pointer'
                      >
                        Create Variant
                      </Link>
                    }
                    className='dark:bg-slate-800 dark:text-slate-400  mb-4'
                  >
                    {product?.data?.product?.variants?.length < 1 ? (
                      <Empty
                        description={
                          <span className='dark:text-white'>
                            No data available
                          </span>
                        }
                      />
                    ) : (
                      <section className='flex flex-wrap items-start justify-start gap-3'>
                        {product?.data?.product?.variants?.map((variant) => (
                          <Link
                            to={"variant-edit?id=" + variant.id}
                            className='flex flex-col'
                          >
                            <h5 className='font-bold text-sm break-all'>
                              {variant?.name}
                            </h5>
                            <h3 className='font-semibold text-md break-all'>
                              {variant?.sku}
                            </h3>
                            <Divider className='dark:bg-white/10' />
                          </Link>
                        ))}
                      </section>
                    )}
                  </Card>
                </>
              )}
            </div>
          </section>
        ) : (
          <h3>Product Doesnt Exist</h3>
        )}
      </section>
      {product?.data?.product && (
        <section className='p-5 flex items-end justify-end'>
          <Modal
            title='Delete Product?'
            open={modalopen}
            onOk={handleDelete}
            confirmLoading={deletedProduct?.loading}
            okButtonProps={{ style: { background: "red", color: "#fff" } }}
            okText='Delete'
            onCancel={() => setmodalOpen(false)}
          >
            <p>Are you sure you want to delete the product ?</p>
            <p className='mt-2'>
              <span className='font-bold'>Name: </span>{" "}
              <span>{product?.data?.product?.name}</span>
            </p>
          </Modal>
          <Button
            type='primary'
            danger
            className='px-10 py-5 flex items-center justify-center'
            onClick={() => setmodalOpen(true)}
          >
            {" "}
            Delete Product
          </Button>
        </section>
      )}
          {localProducts != '' && <SectionTitle title='Child Products' />}
          <Divider className='bg-white/10' />
          {allProducts?.loading && <Spinner />}
      {localProducts && (
        <>
          {!allProducts?.loading && (
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
              dataSource={localProducts}
              renderItem={(product) => (
                <ChildCard product={product} key={product?.node?.id} />
              )}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
