import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";

import {
  Button,
  Card,
  Divider,
  Steps,
  Radio,
  DatePicker,
  Checkbox,
  message,
  AutoComplete,
} from "antd";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import * as dayjs from "dayjs";
import Spinner from "../../../components/Spinner/Spinner";
import InputComponent from "../../../components/Inputs/Input";
import ImageUpload from "../../../components/Inputs/ImageUpload";
import SectionTitle from "../../../components/Title/SectionTitle";
import SelectComponent from "../../../components/Inputs/Select";
import NumberInputComponent from "../../../components/Inputs/Number";
import {
  GET_ALL_GEMSTONE_SHAPES,
  GET_CATEGORY_DETAIL,
  GET_DIAMOND_GRADES,
  GET_DIAMOND_PRICES,
  GET_MANUFACTURERS_ASSIGNMENT_LIST,
  GET_PRODUCT_BY_ID,
  GET_SUBCATEGORY_LIST,
  SEARCH_CATEGORIES,
  SEARCH_COLLECTIONS,
  SEARCH_PRODUCT_TYPES,
  SEARCH_WAREHOUSE_LIST,
} from "../../../GraphQl/Query";
import {
  // CREATE_PRODUCT,
  UPDATE_PRODUCT,
  // UPLOAD_PRODUCT_IMAGE,
} from "../../../GraphQl/Mutations";
import { useNavigate, useParams } from "react-router-dom";
import RTE from "../../../components/Inputs/RTE";
import RichTextEditor from "../../../components/Inputs/RTE";

