/* eslint-disable jsx-a11y/alt-text */
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  GET_PRODUCT_BY_ID_OPTIMIZED,
} from "../../../GraphQl/Query";

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
        " " + props?.className
      }>
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
      <div className='flex items-start  '>
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
  const [variantValues, setVariantValues] = useState([]);
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
  
  const [fetchProduct, product] = useLazyQuery(GET_PRODUCT_BY_ID_OPTIMIZED, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {
      setLocalProducts(data?.product?.childProduct);

      setVariantValues(data?.product?.variants[0]?.name?.split(" / "));
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

      deleteProduct({ variables: { id: productToDeleteId } });
    });
  };
  const attributeMap = product?.data?.product?.attributes.reduce((map, attr) => {
    map[attr?.attribute?.slug] = attr;
    return map;
  }, {});
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
                        className='w-full'
                        query='Name'
                        value={product?.data?.product?.name || "N/A"}
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
                        value={variantValues &&
                          variantValues[7] +
                            ' gm' ||
                          "N/A"
                        }
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
                    </section>
                  </Card>
                  
                  <Card
                    type='inner'
                    title={
                      <span className='dark:text-slate-200'>Attributes</span>
                    }
                    className='dark:bg-slate-800 dark:text-slate-400 mb-4'
                  >
                    <section className='flex flex-wrap gap-4 '>
                          {["metal-type",
                            "gold-carat",
                            "silver-carat",
                            "platinum-carat",
                            "gold-color",
                            "silver-color",
                            "platinum-color",
                            "availability",
                            "communityregion",
                            "ocassian",
                            "gender",
                            "type",
                            "gemstone",
                            "gemstone-type",
                            "enter-min-weight-range",
                            "enter-max-weight-range",
                            "making-charge-mode",
                            "making-charge-product",
                            "wastage-charge-mode",
                            "wastage-charge-prouct"
                            ].map(attributeSlug => {
                            const attribute = attributeMap[attributeSlug];

                            if (!attribute || !attribute?.values[0]?.name || attribute?.values[0]?.name == ["none"] || attribute?.values[0]?.name === "none") {
                              return null;
                            }
                      
                            return (
                              <div className='flex flex-col items-start justify-between w-3/12 m-2' key={attributeSlug}>
                                <h5 className='text-sm w-full font-semibold break-normal dark:text-slate-400 pr-4'>
                                  {attribute?.attribute?.name}
                                </h5>
                                <h5 className='text-xl w-full font-semibold dark:text-slate-50'>
                                  {attribute?.values[0]?.name}
                                </h5>
                              </div>
                            );
                          })}
                    </section>
                  </Card>
                  <Card
                    type='inner'
                    title={
                      <span className='dark:text-slate-200'>Variant Data</span>
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
                            <h5 className='font-bold text-white text-2xl break-all'>
                              {"Size : " + variant?.name?.split("/")[0]}
                            </h5>
                          </Link>
                        ))}
                      </section>
                    )}
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
                    </Checkbox.Group>
                  </Card>
                  
                </>
              )}
            </div>
          </section>
        ) : (
          <h3>Product Doesn't Exist</h3>
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
          {localProducts?.loading && <Spinner />}
      {localProducts && (
        <>
          {!localProducts?.loading && (
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
                <ChildCard product={product} key={product.id} />
              )}
            />
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
