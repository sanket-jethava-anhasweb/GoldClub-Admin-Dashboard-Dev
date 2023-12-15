import { useLazyQuery, useMutation } from "@apollo/client";
import { AutoComplete, Button, Card, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  GET_VARIANT_QUERIES,
  VARIANT_DETAILS_DATA,
} from "../../../GraphQl/Query";
import Spinner from "../../../components/Spinner/Spinner";
import SelectComponent from "../../../components/Inputs/Select";
import InputComponent from "../../../components/Inputs/Input";
import {
  CREATE_VARIANTS,
  UPDATE_VARIANT,
  UPDATE_VARIANT_STOCK,
} from "../../../GraphQl/Mutations";
import NumberInputComponent from "../../../components/Inputs/Number";

const VariantEditor = (props) => {
  const params = useParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [searchParams] = useSearchParams();
  const [localVal, setLocalVal] = useState(null);
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
  const [attributes, setAttributes] = useState({});

  const [productVar, setProductVar] = useState({
    price: null,
    sku: null,
    quantity: null,
    stocks: {
      warehouse: null,
    },
  });

  const [fetchVariantDetails, variants] = useLazyQuery(GET_VARIANT_QUERIES, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {},
    onError: (err) => {
      setError(err.message);
    },
  });

  const [fetchVariantData, variantDetails] = useLazyQuery(VARIANT_DETAILS_DATA, {
    variables: {
      id: params.id,
    },
    onCompleted: (data) => {
      setAttributes(
        data?.product?.productType?.variantAttributes?.map((variant) => {
          return { id: variant?.id, values: null };
        })
      );
      let temp = data?.product?.variants?.filter(
        (variant) => variant?.id == searchParams.get("id")
      )[0];
      let temp_val = {};
      temp_val["quantity"] = temp?.stocks[0]?.quantity;
      temp_val["sku"] = temp?.sku;
      temp_val["attributes"] = temp.attributes?.map((attr) => ({
        id: attr.values[0].id,
        values: [attr.values[0].name],
      }));
      temp_val["warehouse"] = temp?.stocks[0]?.warehouse.id;
      temp_val["price"] = temp?.price?.amount;
      setLocalVal(temp_val);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [updateVariant, variantres] = useMutation(UPDATE_VARIANT_STOCK, {
    variables: {
      id: searchParams.get("id"),
      stocks: [
        {
          warehouse: localVal?.warehouse,
          quantity: localVal?.quantity,
        },
      ],
      //   input: {
      //     attributes: localVal?.attributes,
      //     sku: localVal?.sku,
      //     stocks: [
      //       {
      //         warehouse: localVal?.warehouse,
      //         quantity: localVal?.quantity,
      //       },
      //     ],
      //     trackInventory: true,
      //     price: localVal?.price,
      //     weight: null,
      //   },
    },
    onCompleted: (data) => {
      if (
        !data?.productVariantBulkCreate?.errors ||
        data?.productVariantBulkCreate?.errors?.length < 1
      ) {
        setSuccess("Variant Updated Successfully");
        setTimeout(() => {
          navigate("/dashboard/b2b/products/" + params?.id);
        }, 1000);
      } else setError("Couldn't create variant");
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const [updateVariantPrice, variantprice] = useMutation(UPDATE_VARIANT, {
    variables: {
      id: searchParams.get("id"),

      input: {
        // attributes: localVal?.attributes,
        // sku: localVal?.sku,
        // stocks: [
        //   {
        //     warehouse: localVal?.warehouse,
        //     quantity: localVal?.quantity,
        //   },
        // ],
        // trackInventory: true,
        price: localVal?.price,
        costPrice: localVal?.price,
        // weight: null,
      },
    },
    onCompleted: (data) => {
      if (
        !data?.productVariantBulkCreate?.errors ||
        data?.productVariantBulkCreate?.errors?.length < 1
      ) {
        setSuccess("Variant Updated Successfully");
        setTimeout(() => {
          navigate("/dashboard/b2b/products/" + params?.id);
        }, 1000);
      } else setError("Couldn't create variant");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleCreate = () => {
    setTrial("Updating variant");
    // console.log(productVar);
    // attributes?.forEach((attr) => {
    //   if (attr.values == null) {
    //     setError("Enter value for " + attr?.id);
    //     return;
    //   }
    // });
    setTimeout(() => {
      updateVariant();
      updateVariantPrice();
    }, 0);
  };

  useEffect(() => {
    fetchVariantDetails();
    fetchVariantData();
  }, []);
  useEffect(() => {
    console.log("local", localVal);
  }, [localVal]);

  return (
    <section id='_3' className='flex flex-col w-full gap-2 md:gap-5 py-4 '>
      {contextHolder}
      {(variants?.loading || variantres?.loading) && <Spinner />}
      {!variants?.loading && (
        <Card
          title='Variant Fields'
          // extra={
          //   <Button
          //     className="hidden lg:inline-flex text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300 text-center items-center justify-center"
          //     onClick={handleCreate}
          //   >
          //     Create Variant
          //   </Button>
          // }
        >
          {variantDetails?.data?.product?.productType?.variantAttributes?.map(
            (attribute, idx) => (
              <div className='flex items-center mb-4' key={attribute?.id}>
                <h5 className='font-bold w-2/5 '>
                  {attribute?.name}

                  {attribute?.valueRequired == "true" && (
                    <sup className='text-red-500'>*</sup>
                  )}
                </h5>
                <AutoComplete
                  className='w-3/5'
                  // mode="tags"
                  disabled={true}
                  placeholder={"Enter " + attribute?.name}
                  loading={variants?.loading}
                  options={attribute?.values?.map((value) => {
                    return { value: value?.name, label: value?.name };
                  })}
                  value={localVal && localVal?.attributes[idx]?.values[0]}
                  required={attribute?.valueRequired}
                  onChange={(e) => {
                    let tempAttr = structuredClone(localVal);
                    console.log(tempAttr, e);
                    tempAttr.attributes[idx].values[0] = e;
                    setLocalVal(tempAttr);
                  }}
                />
              </div>
            )
          )}
          <div className='flex  items-center'>
            <h5 className='font-bold w-2/5 '>Quantity</h5>
            <InputComponent
              placeholder='Enter quantity'
              className='w-3/5'
              value={localVal?.quantity}
              handleChange={(e) =>
                setLocalVal({
                  ...localVal,
                  quantity: e.target.value,
                })
              }
            />
          </div>
          <div className='flex  items-center my-4'>
            <h5 className='font-bold w-2/5 '>Warehouse</h5>
            <h5>India</h5>
            {/* <SelectComponent
              className='w-3/5'
              placeholder={"Select Warehouse"}
              loading={variants?.loading}
              value={localVal?.warehouse}
              options={variants?.data?.warehouses?.edges?.map((value) => {
                return { value: value?.node?.id, label: value?.node?.name };
              })}
              required={true}
              handleChange={(e) => {
                console.log(e);
                // setProductVar({
                //   ...productVar,
                //   stocks: { ...productVar?.stocks, warehouse: e },
                // });
              }}
            /> */}
          </div>
          <div className='flex  items-center'>
            <h5 className='font-bold w-2/5 '>Price</h5>
            <NumberInputComponent
              type
              placeholder='Enter Price'
              className='w-3/5'
              defaultValue={localVal?.price}
              handleChange={(e) =>
                setLocalVal({
                  ...localVal,
                  price: e,
                })
              }
            />
          </div>
          <Button
            className=' inline-flex text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300 items-center justify-center'
            onClick={handleCreate}
          >
            Create Variant
          </Button>
        </Card>
      )}
    </section>
  );
};

export default VariantEditor;
