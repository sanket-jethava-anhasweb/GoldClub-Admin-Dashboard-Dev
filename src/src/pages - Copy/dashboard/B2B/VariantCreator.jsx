import { useLazyQuery, useMutation } from "@apollo/client";
import { AutoComplete, Button, Card, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_VARIANT_QUERIES,
  VARIANT_CREATE_DATA,
} from "../../../GraphQl/Query";
import Spinner from "../../../components/Spinner/Spinner";
import SelectComponent from "../../../components/Inputs/Select";
import InputComponent from "../../../components/Inputs/Input";
import { CREATE_VARIANTS } from "../../../GraphQl/Mutations";
import NumberInputComponent from "../../../components/Inputs/Number";

const VariantCreator = (props) => {
  const params = useParams();
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
    onCompleted: (data) => {
      console.log(data);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [fetchVariantData, variantDetails] = useLazyQuery(VARIANT_CREATE_DATA, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {
      console.log(data);
      setAttributes(
        data?.product?.productType?.variantAttributes?.map((variant) => {
          return { id: variant?.id, values: null };
        })
      );
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const [createVariant, variantres] = useMutation(CREATE_VARIANTS, {
    // variables: {
    //   id: params?.id,
    //   inputs: [
    //     {
    //       attributes: attributes,
    //       price: productVar?.price,
    //       sku: "Demo ",
    //       stocks: [
    //         {
    //           quantity: productVar?.stocks?.quantity,
    //           warehouse: productVar?.stocks?.warehouse,
    //         },
    //       ],
    //     },
    //   ],
    // },
    variables: {
      id: params?.id,
      product: params?.id,
      inputs: [
        {
          attributes: attributes,
          sku: variantDetails?.data?.product?.name + productVar?.sku,
          stocks: [
            {
              warehouse: productVar?.stocks?.warehouse,
              quantity: 45,
            },
          ],
          trackInventory: true,
          price: productVar?.price,
          weight: 10,
        },
      ],
    },
    onCompleted: (data) => {
      if (
        !data?.productVariantBulkCreate?.errors ||
        data?.productVariantBulkCreate?.errors?.length < 1
      ) {
        setSuccess("Variant Created Successfully");
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
    setTrial("Creating variant");
    // console.log(productVar);
    // attributes?.forEach((attr) => {
    //   if (attr.values == null) {
    //     setError("Enter value for " + attr?.id);
    //     return;
    //   }
    // });
    setProductVar({
      ...productVar,
      sku: attributes?.map((item) => item.values).join(""),
    });
    setTimeout(() => {
      createVariant();
    }, 0);
  };

  useEffect(() => {
    fetchVariantDetails();
    fetchVariantData();
  }, []);

  return (
    <section id="_3" className="flex flex-col w-full gap-2 md:gap-5 py-4 ">
      {contextHolder}
      {(variants?.loading || variantres?.loading) && <Spinner />}
      {!variants?.loading && (
        <Card
          title="Variant Fields"
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
              <div className="flex items-center mb-4" key={attribute?.id}>
                <h5 className="font-bold w-2/5 ">
                  {attribute?.name}

                  {attribute?.valueRequired == "true" && (
                    <sup className="text-red-500">*</sup>
                  )}
                </h5>
                <AutoComplete
                  className="w-3/5"
                  // mode="tags"
                  placeholder={"Enter " + attribute?.name}
                  loading={variants?.loading}
                  options={attribute?.values?.map((value) => {
                    return { value: value?.name, label: value?.name };
                  })}
                  required={attribute?.valueRequired}
                  onChange={(e) => {
                    // let id = attribute?.id;
                    let tempAttr = structuredClone(attributes);
                    tempAttr[idx].values = [e];
                    setAttributes(tempAttr);
                  }}
                />
              </div>
            )
          )}
          <div className="flex  items-center">
            <h5 className="font-bold w-2/5 ">Quantity</h5>
            <InputComponent
              placeholder="Enter quantity"
              className="w-3/5"
              handleChange={(e) =>
                setProductVar({
                  ...productVar,
                  quantity: e,
                })
              }
            />
          </div>
          <div className="flex  items-center">
            <h5 className="font-bold w-2/5 ">Warehouse</h5>
            <SelectComponent
              className="w-3/5"
              placeholder={"Select Warehouse"}
              loading={variants?.loading}
              options={variants?.data?.warehouses?.edges?.map((value) => {
                return { value: value?.node?.id, label: value?.node?.name };
              })}
              required={true}
              handleChange={(e) => {
                console.log(e);
                setProductVar({
                  ...productVar,
                  stocks: { ...productVar?.stocks, warehouse: e },
                });
              }}
            />
          </div>
          <div className="flex  items-center">
            <h5 className="font-bold w-2/5 ">Price</h5>
            <NumberInputComponent
              type
              placeholder="Enter Price"
              className="w-3/5"
              handleChange={(e) =>
                setProductVar({
                  ...productVar,
                  price: e,
                })
              }
            />
          </div>
          <Button
            className=" inline-flex text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300 items-center justify-center"
            onClick={handleCreate}
          >
            Create Variant
          </Button>
        </Card>
      )}
    </section>
  );
};

export default VariantCreator;
