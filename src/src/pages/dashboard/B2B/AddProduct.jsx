import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
// import * as moment from "moment";
// const moment = require('moment');
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
  FETCH_TYPE_ATTRIBUTES,
  GET_ALL_GEMSTONE_SHAPES,
  GET_CATEGORY_DETAIL,
  GET_CATEGORY_DETAIL_SLUG,
  GET_DIAMOND_GRADES,
  GET_DIAMOND_PRICES,
  GET_MANUFACTURERS_ASSIGNMENT_LIST,
  GET_SUBCATEGORY_LIST,
  GET_SUBCATEGORY_MAKINGCHARGE,
  GET_VARIANT_ID,
  SEARCH_CATEGORIES,
  SEARCH_COLLECTIONS,
  SEARCH_PRODUCT_TYPES,
  SEARCH_WAREHOUSE_LIST,
  // GET_PAYMENT_PROOF
} from "../../../GraphQl/Query";
import {
  CREATE_PRODUCT,
  SAVE_VARIANTS,
  SET_PRODUCT_AVAILABILITY,
  UPLOAD_PRODUCT_IMAGE,
} from "../../../GraphQl/Mutations";

import { useNavigate } from "react-router-dom";
import MultiImageUpload from "../../../components/Inputs/MutliImageUpload";