const EditProduct = () => {
  const handleUpload = (e) => {};
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [currentStep, setCurrentStep] = useState(0);
  const [after, searchAfter] = useState({
    typeAfter: null,
    categoriesAfter: null,
    collectionAfter: null,
    warehouseAfter: null,
  });
  const [weightRange, setWeightRange] = useState({ min: 0, max: 0 });
  const [queries, setQueries] = useState({
    typeQuery: "",
    categoryQuery: "",
    collectionQuery: [],
    warehouseQuery: "",
  });
  const [getManufacturers, manufacturers] = useLazyQuery(
    GET_MANUFACTURERS_ASSIGNMENT_LIST,
    {
      onError: (err) => {
        console.log(err);
      },
    }
  );

  const [productVar, setProductVar] = useState({
    id: params?.id,
    input: {
      attributes: [],
      basePrice: null,
      category: null,
      chargeTaxes: null,
      collections: [],
      descriptionJson: "{}",
      isPublished: null,
      name: null,
      productType: null,
      publicationDate: null,
      seo: { description: "", title: "" },
      sku: null,
      slug: "",
      stocks: [
        {
          quantity: null,
          warehouse: null,
        },
      ],
      trackInventory: null,
      visibleInListings: null,
      weight: null,
    },
  });

  const section1Button = useRef();
  const navigate = useNavigate();

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
  const [currentManufacturer, setCurrentManufacturer] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [attributeList, setAttributeList] = useState([]);
  const [diamondRates, setDiamondRates] = useState(null);
  const [carats, setCarats] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [diamondPrice, setDiamondPrice] = useState(0);
  const [fetchTypes, types] = useLazyQuery(SEARCH_PRODUCT_TYPES, {
    variables: {
      after: after?.typeAfter,
      first: 100,
      query: "",
    },
    onCompleted: (data) => {},
    onError: (err) => {},
  });
  const [fetchCategories, categories] = useLazyQuery(SEARCH_CATEGORIES, {
    variables: {
      after: after?.categoriesAfter,
      first: 100,
      query: "",
    },
    onCompleted: (data) => {
      //
    },
    onError: (err) => {},
  });
  const [fetchSingleCategory, singleCategory] = useLazyQuery(
    GET_CATEGORY_DETAIL,
    {
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const [fetchCollections, collections] = useLazyQuery(SEARCH_COLLECTIONS, {
    variables: {
      after: after?.collectionAfter,
      first: 100,
      query: "",
    },
    onCompleted: (data) => {
      //
    },
    onError: (err) => {},
  });
  const [fetchWarehouse, warehouse] = useLazyQuery(SEARCH_WAREHOUSE_LIST, {
    variables: {
      after: after?.warehouseAfter,
      first: 100,
      query: "",
    },
    onCompleted: (data) => {
      //
    },
    onError: (err) => {},
  });
  const [fetchProduct, product] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {
      console.log(data);
      setAttributeList(
        data?.product?.attributes?.map((attr) => {
          return {
            id: attr?.attribute?.id,
            name: attr?.attribute?.name,
            values: attr?.values[0]?.name,
            type: attr?.attribute?.inputType,
            required: attr?.attribute?.valueRequired,
            options: attr?.attribute?.values?.map((val) => {
              {
                return { value: val?.name, label: val?.name };
              }
            }),
          };
        })
      );
      setProductVar({
        id: params?.id,
        input: {
          attributes: data?.product?.attributes?.map((attr) => {
            return {
              id: attr?.attribute?.id,
              values: [attr?.values[0]?.name],
            };
          }),
          basePrice:
            data?.product?.pricing?.priceRangeUndiscounted?.start?.gross
              ?.amount,
          category: data?.product?.category?.id,
          chargeTaxes: data?.product?.chargeTaxes,
          collections: data?.product?.collections?.map(
            (collection) => collection?.id
          ),
          descriptionJson: data?.product?.descriptionJson,
          isPublished: data?.product?.isPublished,
          name: data?.product?.name,
          productType: data?.product?.productType?.id,
          publicationDate: data?.product?.publicationDate,
          seo: {
            description: data?.product?.seoDescription,
            title: data?.product?.seoTitle,
          },
          sku: null,
          slug: data?.product?.slug,
          stocks: [
            {
              quantity: null,
              warehouse: null,
            },
          ],
          trackInventory: data?.product?.trackInventory || false,
          visibleInListings: data?.product?.visibleInListings,
          weight: data?.product?.weight,
        },
      });
      getManufacturers({
        variables: { first: 100, subCategoryId: data?.product?.category?.id },
      });
    },
    onError: (err) => {
      setError("Unable to retrieve product");
    },
  });
  const [getSubcategoryData, subcategoryData] = useLazyQuery(
    GET_CATEGORY_DETAIL,
    {
      //  variables: {
      //    first: 100,
      //    id: params?.id,
      //  },
      onCompleted: (data) => {
        console.log(data);
        setSuccess("Data fetched successfully");
      },
      onError: (err) => {
        setError("Error fetching data");
      },
    }
  );
  const [getSubcategoryMetaData, subcategoryMetaData] = useLazyQuery(
    GET_SUBCATEGORY_LIST,
    {
      //  variables: {
      //    subcategoryId: params?.id,
      //  },
      onCompleted: (data) => {
        console.log(data);
        setSuccess("Data fetched successfully");
      },
      onError: (err) => {
        setError("Error fetching data");
      },
    }
  );
  const [getDiamondGrades, diamondGrades] = useLazyQuery(GET_DIAMOND_GRADES, {
    variables: {
      filter: {
        search: "diamond-grade",
      },
      first: 100,
    },
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      setError();
    },
  });
  const [getGemstoneShapes, gemstoneShapes] = useLazyQuery(
    GET_ALL_GEMSTONE_SHAPES,
    {
      variables: {
        filter: {
          search: "dia-shape",
        },
        first: 100,
      },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        setError();
      },
    }
  );
  const [getDiamondPrices, diamondPrices] = useLazyQuery(GET_DIAMOND_PRICES, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      setDiamondRates(JSON.parse(data.metalRates.diamondRate));
    },
    onError: (err) => {
      setError();
    },
  });
  const [updateProduct, updatedProduct] = useMutation(UPDATE_PRODUCT, {
    variables: {
      id: params?.id,
      input: {
        // attributes: productVar?.input?.attributes,
        // basePrice: productVar?.input?.basePrice,
        category: productVar?.input?.category,
        chargeTaxes: productVar?.input?.chargeTaxes ?? true,
        // collections: productVar?.input?.collections,
        // descriptionJson: productVar?.input?.descriptionJson ?? "{}",
        isPublished: productVar?.input?.isPublished,
        // name: productVar?.input?.name,
        // productType: productVar?.input?.productType?.id,
        publicationDate: productVar?.input?.publicationDate,
        seo: {
          description: productVar?.input?.seoDescription,
          title: productVar?.input?.seoTitle,
        },
        sku: productVar?.input?.sku,
        slug: productVar?.input?.slug,
        // stocks: [
        //   {
        //     quantity: 2,
        //     warehouse:
        //       "V2FyZWhvdXNlOjg2MWEyY2M1LTBiYzEtNDM0Ni1iMTdjLWViMTM2MWExMTIzYw==",
        //   },
        // ],
        trackInventory: productVar?.input?.trackInventory || true,
        visibleInListings: productVar?.input?.visibleInListings ?? true,
        weight: productVar?.input?.weight ?? 0,
      },
    },
    onCompleted: (data) => {
      if (data?.productUpdate?.errors?.length > 0)
        setError(
          data?.productUpdate?.errors[0]?.field +
            " " +
            data?.productUpdate?.errors[0]?.code?.toLowerCase()
        );
      else if (data?.productUpdate?.product) {
        setSuccess("Updated " + productVar?.input?.name);
        setTimeout(() => {
          navigate(window.location?.pathname?.split("/edit")[0]);
        }, 1000);
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  useEffect(() => {
    fetchProduct();
    fetchTypes();
    fetchCategories();
    fetchCollections();
    fetchWarehouse();
    getDiamondGrades();
    getGemstoneShapes();
    getDiamondPrices();
    setTrial("Reload if values donot show");
  }, []);

  useEffect(() => {
    setProductVar({
      id: params?.id,
      input: {
        attributes: product?.data?.product?.attributes?.map((attr) => {
          return {
            id: attr?.attribute?.id,
            values: [attr?.values[0]?.name],
          };
        }),
        basePrice:
          product?.data?.product?.pricing?.priceRangeUndiscounted?.start?.gross
            ?.amount,
        category: product?.data?.product?.category?.id,
        chargeTaxes: product?.data?.product?.chargeTaxes,
        collections: product?.data?.product?.collections?.map(
          (collection) => collection?.id
        ),
        descriptionJson: product?.data?.product?.descriptionJson,
        isPublished: product?.data?.product?.isPublished,
        name: product?.data?.product?.name,
        productType: product?.data?.product?.productType?.id,
        publicationDate: product?.data?.product?.publicationDate,
        seo: {
          description: product?.data?.product?.seoDescription,
          title: product?.data?.product?.seoTitle,
        },
        sku: null,
        slug: product?.data?.product?.slug,
        stocks: [
          {
            quantity: null,
            warehouse: null,
          },
        ],
        trackInventory: product?.data?.product?.trackInventory || false,
        visibleInListings: product?.data?.product?.visibleInListings,
        weight: product?.data?.product?.weight,
      },
    });
    console.log(productVar?.input?.descriptionJson);
  }, [product]);

  const handleSubmit = () => {
    setTrial("Updating " + productVar?.input?.name);
    updateProduct();
  };

  return (
    <>
      {contextHolder}
      <section className='w-11/12 py-4'>
        {" "}
        <SectionTitle title='Edit  Product' />
        <Divider className='dark:bg-white/10' />
        <Steps
          current={currentStep}
          onChange={(e) => setCurrentStep(e)}
          size='small'
          id='productSteps'
          items={[
            {
              title: (
                <span className='dark:text-slate-200'> Basic Details</span>
              ),
              description: "",
            },
            {
              title: <span className='dark:text-slate-200'>Attributes</span>,
              description: "",
            },
          ]}
        />
      </section>
      <form className='py-4 w-full'>
        {product?.loading && <Spinner />}
        {!product?.loading && product?.data?.product && (
          <section
            id='_1'
            style={{ display: currentStep == 0 ? "flex" : "none" }}
            className='flex-col w-full gap-2 md:gap-5 '
          >
            <Card
              // title={
              //   <label className="font-semibold dark:text-slate-100">
              //     Attributes
              //   </label>
              // }
              className='w-full md:w-[96%] flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
            >
              <section className=' row flex flex-wrap gap-4 w-full items-start'>
                <div className='w-full md:w-10/12'>
                  <InputComponent
                    required={true}
                    placeholder='Enter Product Name'
                    maxLength={30}
                    title='Product Name *'
                    showCount={true}
                    handleChange={(e) => {
                      setProductVar({
                        ...productVar,
                        input: {
                          ...productVar?.input,
                          name: e.target.value,
                        },
                      });
                    }}
                    className='bg-transparent'
                    allowClear={true}
                    value={productVar?.input?.name}
                  />
                </div>
              </section>

              <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
                <SelectComponent
                  placeholder='Select product type'
                  title='Product Type *'
                  required={true}
                  value={productVar?.input?.productType}
                  loading={types?.loading}
                  options={types?.data?.search?.edges?.map((edge) => {
                    return {
                      value: edge?.node?.id,
                      label: edge?.node?.name,
                    };
                  })}
                  handleChange={(e) => {
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        productType: e != undefined ? e : "",
                      },
                    });
                  }}
                  className='w-full md:w-2/5'
                />{" "}
                <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Category"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Category"}
                      </label>
                <AutoComplete
                  placeholder='Select product category'
                  title='Product Category'
                  required={true}
                  defaultValue={productVar?.input?.category}
                  loading={categories?.loading}
                  options={categories?.data?.search?.edges?.map((edge) => {
                    return {
                      value: edge?.node?.id,
                      label: edge?.node?.name,
                    };
                  })}
                  handleChange={(e) => {
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        category: e != undefined ? e : "",
                      },
                    });
                  }}
                  className='w-full md:w-2/5'
                />
                </div>
              </section>
              <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
              <div className='flex flex-col items-start w-full md:w-[46%]'>
                <label
                  htmlFor={"Collection"}
                  className='font-semibold dark:text-slate-300 text-sm'
                >
                  {"Collection"}
                </label>
                <AutoComplete
                  placeholder='Select product collection'
                  title='Product Collection'
                  required={true}
                  mode='multiple'
                  defaultValue={productVar?.input?.collections}
                  loading={collections?.loading}
                  options={collections?.data?.search?.edges?.map((edge) => {
                    return {
                      value: edge?.node?.id,
                      label: edge?.node?.name,
                    };
                  })}
                  handleChange={(e) => {
                    setQueries({
                      ...queries,
                      collectionQuery: e != undefined ? e : "",
                    });
                  }}
                  className='w-full md:w-2/5'
                />
                </div>
                {/* <SelectComponent
                  placeholder='Select warehouse'
                  title='Warehouse'
                  required={true}
                  loading={warehouse?.loading}
                  options={warehouse?.data?.warehouses?.edges?.map((edge) => {
                    return {
                      value: edge?.node?.id,
                      label: edge?.node?.name,
                    };
                  })}
                  defaultValue={
                    "V2FyZWhvdXNlOmE3ZGM0YzRhLTZhYjAtNDQ4ZS1iZDRiLTJiOTcyNTI3NTkxNw=="
                  }
                  handleChange={(e) => {
                    console.log(e);
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        stocks: [
                          {
                            quantity: 2,
                            warehouse: e != undefined ? e : "",
                          },
                        ],
                      },
                    });
                  }}
                  className='w-full md:w-2/5'
                /> */}
              </section>
              <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
              <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Manufacturer"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Manufacturer"}
                      </label>
                <AutoComplete
                  placeholder='Select manufacturers'
                  title='Manufacturers'
                  required={true}
                  loading={manufacturers?.loading}
                  defaultValue={
                    productVar?.input?.attributes &&
                    productVar?.input?.attributes[32]?.values[0]
                  }
                  options={manufacturers.data?.manufecturerAssignmentsBySubCategory.map(
                    (manufacturer) => ({
                      label: manufacturer.manufacturer.name,
                      value: JSON.stringify(manufacturer),
                    })
                  )}
                  // options={warehouse?.data?.warehouses?.edges?.map((edge) => {
                  //   return {
                  //     value: edge?.node?.id,
                  //     label: edge?.node?.name,
                  //   };
                  // })}
                  handleChange={(e) => {
                    console.log(JSON.parse(e));
                    let tempObj = JSON.parse(e);
                    setCurrentManufacturer(JSON.parse(e));
                    let tempData = structuredClone(
                      productVar?.input?.attributes
                    );
                    tempData[32].values = [tempObj?.id];
                    tempData[31].values = [tempObj?.wastageCharge];
                    tempData[30].values = [tempObj?.makingCharge];
                    tempData[27].values = [tempObj?.wastageChargeMode];
                    tempData[26].values = [tempObj?.makingChargeMode];
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        attributes: tempData,
                      },
                    });
                  }}
                  className='w-full md:w-2/5'
                />
                </div>
              </section>

              <Button
                type='primary'
                className='text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300'
                onClick={() => setCurrentStep(1)}
                ref={section1Button}
              >
                Next
              </Button>
            </Card>
          </section>
        )}
        <section
          id='_2'
          style={{ display: currentStep == 1 ? "flex" : "none" }}
          className='flex-col w-full gap-2 md:gap-5 '
        >
          <section className='w-full flex items-start justify-evenly flex-wrap gap-4'>
            <div className='w-full md:w-7/12 lg:w-8/12 flex flex-col gap-y-3'>
              <section className='row'>
                <Card
                  title={
                    <label className='font-semibold dark:text-slate-100'>
                      Attributes
                    </label>
                  }
                  className='w-full md:w-[96%] flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
                >
                  <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
                  <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Metal Type *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Metal Type *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select metal Type"}
                      title={"Metal Type *"}
                      required={true}
                      loading={types?.loading}
                      options={["Gold", "Silver", "Platinum"].map((item) => ({
                        value: item,
                        label: item,
                      }))}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[0]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[0].values = [e];
                        tempData[18].values = productVar?.input?.attributes[18];

                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Availability"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Availability"}
                      </label>
                    <AutoComplete
                      placeholder={"Select availability"}
                      title={"Availability *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[1]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[1]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[1].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div> */}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Community/Region *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Community/Region *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select community/region"}
                      title={"Community/region *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[2]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[2]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[2].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Gender *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gender *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select gender"}
                      title={"Gender *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[3]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[3]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[3].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Occassion *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Occassion *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select occassion"}
                      title={"Occassion *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[4]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[4]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[4].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>

                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] == "Gold" && (
                        <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"design bank product id"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"design bank product id"}
                      </label>
                        <AutoComplete
                          placeholder={"Select gold carats"}
                          title={"Gold Carats *"}
                          required={true}
                          // value={productVar?.input?.attributes[idx]?.values[0]}
                          mode={"multiple"}
                          loading={types?.loading}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[5]?.values[0]
                          }
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[0]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            .sort((a, b) => a.localeCompare(b))
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setCarats(e);
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[5].values = e[0];
                            tempData[6].values = 0;
                            tempData[7].values = 0;
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )}
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] ==
                        "Platinum" && (
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Platinum Carats *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Platinum Carats *"}
                      </label>
                        <AutoComplete
                          placeholder={"Select platinum carats"}
                          title={"Platinum Carats *"}
                          required={true}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[6]?.values[0]
                          }
                          mode={"multiple"}
                          loading={types?.loading}
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[0]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            .sort((a, b) => a.localeCompare(b))
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setCarats(e);
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[5].values = 0;
                            tempData[6].values = e[0];
                            tempData[7].values = 0;
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )}
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] ==
                        "Silver" && (
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Silver Carats *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Silver Carats *"}
                      </label>
                        <AutoComplete
                          placeholder={"Select silver carats"}
                          title={"Silver Carats *"}
                          required={true}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[7]?.values[0]
                          }
                          mode={"multiple"}
                          loading={types?.loading}
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[0]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            .sort((a, b) => a.localeCompare(b))
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setCarats(e);
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[5].values = 0;
                            tempData[6].values = 0;
                            tempData[7].values = e[0];
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )}
                      <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Type *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Type *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select type"}
                      title={"Type *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[8]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[8]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[8].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                     <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Max weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gold Color *"}
                      </label>
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] == "Gold" && (
                        <AutoComplete
                          placeholder={"Select Gold colors"}
                          title={"Gold Color *"}
                          required={true}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[9]?.values[0]
                          }
                          mode={"multiple"}
                          loading={types?.loading}
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[1]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setColors(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[9].values = e[0];
                            tempData[10].values = ["none"];
                            tempData[11].values = ["none"];
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                      </div>
                      
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] ==
                        "Platinum" && (
                        <AutoComplete
                          placeholder={"Select Platinum colors"}
                          title={"Platinum Color *"}
                          required={true}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[10]?.values[0]
                          }
                          mode={"multiple"}
                          loading={types?.loading}
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[1]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setColors(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[9].values = ["none"];
                            tempData[10].values = e[0];
                            tempData[11].values = ["none"];
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                     
                      
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[0]?.values &&
                      productVar?.input?.attributes[0]?.values[0] ==
                        "Silver" && (
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Silver Color *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Silver Color *"}
                      </label>
                        <AutoComplete
                          placeholder={"Select Silver colors"}
                          title={"Silver Color *"}
                          required={true}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[11]?.values[0]
                          }
                          mode={"multiple"}
                          loading={types?.loading}
                          options={Array(
                            subcategoryMetaData?.data?.category?.metadata[1]
                              ?.value
                          )[0]
                            ?.replace("[", "")
                            .replace("]", "")
                            ?.split(",")
                            ?.map((item) => ({
                              value: item.replace("'", "").replace("'", ""),
                              label: item.replace("'", "").replace("'", ""),
                            }))}
                          handleChange={(e) => {
                            setColors(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[9].values = ["none"];
                            tempData[10].values = ["none"];
                            tempData[11].values = e[0];
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Flat Charges"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Flat Charges"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Flat Charges"}
                        title={"Flat charges"}
                        loading={types?.loading}
                        options={attributeList[12]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[12]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[12].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Min weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Min weight range"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Min weight range"}
                        title={"Min weight range"}
                        loading={types?.loading}
                        options={attributeList[13]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[13]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[13].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Max weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Max weight range"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Max weight range"}
                        title={"Max weight range"}
                        loading={types?.loading}
                        options={attributeList[14]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[14]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[14].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"HSN Code"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"HSN Code"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter HSN Code"}
                        title={"HSN Code"}
                        loading={types?.loading}
                        options={attributeList[15]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[15]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[15].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Title"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Title"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Title"}
                        title={"Title"}
                        loading={types?.loading}
                        options={attributeList[16]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[16]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[16].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"GST"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"GST"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter GST"}
                        title={"GST"}
                        loading={types?.loading}
                        options={attributeList[17]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[17]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[17].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Parent product id"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Parent product id"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Parent product id"}
                        title={"Parent product id"}
                        loading={types?.loading}
                        options={attributeList[18]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[18]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[18].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Sizes *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Sizes *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select sizes"}
                      title={"Sizes *"}
                      required={true}
                      // value={productVar?.input?.attributes[idx]?.values[0]}
                      mode={"multiple"}
                      loading={types?.loading}
                      options={Array(
                        subcategoryMetaData?.data?.category?.metadata[5]?.value
                      )[0]
                        ?.replace("[", "")
                        .replace("]", "")
                        ?.split(",")
                        ?.map((item) => ({
                          value: item.replace("'", "").replace("'", ""),
                          label: item.replace("'", "").replace("'", ""),
                        }))}
                      handleChange={(e) => {
                        setSizes(e);
                        setProductVar(() => ({
                          ...productVar,
                          sizes: e,
                        }));
                        // let tempData = structuredClone(productVar?.input?.attributes);
                        // tempData[idx].values =
                        //   attr?.type == "MULTISELECT" ? e : [e];
                        // setProductVar({
                        //   ...productVar,
                        //   attributes: tempData,
                        // });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    
                    {/* <AutoComplete
                      placeholder={"Select made to order size"}
                      title={"Made to order size *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[19]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[19]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[19].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    {/* {productVar?.input?.attributes &&
                      productVar?.input?.attributes[8]?.values &&
                      productVar?.input?.attributes[8]?.values[0] ==
                        "Studded" && (
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Is common gemstone *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Is common gemstone *"}
                      </label>
                        <AutoComplete
                          placeholder={"Select is common gemstone"}
                          title={"Is common gemstone *"}
                          required={true}
                          loading={types?.loading}
                          options={attributeList[20]?.options}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[20]?.values[0]
                          }
                          handleChange={(e) => {
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[20].values = [e];
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )} */}
                    {/* <SelectComponent
                      placeholder={"Select is common making charge"}
                      title={"Is common making charge *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[21]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[21]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[21].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    <SelectComponent
                      placeholder={"Select is common wastage charge"}
                      title={"Is common wastage charge *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[22]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[22]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[22].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    {/* {productVar?.input?.attributes &&
                      productVar?.input?.attributes[8]?.values &&
                      productVar?.input?.attributes[8]?.values[0] ==
                        "Studded" && (
                        <div className='flex flex-col items-start w-full md:w-[46%]'>
                          <label
                            htmlFor={"Gemstone"}
                            className='font-semibold dark:text-slate-300 text-sm'
                          >
                            {"Gemstone"}
                          </label>
                          <AutoComplete
                            placeholder={"Enter Gemstone"}
                            title={"Gemstone"}
                            loading={types?.loading}
                            options={attributeList[23]?.options}
                            value={
                              productVar?.input?.attributes &&
                              productVar?.input?.attributes[23]?.values[0]
                            }
                            onChange={(e) => {
                              console.log(e);
                              let tempData = structuredClone(
                                productVar?.input?.attributes
                              );
                              tempData[23].values = [e];
                              setProductVar({
                                ...productVar,
                                input: {
                                  ...productVar.input,
                                  attributes: tempData,
                                },
                              });
                            }}
                            className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                          />
                        </div>
                      )} */}
                    {/* multi */}
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[8]?.values &&
                      productVar?.input?.attributes[8]?.values[0] ==
                        "Studded" && (
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Gemstone Type *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone Type *"}
                      </label>
                        <AutoComplete
                          placeholder={"Select gemstone type"}
                          title={"Gemstone type *"}
                          required={true}
                          loading={types?.loading}
                          mode={"multiple"}
                          options={attributeList[24]?.options}
                          defaultValue={
                            productVar?.input?.attributes &&
                            productVar?.input?.attributes[24]?.values[0]
                          }
                          handleChange={(e) => {
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.input?.attributes
                            );
                            tempData[24].values = e;
                            setProductVar({
                              ...productVar,
                              input: {
                                ...productVar.input,
                                attributes: tempData,
                              },
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                        </div>
                      )}
                    {/* <SelectComponent
                      placeholder={"Select is design bank"}
                      title={"Is design bank *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[25]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[25]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[25].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Making charge mode*"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Making charge mode*"}
                      </label>
                    <AutoComplete
                      placeholder={"Select making charge mode"}
                      title={"Making charge mode *"}
                      required={true}
                      disabled
                      loading={types?.loading}
                      options={attributeList[26]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[26]?.values[0]
                      }
                      value={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[26]?.values &&
                        productVar?.input?.attributes[26]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[26].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Wastage charge mode *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Wastage charge mode *"}
                      </label>
                    <AutoComplete
                      placeholder={"Select wastage charge mode"}
                      title={"Wastage charge mode *"}
                      required={true}
                      tVar
                      disabled
                      loading={types?.loading}
                      options={attributeList[27]?.options}
                      defaultValue={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[27]?.values[0]
                      }
                      value={
                        productVar?.input?.attributes &&
                        productVar?.input?.attributes[27]?.values &&
                        productVar?.input?.attributes[27]?.values[0]
                      }
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(
                          productVar?.input?.attributes
                        );
                        tempData[27].values = [e];
                        setProductVar({
                          ...productVar,
                          input: {
                            ...productVar.input,
                            attributes: tempData,
                          },
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    </div>
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"design bank product id"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"design bank product id"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter design bank product id"}
                        title={"design bank product id"}
                        loading={types?.loading}
                        options={attributeList[28]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[28]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[28].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {productVar?.input?.attributes &&
                      productVar?.input?.attributes[8]?.values &&
                      productVar?.input?.attributes[8]?.values[0] ==
                        "Studded" && (
                        <div className='flex flex-col items-start w-full md:w-[46%]'>
                          <label
                            htmlFor={"Gemstone Details Product"}
                            className='font-semibold dark:text-slate-300 text-sm'
                          >
                            {"Gemstone Details Product"}
                          </label>
                          <AutoComplete
                            placeholder={"Enter Gemstone Details Product"}
                            title={"Gemstone Details Product"}
                            loading={types?.loading}
                            options={
                              diamondRates &&
                              Object.entries(diamondRates)?.map((item) => ({
                                value: `{${item[0]}:${item[1]}}`,
                                label: `${item[0]}:${item[1]}`,
                              }))
                            }
                            value={
                              productVar?.input?.attributes &&
                              productVar?.input?.attributes[29]?.values[0]
                            }
                            onChange={(e) => {
                              let pattern = /\(.+\)/;
                              let val = structuredClone(diamondRates);
                              for (let i of Object.entries(val)) {
                                // console.log(i);
                                if (i[0]?.includes(e.toUpperCase())) {
                                  setDiamondPrice(i[1]);
                                }
                              }
                              let tempData = structuredClone(
                                productVar?.input?.attributes
                              );
                              tempData[29].values = [e.replace(pattern, "")];
                              setProductVar({
                                ...productVar,
                                input: {
                                  ...productVar.input,
                                  attributes: tempData,
                                },
                              });
                            }}
                            className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                          />
                        </div>
                      )}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Making Charge Product"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Making Charge Product"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Making Charge Product"}
                        title={"Making Charge Product"}
                        loading={types?.loading}
                        disabled
                        options={attributeList[30]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[30]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[30].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"wastage Charge Product"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"wastage Charge Product"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter wastage Charge Product"}
                        title={"wastage Charge Product"}
                        loading={types?.loading}
                        disabled
                        options={attributeList[31]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[31]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[31].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"manufacturer id"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"manufacturer id"}
                      </label>

                      <AutoComplete
                        placeholder={"Enter manufacturer id"}
                        title={"manufacturer id"}
                        loading={types?.loading}
                        options={attributeList[32]?.options}
                        value={
                          productVar?.input?.attributes &&
                          productVar?.input?.attributes[32]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.input?.attributes
                          );
                          tempData[32].values = [e];
                          setProductVar({
                            ...productVar,
                            input: {
                              ...productVar.input,
                              attributes: tempData,
                            },
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Min weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Min weight range"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter 24k Min weight range"}
                        title={"Min 24k weight range"}
                        loading={types?.loading}
                        options={attributeList[13]?.options}
                        onChange={(e) => {
                          setWeightRange(() => ({
                            ...weightRange,
                            min: parseFloat(e),
                          }));
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Max 24k weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Max 24k weight range"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Max weight range"}
                        title={"Max weight range"}
                        loading={types?.loading}
                        options={attributeList[14]?.options}
                        onChange={(e) => {
                          console.log(e);
                          setWeightRange(() => ({
                            ...weightRange,
                            max: parseFloat(e),
                          }));
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {/* {productVar?.input?.attributes &&
                      productVar?.input?.attributes[8]?.values &&
                      productVar?.input?.attributes[8]?.values[0] ==
                        "Studded" && (
                        <>
                          <SelectComponent
                            placeholder={"Select gemstone shape"}
                            title={"other Gemstone shape "}
                            required={true}
                            loading={types?.loading}
                            options={gemstoneShapes?.data?.attributes?.edges[0]?.node?.values?.map(
                              (item) => ({
                                value: item?.slug,
                                label: item?.name,
                              })
                            )}
                            value={
                              productVar?.input?.attributes &&
                              productVar?.input?.attributes[26]?.values &&
                              productVar?.input?.attributes[26]?.values[0]
                            }
                            handleChange={(e) => {
                              console.log(e);

                              setProductVar({
                                ...productVar,
                                gemstoneShape: [e],
                              });
                            }}
                            className='w-full md:w-[46%]'
                          />
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                            <label
                              htmlFor={"Other gemstone sieve"}
                              className='font-semibold dark:text-slate-300 text-sm'
                            >
                              {"Other gemstone sieve"}
                            </label>
                            <AutoComplete
                              placeholder={"Enter Other gemstone sieve"}
                              title={"Other gemstone sieve"}
                              loading={types?.loading}
                              onChange={(e) => {
                                console.log(e);
                                setProductVar({
                                  ...productVar,
                                  sieveSize: [e],
                                });
                              }}
                              className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                            />
                          </div>
                          <div className='flex flex-col items-start w-full md:w-[46%]'>
                            <label
                              htmlFor={"Other gemstone price"}
                              className='font-semibold dark:text-slate-300 text-sm'
                            >
                              {"Other gemstone price"}
                            </label>
                            <AutoComplete
                              placeholder={"Enter Other gemstone price"}
                              title={"Other gemstone price"}
                              loading={types?.loading}
                              options={attributeList[14]?.options}
                              onChange={(e) => {
                                console.log(e);
                                setProductVar({
                                  ...productVar,
                                  gemstonePrice: [e],
                                });
                              }}
                              className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                            />
                          </div>
                        </>
                      )} */}
                    {/* {attributeList?.map((attr, idx) => (
                      <>
                        {idx === 0 || idx === 5 || idx === 9 ? (
                          ""
                        ) : (
                          <>
                            {(attr?.type == "MULTISELECT" ||
                              attr?.type == "DROPDOWN") && (
                              <SelectComponent
                                placeholder={"Select " + attr?.name}
                                title={
                                  attr?.name +
                                  (attr?.required == true ? " *" : "")
                                }
                                required={attr?.required}
                                // value={productVar?.input?.attributes[idx]?.values[0]}
                                mode={attr?.type == "MULTISELECT" && "multiple"}
                                loading={types?.loading}
                                options={attr?.options}
                                handleChange={(e) => {
                                  let tempData = structuredClone(
                                    productVar?.input?.attributes
                                  );
                                  tempData[idx].values =
                                    attr?.type == "MULTISELECT" ? e : [e];
                                  setProductVar({
                                    ...productVar,
                                    attributes: tempData,
                                  });
                                }}
                                className='w-full md:w-[46%]'
                              />
                            )}
                            {attr?.type == "PLAINTEXT" && (
                              <div className='flex flex-col items-start w-full md:w-[46%]'>
                                <label
                                  htmlFor={attr?.name}
                                  className='font-semibold dark:text-slate-300 text-sm'
                                >
                                  {attr?.name}
                                </label>
                                <AutoComplete
                                  placeholder={"Enter " + attr?.name}
                                  title={
                                    attr?.name +
                                    (attr?.required == true ? " *" : "")
                                  }
                                  required={attr?.required}
                                  loading={types?.loading}
                                  options={attr?.options}
                                  onChange={(e) => {
                                    let tempData = structuredClone(
                                      productVar?.input?.attributes
                                    );
                                    tempData[idx].values = [e];
                                    setProductVar({
                                      ...productVar,
                                      attributes: tempData,
                                    });
                                  }}
                                  className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                                />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ))} */}
                  </section>
                </Card>
                {/* <NumberInputComponent
                  title="Base Price"
                  placeholder="Enter Product Price"
                  handleChange={(e) => {
                    setProductVar({
                      ...productVar,
                      basePrice: e.target.value,
                    });
                  }}
                /> */}
              </section>
            </div>

            <div className='w-full md:w-4/12 lg:w-3/12 flex flex-col gap-y-3'>
              <Card
                title={
                  <label className='font-semibold dark:text-slate-100'>
                    Visibility
                  </label>
                }
                className='w-full flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
              >
                <Radio.Group
                  onChange={(e) =>
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        isPublished: e.target.value,
                      },
                    })
                  }
                  value={productVar?.input?.isPublished}
                  className='flex flex-col gap-y-2'
                >
                  <Radio
                    value={true}
                    className='font-semibold dark:text-slate-100'
                  >
                    Published
                  </Radio>
                  <Radio
                    value={false}
                    className='font-semibold dark:text-slate-100'
                  >
                    Not Published
                  </Radio>
                </Radio.Group>
                <div className='relative mt-2'>
                  <input
                    type={
                      productVar?.input?.publicationDate != "" ||
                      productVar?.input?.publicationDate != undefined ||
                      productVar?.input?.publicationDate != null
                        ? "text"
                        : "date"
                    }
                    value={productVar?.input?.publicationDate}
                    name='pubDate'
                    id='pubDate'
                    placeholder='Set Publication Date'
                    className='bg-transparent dark:text-white dark:placeholder:text-white/50 focus:outline-none'
                    onFocus={() =>
                      (document.getElementById("pubDate").type = "date")
                    }
                    onBlur={() =>
                      (document.getElementById("pubDate").type =
                        (productVar?.input?.publicationDate == "" ||
                          productVar?.input?.publicationDate == undefined ||
                          productVar?.input?.publicationDate == null) &&
                        "text")
                    }
                    onChange={(e) =>
                      setProductVar({
                        ...productVar,
                        input: {
                          ...productVar?.input,
                          publicationDate: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <Divider className='dark:bg-white/10' />
                <Radio.Group
                  onChange={(e) =>
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        isPublished: e.target.value,
                      },
                    })
                  }
                  value={productVar?.input?.isPublished}
                  className='flex flex-col gap-y-2'
                >
                  <Radio
                    value={true}
                    className='font-semibold dark:text-slate-100'
                  >
                    Available for Purchase
                  </Radio>
                  <Radio
                    value={false}
                    className='font-semibold dark:text-slate-100'
                  >
                    Unavailable for Purchase
                  </Radio>
                </Radio.Group>

                <Divider className='dark:bg-white/10' />
                <div className='flex items-start justify-start'>
                  <Checkbox
                    onChange={(e) =>
                      setProductVar({
                        ...productVar,
                        input: {
                          ...productVar?.input,
                          visibleInListings: e.target.checked,
                        },
                      })
                    }
                    checked={productVar?.input?.visibleInListings}
                    id='taxes'
                  />
                  <label htmlFor='taxes' className='ml-2'>
                    <p className='font-semibold'>Show in product listings</p>
                    <p className='text-[11px] text-gray-500'>
                      Disabling this checkbox will remove product from search
                      and category pages. It will be available on collection
                      pages.
                    </p>
                  </label>
                </div>
              </Card>
              {/* <Card
                title={
                  <label className='font-semibold dark:text-slate-100'>
                    Taxes
                  </label>
                }
                className='w-full flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
              >
                <Radio.Group
                  onChange={(e) =>
                    setProductVar({
                      ...productVar,
                      input: {
                        ...productVar?.input,
                        chargeTaxes: e.target.value,
                      },
                    })
                  }
                  value={productVar?.input?.chargeTaxes}
                  className='flex flex-col'
                >
                  <Radio
                    value={true}
                    className='font-semibold dark:text-slate-100'
                  >
                    Override product type's tax rate
                  </Radio>
                  <Divider className='dark:bg-white/10' />
                  <Radio
                    value={false}
                    className='font-semibold dark:text-slate-100'
                  >
                    Charge taxes on this product
                  </Radio>
                </Radio.Group>
              </Card> */}
            </div>
          </section>
          <Button
            type='primary'
            className='text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300'
            onClick={handleSubmit}
          >
            Update Product
          </Button>
        </section>
      </form>
    </>
  );
};

export default EditProduct;