const AddProduct = () => {
  // const handleUpload = (e) => {
  //   console.log(e);
  // };
  // const [imageState, setImageState] = (false);
  const [name, setName] = ('');
  const [messageApi, contextHolder] = message.useMessage();
  const [currentManufacturer, setCurrentManufacturer] = useState('');
  const [gemstoneType, setGemstoneType] = useState('none');
  const [primaryCarat, setPrimaryCarat] = useState(null);
  const [primaryDiamondDetails, setPrimaryDiamondDetails] = useState(
    {
      name: "Diamond",
      shape: "null",
      size: "0",
      nop:0,
      ppc: 0,
      dg:"null",
      dri: "null",
      tp: 0    
    },
  );
 const [secondaryDiamondDetails, setSecondaryDiamondDetails] = useState(
    {
      name: "Diamond",
      shape: "null",
      size: "0",
      nop:0,
      ppc: 0,
      dg:"null",
      dri: "null",
       tp: 0 
    },
  );
  
  const [gender, setGender] = useState('none');
  const [metalType, setMetalType] = useState('none');
  const [carat, setCarat] = useState(22);
  const [category, setCatgeory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [studdedType, setStuddedType] = useState('Non Studded');
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');


 const [otherGemstoneDetails, setOtherGemstoneDetails] = useState(
    {
      name: "",
      shape: "null",
      size: "0",
      nop:0,
      ppc: 0,
      dg:"null",
      dri: "null",
      tp: 0 
    },
  );
  const otherGemstoneShapes = ['Round', 'Oval', 'Pear', 'Marquise', 'Emerald', 'Heart', 'Princess'];
  const handleGemstoneShapeChange = (value) => {
    setOtherGemstoneDetails({
      ...otherGemstoneDetails,
      shape: value,
    });
  };
  const option = otherGemstoneShapes.map(shape => ({ value: shape }));
  
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
    subCategoryQuery: "",
    collectionQuery: [],
    warehouseQuery: "",
  });
  const [productVar, setProductVar] = useState({
    name: "",
    attributes: [],
    metal: null,
    basePrice: null,
    chargeTaxes: null,
    descriptionJson: "{}",
    isPublished: true,
    publicationDate: null,
    seo: { description: "", title: "" },
    sku: "must-pass-unique-sku-from-backend",
    slug: "",
    quantity: null,
    trackInventory: null,
    visibleInListings: null,
    weight: null,
    // height: null,
    // width: null
  });
  const [carats, setCarats] = useState(['']);
  // const updatedCarats = carats.map(item => item.replace(/\s/g, ''));  
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [parentProduct, setParentProduct] = useState(0);
  const [localMapping, setLocalMapping] = useState();
  const [attributeList, setAttributeList] = useState([]);
  const section1Button = useRef();
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
  const caratoptions = (carats || [])  // Ensure carats is an array, or default to an empty array
  .map(item => item.replace("[", "").replace("]", "").trim())  // Remove brackets and trim spaces
  .filter(item => item !== '')  // Filter out empty strings
  .sort((a, b) => a.localeCompare(b))
  .map(item => ({
    value: item.replace("'", "").replace("'", ""),
    label: item.replace("'", "").replace("'", ""),
  }));
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [diamondRates, setDiamondRates] = useState(null);
  const [diamondPrice, setDiamondPrice] = useState(0);
  const [newParent, setNewParent] = useState(0);
  // let [update, setUpdate] = useState(moment());
  
  const [subcategoryPrice, setSubcategoryPrice] = useState('');
  const [fetchTypes, types] = useLazyQuery(SEARCH_PRODUCT_TYPES, {
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [variantSizeID, setVariantSizeID] = useState(null);
  const [getVariantId, variantData] = useLazyQuery(GET_VARIANT_ID, {
    onCompleted: (data) => {
      setVariantSizeID(data?.product?.productType?.variantAttributes[0]?.id)
      console.log("GET_VARIANT_ID",data?.product);
      console.log("GET_VARIANT_ID",data?.product?.productType?.variantAttributes[0]?.id);
    },
    onError: (err) => {
      setError();
    },
  });
  const [getCategoryDetails, categoryDetails] = useLazyQuery(
    GET_CATEGORY_DETAIL_SLUG
  );
  const [fetchCategories, categories] = useLazyQuery(SEARCH_CATEGORIES, {
    variables: {
      after: after?.categoriesAfter,
      first: 100,
      query: "",
    },

    onError: (err) => {
      console.log(err);
    },
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

    onError: (err) => {
      console.log(err);
    },
  });
  const [fetchWarehouse, warehouse] = useLazyQuery(SEARCH_WAREHOUSE_LIST, {
    variables: {
      after: after?.warehouseAfter,
      first: 100,
      query: "",
    },
    onCompleted: (data) => {
      // console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [getManufacturers, manufacturers] = useLazyQuery(
    GET_MANUFACTURERS_ASSIGNMENT_LIST,
    {
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const [getSubCategoryPricing, subcategoryPricing] = useLazyQuery(GET_SUBCATEGORY_MAKINGCHARGE, {
    onCompleted: (data) => {
      if(data == "")
        setError("No pricing available.");
      const mc = data?.categoryPrice[0];
      setSubcategoryPrice(mc);
      // setUpdate(moment());
      console.log(mc);
      console.log(data?.categoryPrice[0]?.makingCharge);
    },
    onError: (err) => {
      setError("No pricing available.");
    },
  });
  const [createProduct, product] = useMutation(CREATE_PRODUCT);
  const [saveVariants, variants] = useMutation(SAVE_VARIANTS);
  const [uploadImage, image] = useMutation(UPLOAD_PRODUCT_IMAGE, {
    variables: {
      alt: fileList[0]?.name,
      image: fileList[0]?.thumbUrl,
      product: product?.data?.ProductCreate?.id,
    },
    onCompleted: (data) => {
      setSuccess("Image updated.");
    },
    onError: (err) => {
      setError(err);
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
  const [occassion, setOccassion] = useState(['none']);
  const [community, setCommunity] = useState(['']);
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
  const [minWeight, setMinWeight] = useState('');
  const [maxWeight, setMaxWeight] = useState('');
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
  const [setAvailablility, available] = useMutation(SET_PRODUCT_AVAILABILITY, {
    onCompleted: (data) => {
      if (data.productSetAvailabilityForPurchase.errors?.length > 0) {
        setError(
          data.productSetAvailabilityForPurchase.errors[0]?.code +
            " " +
            data.productSetAvailabilityForPurchase.errors?.field
        );
      }
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  useEffect(() => {
    fetchTypes({
      variables: {
        after: after?.typeAfter,
        first: 100,
        query: "",
      },
    });
    fetchCategories();
    fetchCollections();
    fetchWarehouse();
    getDiamondGrades();
    getGemstoneShapes();
    getDiamondPrices();
  }, []);

  useEffect(() => {
    setPrimaryDiamondDetails(()=>({
      ...primaryDiamondDetails,
       tp:parseFloat(primaryDiamondDetails?.ppc) *parseFloat(primaryDiamondDetails?.tw) 
    }))
    
   },[primaryDiamondDetails.ppc, primaryDiamondDetails.tw])
  useEffect(() => {
    setSecondaryDiamondDetails(()=>({
      ...secondaryDiamondDetails,
       tp:parseFloat(secondaryDiamondDetails?.ppc) *parseFloat(secondaryDiamondDetails?.tw)
    }))
    
    
   },[secondaryDiamondDetails.ppc, secondaryDiamondDetails.tw])

  //  useEffect(() => {

  //  }, [update]);

  const handleSubmit = () => {
    setTrial("Creating new product");
    let temp = structuredClone(productVar)
    temp.attributes[29].values = JSON.stringify([{ ...primaryDiamondDetails }, { ...secondaryDiamondDetails }, { ...otherGemstoneDetails }])
    temp.attributes[25].values = false;
    temp.attributes[12].values = [];
    temp.attributes[21].values = false;
    temp.attributes[22].values = false;
   
    setProductVar(()=>temp)
    createProduct({
      variables: {
        input: {
          attributes: temp.attributes,
          basePrice: 0,
          category: queries?.subCategoryQuery,
          chargeTaxes: true,
          collections: queries?.collectionQuery,
          descriptionJson: "{}",
          isPublished: productVar?.isPublished,
          name: productVar?.name,
          slug:
            productVar?.name?.split(" ")?.join("_") +
            "_" +
            Date.now() +
            (Date.now()-parseInt(Math.random())),
          productType: queries?.typeQuery,
          publicationDate: productVar?.publicationDate,
          seo: { description: "", title: "" },
          visibleInListings: productVar?.visibleInListings,
        },
      },

      onCompleted: (data) => {
        if (data?.productCreate?.product) {
          setSuccess("Created new product");
          if (fileList[0])
            uploadImage({
              variables: {
                alt: fileList[0]?.name,
                image: fileList[0],
                product: data?.productCreate?.product?.id,
              },
            });
          setAvailablility({
            variables: {
              isAvailable: true,
              productId: data?.productCreate.product?.id,
              startDate: null,
            },
          });
          

          let tempAttr = structuredClone(productVar);
          tempAttr.attributes[18].values[0] = data?.productCreate.product?.id;
          // tempAttr.attributes[33].values[0] = productVar?.height;
          // tempAttr.attributes[34].values[0] = productVar?.width;
          setProductVar(tempAttr);
          setNewParent(tempAttr.attributes[18].values[0])
          setCurrentStep(2);
        } else
          setError(
            data?.productCreate?.errors[0]?.code +
              " " +
              data?.productCreate?.errors[0]?.field
          );
          getVariantId({
            variables:
            {
              id: data?.productCreate?.product?.id,
            }
          })
        },
      onError: (err) => {
        setError("Couldn't create new product");
      },
    });
  };
  let [sizesForMap, setSizesForMap] = useState([]);
  const beginMapping = (carats, sizes, colors) => {
    let actualSize = sizes;
    let minWt = parseFloat(weightRange?.min);
    let maxWt = parseFloat(weightRange?.max);

    const caratPercs = [
      {
        carat: 9,
        perc: 37.5,
      },
      {
        carat: 14,
        perc: 58.5,
      },
      {
        carat: 18,
        perc: 75,
      },
      {
        carat: 20,
        perc: 83.33,
      },
      {
        carat: 22,
        perc: 91.66,
      },
      {
        carat: 24,
        perc: 100,
      },
    ];
    caratPercs.forEach((carat) => {
      // if (carat.carat > providedKarat) {
      if (carat.carat < primaryCarat) 
        carat.perc = carat.perc - 1;
      else
        carat.perc = carat.perc + 1;
    });
    let updatedSize = []
    sizes.map((size) => {
      size = size.replace(" ", "")
      const dashIndex = size.indexOf('-');
      const openParenthesisIndex = size.indexOf('(');
      let extractedString = size;
      if (dashIndex !== -1 || openParenthesisIndex !== -1) {
        if (openParenthesisIndex === -1) {
          extractedString = size.substring(dashIndex + 1);
        } else {
          extractedString = size.substring(dashIndex + 1, openParenthesisIndex);
        }
      }
      updatedSize.push(parseFloat(extractedString));
      console.log("size", extractedString)
    });
    const sortedSizes = updatedSize.sort((a, b) => {
      const displayOrderA = a;
      const displayOrderB = b;
      return displayOrderA - displayOrderB;
    });
    sizes = sortedSizes;   
    setSizes((prev) => prev.sort((a, b) => a - b));
    setSizesForMap(sizes);
    console.log("AddProduct sizes 535 ", sizes);
    const minSize = parseFloat(sizes[0]);
    const maxSize = parseFloat(sizes[sizes.length - 1]);

    // Generate empty mapping
    let mapping = {};
    let maxkMapping = {};
    sizes.forEach((size) => {
      mapping[parseFloat(size)] = {};
    });

    // Populate headers
    sizes.forEach((size) => {
      maxkMapping[parseFloat(size)] =
        minWt +
        ((parseFloat(size) - minSize) / (maxSize - minSize)) * (maxWt - minWt);
    });

    //(C8+(((B9-B8)/(B22-B8))*(C22-C8))
    // Populate values
    let cnt = 0;
    let previousSize = null;
    carats.forEach((carat) => {
      sizes.forEach((size) => {
        colors.forEach((color, idx) => {
          let tempPerc = caratPercs.filter((car) => car.carat == carat)[0].perc;
          console.log("line 559", maxkMapping[parseFloat(size)], tempPerc, size);
          mapping[parseFloat(size)][`${parseInt(carat)}@${color}`] = {
            enable: true,
            origionalSize: actualSize[cnt],
            value: ((maxkMapping[parseFloat(size)] * tempPerc) / 100).toFixed(
              2
            ),
          };
        });
        if (previousSize != size) {
          cnt = cnt + 1;
          previousSize = size;
        }
      });
    });
    console.log("mapping 569-->", mapping)
    setLocalMapping(mapping);
  };

  const createVariants = async () => {   
    for (const size of (sizesForMap)) {
      const entries = Object.entries(localMapping[parseFloat(size)]);
      for (const [value, idx] of entries) {
        if (localMapping[parseFloat(size)][value]?.enable) {
            let carat = value.split("@")[0];
            getSubCategoryPricing({
              variables:{
                metalType: metalType,
                category: category,
                subcategory: subCategory,
                carat: carat
              }
            });
            console.log(subcategoryPrice);
            let color = value.split("@")[1];
            console.log("color",color)
            console.log("carat", carat)
            console.log("value", value.split("  "))
            // color.shift();
            console.log("localMapping[parseFloat(size)][value[0]]?.value",localMapping[parseFloat(size)][value]?.value)
            console.log("localMapping",localMapping)
            let weight = localMapping[parseFloat(size)][value]?.value ?? 0;
            let hallmark = localMapping[parseFloat(size)][value]
              ?.hallmark ?? ["false"];
            let ready =
              localMapping[parseFloat(size)][value]?.ready ??
              "Made to order";
            let quantity =
              localMapping[parseFloat(size)][value]?.quantity ?? 1000;
            let certified =
              JSON.stringify(hallmark) !== JSON.stringify(["false"])
                ? ["true"]
                : ["false"];
            let temp = structuredClone(productVar);
            temp.attributes[0].values = metalType;
            temp.attributes[8].values = studdedType;
            temp.attributes[5].values = carat;
            temp.attributes[1].values = [ready];
            temp.attributes[29].values = JSON.stringify([{ ...primaryDiamondDetails }, { ...secondaryDiamondDetails }, { ...otherGemstoneDetails }]);
            temp.attributes[24].values = gemstoneType;
            temp.attributes[9].values = [color];
            temp.attributes[18].values = newParent;
            temp.attributes[25].values = true;
            temp.attributes[12].values = [];
            temp.attributes[21].values = false;
            temp.attributes[22].values = false;
            temp.attributes[26].values = subcategoryPricing.makingChargeMode;
            temp.attributes[27].values = subcategoryPricing.wastageChargeMode;
            temp.attributes[30].values = subcategoryPricing.makingCharge;
            temp.attributes[31].values = subcategoryPricing.wastageCharge;
            console.log(temp.attributes[9]);

            await createProduct({
              variables: {
                input: {
                  attributes: temp.attributes,
                  basePrice: 0,
                  category: queries?.subCategoryQuery,
                  chargeTaxes: true,
                  collections: queries?.collectionQuery,  
                  weight: weight,
                  // isDesignBank: true,
                  descriptionJson: "{}",
                  isPublished: productVar?.isPublished,
                  name: productVar?.name,
                  slug:
                    productVar?.name?.split(" ")?.join("_") +
                    "_" +("_")+"_"+
                    Date.now() +
                    (Date.now()-parseInt(Math.random())),
                  productType: queries?.typeQuery,
                  publicationDate: productVar?.publicationDate,
                  seo: { description: "", title: "" },
                  visibleInListings: true,
                },
              },

              // eslint-disable-next-line no-loop-func
              onCompleted: (data) => {
                if (data?.productCreate?.product) {
                  console.log(
                    data.productCreate?.product?.attributes[18]?.values[0]?.name
                  );
                  if (fileList[0])
                    uploadImage({
                      variables: {
                        alt: fileList[0]?.name,
                        image: fileList[0],
                        product: data?.productCreate?.product?.id,
                      },
                    });
                  setAvailablility({
                    variables: {
                      isAvailable: true,
                      productId: data?.productCreate.product?.id,
                      startDate: null,
                    },
                  });
                  saveVariants({
                    variables: {
                      input: {
                        attributes: [
                          {
                            id: variantSizeID,
                            values: [`${getActualSize(size) ? getActualSize(size) :size}`],
                          },
                          {
                            id: "QXR0cmlidXRlOjc3",
                            values: JSON.stringify([{ ...primaryDiamondDetails }, { ...secondaryDiamondDetails }, { ...otherGemstoneDetails }]) ?? [
                              "none",
                            ],
                          },
                          // {
                          //   id: "QXR0cmlidXRlOjEy",
                          //   values : studdedType,
                          // },
                          // {
                          //   id: "QXR0cmlidXRlOjEw",
                          //   values : community,
                          // },
                          // {
                          //   id: "QXR0cmlidXRlOjEx",
                          //   values : occassion,
                          // },
                          {
                            id: "QXR0cmlidXRlOjc4",
                            values: [`${diamondPrice}`],
                          },
                          {
                            id: "QXR0cmlidXRlOjc5",
                            values: ["none"],
                          },
                          // {
                          //   id: "QXR0cmlidXRlOjg=",
                          //   values: gender,
                          // },
                          {
                            id: "QXR0cmlidXRlOjUz",
                            values: hallmark ?? ["none"],
                          },
                          {
                            id: "QXR0cmlidXRlOjgx",
                            values: certified ?? ["false"],
                          },
                          {
                            id: "QXR0cmlidXRlOjY5",
                            values: [`${weight}`],
                          },
                          {
                            id: "QXR0cmlidXRlOjU5",
                            values: ["0"],
                          },
                          {
                            id: "QXR0cmlidXRlOjYx",
                            values: [`${weight}`],
                          },
                          {
                            id: "QXR0cmlidXRlOjgw",
                            values: ["0"],
                          },
                          {
                            id: "QXR0cmlidXRlOjg1",
                            values: productVar?.attributes[30]?.values ?? ["0"],
                          },
                          {
                            id: "QXR0cmlidXRlOjg2",
                            values: productVar?.attributes[31]?.values ?? ["0"],
                          },
                        ],
                        costPrice: 50000 * weight, // fix price
                        price: 50000 * weight, // fix price
                        product: data?.productCreate.product?.id, //product ID
                        // parentProduct: newParent,
                        sku: `{${color}-${carat}k-weight${weight}-${Date.now()}}`,
                        stocks: [
                          {
                            quantity: quantity ?? 100, // intially set with 0
                            warehouse:
                              "V2FyZWhvdXNlOmE3ZGM0YzRhLTZhYjAtNDQ4ZS1iZDRiLTJiOTcyNTI3NTkxNw==",
                          },
                        ],
                        trackInventory: true,
                        weight: weight,
                      },
                    },
                    onCompleted: (data) => {
                      if (data.productVariantCreate?.errors?.length > 0)
                        console.log("Line AddProduct 761",
                          carat +
                            " " +
                            color +
                            " " +
                            weight +
                            " " +
                            data?.productVariantCreate?.errors[0]?.code +
                            " " +
                            data?.productVariantCreate?.errors[0]?.field
                        );
                      else
                        // setSuccess(
                        //   "Saved new Variant" +
                        //     carat +
                        //     " " +
                        //     color +
                        //     " " +
                        //     weight +
                        //     " "
                        // );
                        console.log("Line AddProduct 782",data.productVariantCreate.attributes.sku);
                    },
                    // onError: (err) => {
                    //   setError("Couldnt save new variant");
                    // },
                  });
                  setSuccess("Created new Variant");
                } 
                else
                  setError(
                    data?.productCreate?.errors[0]?.code +
                      " " +
                      data?.productCreate?.errors[0]?.field
                  );
              },
              onError: (err) => {
                setError("Couldn't save new variant");
              },
            });
          }
        }
      
      // window.location.href = '/dashboard/b2b/products/'
    }
    // carats.forEach((carat) => {
    //   sizes.forEach((size) => {
    //     colors.forEach((color, idx) => {
    //       console.log(localMapping[parseFloat(size)][`${carat} ${color}`]);
    //       // if (localMapping[parseFloat(size)][`${carat} ${color}`]?.enable) {
    //       //   console.log(
    //       //     carat,
    //       //     size,
    //       //     color,
    //       //     localMapping[parseFloat(size)][`${carat} ${color}`]?.value
    //       //   );
    //       // }
    //     });
    //   });
    // });
  };
  useEffect(() => {
    beginMapping(carats, sizes, colors);
  }, [sizes, productVar, weightRange]);

  let getActualSize = (sizeGiven) => {
    let dataOfSize = sizes.filter(str => str.includes("-") ? str.includes(`-${sizeGiven}`) : str.includes(`${sizeGiven} `));
    console.log("828 dataOfSize", dataOfSize)
    if (dataOfSize) {
      for (let dataSize of dataOfSize) {
        if (dataSize.includes("-")) {
          const stringWithoutParentheses = dataSize.split('(')[0].trim();
          if (stringWithoutParentheses.includes(`-${sizeGiven} `)) {
            return [dataSize];
          }
        } else {
          return [dataSize];
        }
      }
      console.log("840 dataOfSize", dataOfSize, "sizeGiven", sizeGiven)
      return dataOfSize[0];
    } else {
      return sizeGiven;
    }
  }
  // useEffect(() => {
  //   console.log(productVar);
  // }, [productVar]);
  return (
    <>
      {contextHolder}
      <section className='w-11/12 py-4'>
        {" "}
        <SectionTitle title='Add New Product' />
        <Divider className='dark:bg-white/10' />
        <Steps
          current={currentStep}
          onChange={(e) => setCurrentStep(e)}
          size='small'
          id='productSteps'
          items={[
            {
              title: (
                <span className='dark:text-slate-200'>Basic Details</span>
              ),
              description: "",
            },
            {
              title: (
                <span className='dark:text-slate-200'>Add attributes</span>
              ),
              description: "",
            },
            {
              title: (
                <span className='dark:text-slate-200'>Create Variants</span>
              ),
              description: "",
            },
          ]}
        />
      </section>
      <form className='py-4 w-full'>
        <section
          id='_1'
          style={{ display: currentStep == 0 ? "flex" : "none" }}
          className='flex-col w-full gap-2 md:gap-5 '
        >
          <MultiImageUpload setImages={(e) => setFileList(e)}  />
          <section className=' row flex flex-wrap gap-4 w-full items-center'>
            <div className='w-full md:w-10/12'>
              <InputComponent
                required={true}
                placeholder='Enter Product Name'
                maxLength={100}
                title='Product Name *'
                showCount={true}
                handleChange={(e) => {
                  setProductVar({ ...productVar, name: e.target.value });
                  // setName(e.target.value);
                }}
                allowClear={true}
              />
            </div>
            {/* <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              /> */}
          </section>
          <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
            {/* <SelectComponent
              placeholder='Select product category'
              title='Product Category'
              required={true}
              value={queries?.categoryQuery || null}
              loading={categories?.loading}
              options={categories?.data?.search?.edges?.map((edge) => {
                return {
                  value: edge?.node?.id,
                  label: edge?.node?.name,
                };
              })}
              handleChange={(e) => {
                fetchSingleCategory({
                  variables: { first: 100, id: e },
                });
                setQueries({
                  ...queries,
                  categoryQuery: e != undefined ? e : "",
                });
              }}
              className='w-full md:w-2/5'
            /> */}
            <SelectComponent
              placeholder='Select product category'
              title='Product Category *'
              required={true}
              value={queries?.typeQuery || null}
              loading={types?.loading}
              options={types?.data?.search?.edges?.map((edge) => {
                return {
                  value: edge?.node?.id,
                  label: edge?.node?.name,
                };
              })}
              handleChange={(e) => {
                const selectedCategoryId = e !== undefined ? e : "";
                setCatgeory(e);
                fetchTypes({
                  variables: {
                    after: null,
                    first: 100,
                    query:
                    selectedCategoryId !== ""
                    ? types?.data?.search?.edges?.filter((edge) => edge?.node?.id === selectedCategoryId)[0]?.node?.name
                    : "",
                  },
                  onCompleted: (data) => {
                    const selectedCategory = types?.data?.search?.edges?.find((edge) => edge?.node?.id === selectedCategoryId)?.node;
                    console.log("Selected Category:", selectedCategory);
                    getCategoryDetails({
                      variables: {
                        first: 100,
                        after: "",
                        last: 0,
                        before: "",
                        slug: selectedCategory?.slug || "",
                      },
                      onCompleted: (data) => {
                        console.log(data);
                        fetchSingleCategory({
                          variables: { first: 100, id: data?.category?.id },
                        });
                      },
                      onError: (err) => {
                        console.log(err);
                      },
                    });
                    setAttributeList(
                      data?.search?.edges[0]?.node?.productAttributes?.map(
                        (attr) => {
                          return {
                            id: attr?.id,
                            name: attr?.name,
                            type: attr?.inputType,
                            required: attr?.valueRequired,
                            options: attr?.values?.map((val) => {
                                return { 
                                  value: val?.name, label: val?.name 
                                };
                            }),
                          };
                        }
                      )
                    );
                    setTimeout(() => {
                      setProductVar({
                        ...productVar,
                        attributes:
                          data?.search?.edges[0]?.node?.productAttributes?.map(
                            (attr, idx) => {
                              return {
                                id: attr?.id,
                                values:
                                  idx == 18
                                    ? ["0"]
                                    : idx == 17
                                    ? ["3"]
                                    : ["none"],
                              };
                            }
                          ),
                      });
                    }, 0);
                  },
                });
                setQueries({
                  ...queries,
                  typeQuery: e != undefined ? e : "",
                });
              }}
              className='w-full md:w-2/5'
            />
            <SelectComponent
              placeholder='Select Sub category'
              title='Sub Category'
              required={true}
              value={queries?.categoryQuery || null}
              loading={singleCategory?.loading}
              options={singleCategory?.data?.category?.children?.edges?.map(
                (edge) => {
                  return {
                    value: edge?.node?.id,
                    label: edge?.node?.name,
                  };
                }
              )}
              handleChange={(e) => {
                getManufacturers({
                  variables: { first: 100, subCategoryId: e },
                });
                getSubcategoryData({
                  variables: { first: 100, id: e },
                });
                getSubcategoryMetaData({
                  variables: { subcategoryId: e },
                  onCompleted: (data) =>
                    console.log("subcategoryMetaData", data),
                });

                setQueries({
                  ...queries,
                  subCategoryQuery: e != undefined ? e : "",
                });
                setSubCategory(e);
              }}
              className='w-full md:w-2/5'
            />
          </section>
          <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
            <SelectComponent
              placeholder='Select product collection'
              title='Product Collection'
              required={true}
              mode='multiple'
              value={queries?.collectionQuery}
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
            <SelectComponent
              placeholder='Select manufacturers'
              title='Manufacturers'
              required={true}
              loading={manufacturers?.loading}
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
                let tempData = structuredClone(productVar?.attributes);
                tempData[32].values = [tempObj?.id];
                tempData[31].values = [tempObj?.wastageCharge];
                tempData[30].values = [tempObj?.makingCharge];
                tempData[27].values = [tempObj?.wastageChargeMode];
                tempData[26].values = [tempObj?.makingChargeMode];
                setProductVar({
                  ...productVar,
                  attributes: tempData,
                });
              }}
              className='w-full md:w-2/5'
            />
            {/* <SelectComponent
              placeholder='Select warehouse'
              title='Warehouse'
              required={true}
              loading={warehouse?.loading}
              options={[
                {
                  value: "IN",
                  label: "INDIA",
                },
              ]}
              // options={warehouse?.data?.warehouses?.edges?.map((edge) => {
              //   return {
              //     value: edge?.node?.id,
              //     label: edge?.node?.name,
              //   };
              // })}
              handleChange={(e) =>
                setQueries({
                  ...queries,
                  warehouseQuery: e != undefined ? e : "",
                })
              }
              className='w-full md:w-2/5'
            /> */}
          </section>

          <Button
            type='primary'
            disabled={(!fileList.length) || productVar?.name === '' || category === '' || subCategory === '' || currentManufacturer === ''}
            className='text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300'
            onClick={() => setCurrentStep(1)}
            ref={section1Button}
          >
            Next
          </Button>
        </section>

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
                    <SelectComponent
                      placeholder={"Select metal Type"}
                      title={"Metal Type *"}
                      required={true}
                      loading={types?.loading}
                      options={Array(
                        subcategoryMetaData?.data?.category?.metadata[4]?.value
                      )[0]
                        ?.replace("[", "")
                        .replace("]", "")
                        ?.split(",")
                        .sort((a, b) => a.localeCompare(b))
                        ?.map((item) => ({
                          value: item.replace("'", "").replace("'", ""),
                          label: item
                            .replace("'", "")
                            .replace("'", "")
                            ?.toUpperCase(),
                        }))}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[0].values = [e];
                        setMetalType(e);
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    {/* <SelectComponent
                      placeholder={"Select availability"}
                      title={"Availability *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[1]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[1].values = [e];
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    <SelectComponent
                      placeholder={"Select community/region"}
                      title={"Community/region *"}
                      required={true}
                      loading={types?.loading}
                      options={Array(
                        subcategoryMetaData?.data?.category?.metadata[2]?.value
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
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[2].values = [e];
                        setCommunity(e);
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    <SelectComponent
                      placeholder={"Select gender"}
                      title={"Gender *"}
                      required={true}
                      loading={types?.loading}
                      options={Array(
                        subcategoryMetaData?.data?.category?.metadata[3]?.value
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
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[3].values = [e];
                        setGender(e);
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    <SelectComponent
                      placeholder={"Select occassion"}
                      title={"Occassion *"}
                      required={true}
                      loading={types?.loading}
                      options={Array(
                        subcategoryMetaData?.data?.category?.metadata[6]?.value
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
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[4].values = [e];
                        setOccassion(e);
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "gold" && (
                        <SelectComponent
                          placeholder={"Select gold carats"}
                          title={"Gold Carats *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                            console.log(e,e[0]);
                            setCarat(e[0]);
                            getSubCategoryPricing({
                              variables:{
                                metalType: metalType,
                                category: category,
                                subcategory: subCategory,
                                carat: e[0],
                              }
                            });
                            setCarats(e);
                            console.log(e[0]);
                            let tempData = structuredClone(
                              productVar?.attributes
                            );
                            tempData[5].values = e[0];
                            tempData[6].values = 0;
                            tempData[7].values = 0;
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "platinum" && (
                        <SelectComponent
                          placeholder={"Select platinum carats"}
                          title={"Platinum Carats *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                              productVar?.attributes
                            );
                            tempData[5].values = 0;
                            tempData[6].values = e[0];
                            tempData[7].values = 0;
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "silver" && (
                        <SelectComponent
                          placeholder={"Select silver carats"}
                          title={"Silver Carats *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                              productVar?.attributes
                            );
                            tempData[5].values = 0;
                            tempData[6].values = 0;
                            tempData[7].values = e[0];
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    <SelectComponent
                      placeholder={"Select type"}
                      title={"Type *"}
                      required={true}
                      loading={types?.loading}
                      defaultValue={'Non Studded'}
                      options={attributeList[8]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[8].values = [e];
                        // setStudded()
                        setStuddedType(e);
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "gold" && (
                        <SelectComponent
                          placeholder={"Select Gold colors"}
                          title={"Gold Color *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                              productVar?.attributes
                            );
                            console.log(e[0]);
                            tempData[9].values = e[0];
                            tempData[10].values = ["none"];
                            tempData[11].values = ["none"];
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "platinum" && (
                        <SelectComponent
                          placeholder={"Select Platinum colors"}
                          title={"Platinum Color *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                              productVar?.attributes
                            );
                            tempData[9].values = ["none"];
                            tempData[10].values = e[0];
                            tempData[11].values = ["none"];
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {productVar?.attributes[0]?.values &&
                      productVar?.attributes[0]?.values[0] == "silver" && (
                        <SelectComponent
                          placeholder={"Select Silver colors"}
                          title={"Silver Color *"}
                          required={true}
                          // value={productVar?.attributes[idx]?.values[0]}
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
                              productVar?.attributes
                            );
                            tempData[9].values = ["none"];
                            tempData[10].values = ["none"];
                            tempData[11].values = e[0];
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
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
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[12].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Height"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Height"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter height in mm."}
                        title={"Height"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setHeight(e);
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[33].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Width"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Width"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter width in mm."}
                        title={"Width"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setWidth(e);
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[34].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <SelectComponent
                      placeholder={"Select primary carat"}
                      title={"Primary Carat *"}
                      required={true}
                      // value={productVar?.attributes[idx]?.values[0]}
                      // mode={"multiple"}
                      loading={types?.loading}
                      // options={Array(
                      //   subcategoryMetaData?.data?.category?.metadata[0]?.value
                      // )[0]
                      //   ?.replace("[", "")
                      //   .replace("]", "")
                      //   ?.split(",")
                      //   .sort((a, b) => a.localeCompare(b))
                      //   ?.map((item) => ({
                      //     value: item.replace("'", "").replace("'", ""),
                      //     label: item.replace("'", "").replace("'", ""),
                      //   }))}
                      // options={Array(
                      //   updatedCarats
                      // )
                      //   ?.replace("[", "")
                      //   .replace("]", "")
                      //   ?.split(",")
                      //   .sort((a, b) => a.localeCompare(b))
                      //   ?.map((item) => ({
                      //     value: item.replace("'", "").replace("'", ""),
                      //     label: item.replace("'", "").replace("'", ""),
                      //   }))
                      // }
                      options={caratoptions}
                      handleChange={(e) => {
                        setPrimaryCarat(e);
                      }}
                      className='w-full md:w-[46%]'
                    />
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
                        // options={attributeList[13]?.options}
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[13].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
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
                        htmlFor={"Max weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Max weight range"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Max weight range"}
                        title={"Max weight range"}
                        loading={types?.loading}
                        // options={attributeList[14]?.options}
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[14].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                          setWeightRange(() => ({
                            ...weightRange,
                            max: parseFloat(e),
                          }));
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
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[15].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
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
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[16].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
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
                        att
                        options={attributeList[17]?.options}
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[17].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
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
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[18].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    <SelectComponent
                      placeholder={"Select sizes"}
                      title={"Sizes *"}
                      required={true}
                      // value={productVar?.attributes[idx]?.values[0]}
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
                        // let tempData = structuredClone(productVar?.attributes);
                        // tempData[idx].values =
                        //   attr?.type == "MULTISELECT" ? e : [e];
                        // setProductVar({
                        //   ...productVar,
                        //   attributes: tempData,
                        // });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    {/* <SelectComponent
                      placeholder={"Select made to order size"}
                      title={"Made to order size *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[19]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[19].values = [e];
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}

                    {/* {productVar?.attributes[8]?.values &&
                      productVar?.attributes[8]?.values[0] == "Studded" && (
                        <SelectComponent
                          placeholder={"Select is common gemstone"}
                          title={"Is common gemstone *"}
                          required={true}
                          loading={types?.loading}
                          options={attributeList[20]?.options}
                          handleChange={(e) => {
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.attributes
                            );
                            tempData[20].values = [e];
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )} */}

                    {/* <SelectComponent
                      placeholder={"Select is common making charge"}
                      title={"Is common making charge *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[21]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[21].values = [e];
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    <SelectComponent
                      placeholder={"Select is common wastage charge"}
                      title={"Is common wastage charge *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[22]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[22].values = [e];
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    />
                    {/* {productVar?.attributes[8]?.values &&
                      productVar?.attributes[8]?.values[0] == "Studded" && (
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
                            onChange={(e) => {
                              console.log(e);
                              let tempData = structuredClone(
                                productVar?.attributes
                              );
                              tempData[23].values = [e];
                              setProductVar({
                                ...productVar,
                                attributes: tempData,
                              });
                            }}
                            className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                          />
                        </div>
                      )} */}
                    {/* multi */}
                    {productVar?.attributes[8]?.values &&
                      productVar?.attributes[8]?.values[0] == "Studded" && (
                        <SelectComponent
                          placeholder={"Select gemstone type"}
                          title={"Gemstone type *"}
                          required={true}
                          loading={types?.loading}
                          mode={"multiple"}
                          options={attributeList[24]?.options}
                          handleChange={(e) => {
                            console.log(e);
                            let tempData = structuredClone(
                              productVar?.attributes
                            );
                            tempData[24].values = e;
                            setGemstoneType(e);
                            setProductVar({
                              ...productVar,
                              attributes: tempData,
                            });
                          }}
                          className='w-full md:w-[46%]'
                        />
                      )}
                    {/* <SelectComponent
                      placeholder={"Select is design bank"}
                      title={"Is design bank *"}
                      required={true}
                      loading={types?.loading}
                      options={attributeList[25]?.options}
                      handleChange={(e) => {
                        console.log(e);
                        let tempData = structuredClone(productVar?.attributes);
                        tempData[25].values = [e];
                        setProductVar({
                          ...productVar,
                          attributes: tempData,
                        });
                      }}
                      className='w-full md:w-[46%]'
                    /> */}
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Making charge mode *"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Making charge mode *"}
                      </label>
                      <AutoComplete
                        placeholder={"Select making charge mode"}
                        title={"Making charge mode *"}
                        required={true}
                        loading={types?.loading}
                        // options={attributeList[26]?.options}
                        value={
                          subcategoryPrice?.makingChargeMode
                        }
                        disabled
                        handleChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(productVar?.attributes);
                          tempData[26].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
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
                        loading={types?.loading}
                        // options={attributeList[27]?.options}
                        value={
                          subcategoryPrice?.wastageChargeMode
                        }
                        disabled
                        handleChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(productVar?.attributes);
                          tempData[27].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
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
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[28].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}

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
                        // options={attributeList[30]?.options}
                        value={
                         subcategoryPrice?.makingCharge
                        }
                        // onChange={(e) => {
                        //   console.log(e);
                        //   let tempData = structuredClone(
                        //     productVar?.attributes
                        //   );
                        //   tempData[30].values = [e];
                        //   setProductVar({
                        //     ...productVar,
                        //     attributes: tempData,
                        //   });
                        // }}
                        className='antdSelect w-full rounded-md w-full dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Wastage Charge Product"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Wastage Charge Product"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter wastage charge"}
                        title={"Wastage Charge Product"}
                        loading={types?.loading}
                        disabled
                        // options={attributeList[31]?.options}
                        value={subcategoryPrice?.wastageCharge}
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[31].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full dark:text-white dark:bg-slate-700 border-white/50  dark:placeholder:text-white m-2'
                      />
                    </div>
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"manufacturer id"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Manufacturer id"}
                      </label>

                      <AutoComplete
                        placeholder={"Enter manufacturer id"}
                        title={"manufacturer id"}
                        loading={types?.loading}
                        options={attributeList[32]?.options}
                        value={
                          productVar?.attributes[32]?.values &&
                          productVar?.attributes[32]?.values[0]
                        }
                        onChange={(e) => {
                          console.log(e);
                          let tempData = structuredClone(
                            productVar?.attributes
                          );
                          tempData[32].values = [e];
                          setProductVar({
                            ...productVar,
                            attributes: tempData,
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div> */}
                    {/* <div className='flex flex-col items-start w-full md:w-[46%]'>
                      <label
                        htmlFor={"Min weight range"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Min 24k weight range"}
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
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:text-white dark:placeholder:text-white  m-2'
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
                        placeholder={"Enter 24k Max weight range"}
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
                                // value={productVar?.attributes[idx]?.values[0]}
                                mode={attr?.type == "MULTISELECT" && "multiple"}
                                loading={types?.loading}
                                options={attr?.options}
                                handleChange={(e) => {
                                  let tempData = structuredClone(
                                    productVar?.attributes
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
                                      productVar?.attributes
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
                      isPublished: e.target.value,
                    })
                  }
                  value={productVar?.isPublished}
                  className='flex flex-col gap-y-2'
                >
                  <Radio
                    value={true}
                    defaultChecked
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
                        visibleInListings: e.target.checked,
                      })
                    }
                    defaultChecked
                    value={productVar?.visibleInListings || false}
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
              {productVar?.attributes[8]?.values &&
                productVar?.attributes[8]?.values[0] == "Studded" &&
                productVar?.attributes[24]?.values?.filter(stone=>stone=="Diamond")?.length>0&&
                <>
                <Card
                  title={
                    <label className='font-semibold dark:text-slate-100'>
                      Primary Diamond
                    </label>
                  }
                  className='w-full flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
                >
               
                  <>
                    <div className='flex flex-col items-start w-full'>
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
                        options={Object.entries(diamondRates).map((item) => ({
                          value: `${item[0]}:${item[1]}`,
                          label: `${item[0]}:${item[1]}`,
                        }))}
                        onChange={(e) => {
                          let pattern = /(.+)/;
                          let val = structuredClone(diamondRates);
                          console.log(
                            {
                              shape: e.split(":")[0]?.split(",")[0],
                              size: e.split(":")[0]?.split(",")[1],
                              dg: e.split(":")[0]?.split(",")[2],
                              dri: e.split(":")[0],
                              price: parseFloat(e.split(":")[1])
                            })
                          for (let i of Object.entries(val)) {
                            // console.log(i);
                            if (i[0]?.includes(e.toUpperCase())) {
                              setDiamondPrice(i[1]);
                                
                            }
                          }
                          setPrimaryDiamondDetails({
                            ...primaryDiamondDetails,
                            name: "Diamond",
                            shape: e.split(":")[0]?.split(",")[0],
                            size: e.split(":")[0]?.split(",")[1],
                            dg: e.split(":")[0]?.split(",")[2],
                            dri: e.split(":")[0],
                            ppc: parseFloat(e.split(":")[1]),
                          });
                            
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Gemstone weight"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone weight"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Gemstone Weight"}
                        title={"Gemstone Weight"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setPrimaryDiamondDetails({
                            ...primaryDiamondDetails,
                            tw: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"No.of pieces"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"No.of pieces"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter No.of pieces"}
                        title={"No.of pieces"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setPrimaryDiamondDetails({
                            ...primaryDiamondDetails,
                            nop: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    Total Price:
                    {primaryDiamondDetails.tp}
                  </>
                </Card>
          
                <Card
                  title={
                    <label className='font-semibold dark:text-slate-100'>
                      Secondary Diamond
                    </label>
                  }
                  className='w-full flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
                >
               
                  <>
                    <div className='flex flex-col items-start w-full'>
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
                        options={Object.entries(diamondRates).map((item) => ({
                          value: `${item[0]}:${item[1]}`,
                          label: `${item[0]}:${item[1]}`,
                        }))}
                        onChange={(e) => {
                          let pattern = /\(.+\)/;
                          let val = structuredClone(diamondRates);
                          console.log(
                            {
                              shape: e.split(":")[0]?.split(",")[0],
                              size: e.split(":")[0]?.split(",")[1],
                              dg: e.split(":")[0]?.split(",")[2],
                              dri: e.split(":")[0],
                              price: parseFloat(e.split(":")[1])
                            })
                          for (let i of Object.entries(val)) {
                            // console.log(i);
                            if (i[0]?.includes(e.toUpperCase())) {
                              setDiamondPrice(i[1]);
                                
                            }
                          }
                          setSecondaryDiamondDetails({
                            ...secondaryDiamondDetails,
                            name: "Diamond",
                            shape: e.split(":")[0]?.split(",")[0],
                            size: e.split(":")[0]?.split(",")[1],
                            dg: e.split(":")[0]?.split(",")[2],
                            dri: e.split(":")[0],
                            ppc: parseFloat(e.split(":")[1]),
                          });
                            
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Gemstone weight"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone weight"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Gemstone Weight"}
                        title={"Gemstone Weight"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setSecondaryDiamondDetails({
                            ...secondaryDiamondDetails,
                            tw: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"No.of pieces"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"No.of pieces"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter No.of pieces"}
                        title={"No.of pieces"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setSecondaryDiamondDetails({
                            ...secondaryDiamondDetails,
                            nop: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    Total Price:
                    {secondaryDiamondDetails.tp}
                  </>
                </Card>
                </>
                  }
              {productVar?.attributes[8]?.values &&
                productVar?.attributes[8]?.values[0] == "Studded" &&
                
                <Card
                  title={
                    <label className='font-semibold dark:text-slate-100'>
                      {(productVar?.attributes[24]?.values?.filter(stone=>stone!=="Diamond")[0])}
                    </label>
                  }
                  className='w-full flex flex-col gap-y-2 dark:bg-slate-800 dark:text-slate-100'
                >
               
                  <>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Gemstone Shape"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone Shape"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Gemstone Shape"}
                        title={"Gemstone Shape"}
                        loading={types?.loading}
                        
                        onChange={handleGemstoneShapeChange}
                        options={option}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Gemstone Size"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone Size"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Gemstone Size"}
                        title={"Gemstone Size"}
                        loading={types?.loading}
                        
                        onChange={(e) => {
                          
                          setOtherGemstoneDetails({
                            ...otherGemstoneDetails,                            
                            size: parseFloat(e),
                          });
                            
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Gemstone weight"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Gemstone weight"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Gemstone Weight"}
                        title={"Gemstone Weight"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setOtherGemstoneDetails({
                            ...otherGemstoneDetails,
                            tw: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"No.of pieces"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"No.of pieces"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter No.of pieces"}
                        title={"No.of pieces"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setOtherGemstoneDetails({
                            ...otherGemstoneDetails,
                            nop: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                      <label
                        htmlFor={"Total price"}
                        className='font-semibold dark:text-slate-300 text-sm'
                      >
                        {"Total price"}
                      </label>
                      <AutoComplete
                        placeholder={"Enter Total price"}
                        title={"Total price"}
                        loading={types?.loading}
                        onChange={(e) => {
                          setOtherGemstoneDetails({
                            ...otherGemstoneDetails,
                            tp: parseFloat(e),
                          });
                        }}
                        className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                      />
                    </div>
                    
                  </>
                </Card>
                  }
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
                      chargeTaxes: e.target.value,
                    })
                  }
                  value={productVar?.chargeTaxes}
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
          {/* if(studdedType === 'Studded'){ */}
            {/* if(primaryDiamond) */}
           <Button
            type='primary'
            disabled={metalType === 'none' || gender === 'none' || community === '' || occassion === 'none' || carats === '' || colors === '' || sizes === '' || primaryCarat === ''}
            className='text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300'
            onClick={handleSubmit}
          >
            Create Product
          </Button> 
          {/* } */}
          
        </section>
        <section
          id='_3'
          style={{ display: currentStep == 2 ? "flex" : "none" }}
          className='flex-col w-full gap-2 md:gap-5 '
        >
          {localMapping && (
            <table className='variantTable overflow-x-scroll'>
              <tr>
                <td rowSpan={2}></td>
                {carats?.map((c) => (
                  <td colSpan={colors.length} rowSpan={2}>
                    {c}
                  </td>
                ))}
              </tr>
              <br />
              <tr>
                <th>Sizes</th>
                {carats?.map((c) => colors.map((col) => <th>{col}</th>))}
              </tr>

              <tbody>
                {sizesForMap &&
                  sizesForMap?.length > 0 &&
                  sizesForMap?.map((size,size_idx) => (
                    <tr>
                      <td>{getActualSize(size) ? getActualSize(size) :size}</td>
                      {localMapping[parseFloat(size)] &&
                        Object.entries(localMapping[parseFloat(size)]).map(
                          (value, row_idx) => (
                            <td>
                              <div className=''>
                                <label htmlFor=''>Select</label>
                                &nbsp;
                                <input
                                  type='checkbox'
                                  defaultChecked={true}
                                  onChange={(e) => {
                                    let temp = structuredClone(localMapping);
                                    temp[parseFloat(size)][value[0]].enable =
                                      e.target.checked;
                                    setLocalMapping(() => temp);
                                  }}
                                />
                              </div>

                              <div className=''>
                                <label htmlFor=''>Ready</label>
                                &nbsp;
                                <input
                                  type='checkbox'
                                  onChange={(e) => {
                                    let temp = structuredClone(localMapping);
                                    temp[parseFloat(size)][value[0]].ready = e
                                      .target.checked
                                      ? "Ready"
                                      : "Made to order";

                                    setLocalMapping(() => temp);
                                  }}
                                />
                              </div>
                              <div>Weight: {value[1]?.value}</div>

                              <div className=''>
                                <label htmlFor=''>Update Weight</label>
                                &nbsp;
                                <input
                                  type='text'
                                  className='dark:bg-slate-800'
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "4px",
                                    width: "100px",
                                    marginRight: "10px",
                                    padding: "0 5px",
                                  }}
                                  placeholder='Weight'
                                  onChange={(e) => {
                                    let temp = structuredClone(localMapping);
                                    temp[parseFloat(size)][value[0]].value =
                                      parseFloat(e.target.value);
                                    setLocalMapping(() => temp);
                                  }}
                                />
                              </div>
                              <div className=''>
                                <label htmlFor=''>Quantity</label>
                                &nbsp;
                                <input
                                  type='number'
                                  className='dark:bg-slate-800 mt-2'
                                  style={{
                                    border: "1px solid black",
                                    borderRadius: "4px",
                                    width: "100px",
                                    marginRight: "10px",
                                    padding: "0 5px",
                                  }}
                                  defaultValue={value?.quantity}
                                  placeholder='Quantity.'
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    let temp = structuredClone(localMapping);
                                    temp[parseFloat(size)][value[0]].quantity =
                                      e.target.value;
                                    setLocalMapping(() => temp);
                                  }}
                                />
                              </div>
                              <br />
                            </td>
                          )
                        )}
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          <div
            class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm text-center items-center justify-center'
            onClick={createVariants}
          >
            Create Variants
          </div>
        </section>
      </form>
    </>
  );
};

export default AddProduct;
