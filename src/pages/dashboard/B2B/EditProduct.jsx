import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

import { GET_PROD_BY_ID_UPDATE_PRODUCT, GET_CATEGORY_METADATA } from "../../../GraphQl/Query";
import { UPDATE_PRODUCT } from "../../../GraphQl/Mutations";

import { Button, Card, Divider, message } from "antd";

import SectionTitle from "../../../components/Title/SectionTitle";
import InputComponent from "../../../components/Inputs/Input";
import SelectComponent from "../../../components/Inputs/Select";

const EditProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [original, setOriginal] = useState([]);
  const [metalType, setMetalType] =useState("Gold");
  const [attributeOptions, setAttributeOptions] = useState([
    {
      key: "availability",
      value: ['Ready', 'Make To Order']
  },]);

  const [updateVar, setUpdateVar] = useState({
    slug: null,
    category: null,
    attributes: [],
    chargeTaxes: null,
    isPublished: null,
    seo: null,
    trackInventory: null,
    visibleInListings: null,
    sku: null,
  });

  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };

  const [fetchProd] = useLazyQuery(GET_PROD_BY_ID_UPDATE_PRODUCT, {
    variables: {
        id: params?.id,
      },
      onCompleted: (data) => {
        const productData = data.product;
        setOriginal(productData);
        setUpdateVar({
          productName: productData?.name,
          slug: productData?.slug,
          category: productData.category?.id,
          attributes: productData.attributes.map(attr => ({
            attribute: { 
              id: attr.attribute.id,
              slug: attr.attribute.slug,
              name: attr.attribute.name,
            },
            values: attr.values.map(value => ({
              name: value.name,
            })),
          })),
          chargeTaxes: productData?.chargeTaxes,
          isPublished: productData?.isPublished,
          seo: productData?.seoTitle,
          visibleInListings: productData?.visibleInListings,
          sku: productData?.variants?.sku,
        });
        fetchCategoryData({
          variables: {
            id: data.product.category.id
          }
        });
        setMetalType(productData.attributes[0].values[0].name);
      },
      onError: (err) => {
        setError("Unable to retrieve product details.");
      },
  });

  const [fetchCategoryData] = useLazyQuery(GET_CATEGORY_METADATA, {
    onCompleted: (metaData) => {
      const fetchedMetadata = metaData.category.metadata.map((item) => ({
        key: item.key,
        value: parseJsonString(item.value),
      }));
      setAttributeOptions((prevOptions) => [...prevOptions, ...fetchedMetadata]);
    },
  });

  const parseJsonString = (jsonString) => {
    try {
      const cleanedJsonString = jsonString.replace(/'/g, '"');
      return JSON.parse(cleanedJsonString);
    } catch (error) {
      console.error("Error parsing JSON value:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchProd();
  }, [fetchProd]);

  const handleChange = (slug, source) => (e) => {
    const newValue = source === 'input' ? e.target.value : e;
    console.log(newValue);
  
    if (newValue !== undefined) {
      const attributeIndex = updateVar.attributes.findIndex(
        (attr) => attr.attribute.slug === slug
      );
  
      if (attributeIndex !== -1) {
        const updatedAttributes = [...updateVar.attributes];
        updatedAttributes[attributeIndex] = {
          ...updatedAttributes[attributeIndex],
          values: [
            {
              ...updatedAttributes[attributeIndex].values[0],
              name: newValue,
            },
          ],
        };
  
        setUpdateVar({
          ...updateVar,
          attributes: updatedAttributes,
        });
      }
    }
  };

  const getDropdownOptions = (attributeSlug) => {
    const foundOption = attributeOptions.find((option) => option.key === attributeSlug);
  
    if (foundOption && Array.isArray(foundOption.value)) {
      return foundOption.value.map(item => ({
        value: item,
        label: item,
      }));
    } else if (foundOption && typeof foundOption.value === 'string') {
      try {
        const parsedValue = JSON.parse(foundOption.value);
        if (Array.isArray(parsedValue)) {
          return parsedValue.map(item => ({
            value: item,
            label: item,
          }));
        }
        return [{
          value: foundOption.value,
          label: foundOption.value,
        }];
      } catch (error) {
        console.error("Error parsing JSON value:", error);
      }
    }
  
    return [];
  };
  

  const renderAttributeList = {
    "availability" : {
      type: "dropdown"
    },
    "gold-carat": {
      type: "dropdown"
    },
    "silver-carat": {
      type: "dropdown"
    },
    "platinum-carat": {
      type: "dropdown"
    },
    "gold-color": {
      type: "dropdown"
    },
    "silver-color": {
      type: "dropdown"
    },
    "platinum-color": {
      type: "dropdown"
    },
    "gender": {
      type: "dropdown"
    },
    "ocassian": {
      type: "dropdown"
    },
    "communityregion": {
      type: "dropdown"
    },
    "flat-charges": {
      type: "input"
    },
    "product-height": {
      type: "input"
    },
    "product-width": {
      type: "input"
    },
  };

  const renderAttribute = (attr) => {
    let attributeSlug = attr.attribute.slug;

    if (["gold-color", "silver-color", "platinum-color"].includes(attributeSlug)) {
      attributeSlug = "colour";
    }

    if (["gold-carat", "silver-carat", "platinum-carat"].includes(attributeSlug)) {
      attributeSlug = "carats";
    }

    if (["communityregion"].includes(attributeSlug)) {
      attributeSlug = "community";
    }

    if (["ocassian"].includes(attributeSlug)) {
      attributeSlug = "style";
    }

    switch (renderAttributeList[attr.attribute.slug]?.type) {
      case "dropdown":
        
        const productType = updateVar.attributes.find((a) => a.attribute.slug === "type")?.values[0]?.name;
        if (
          (metalType === "Gold" && ["silver-carat", "platinum-carat", "silver-color","platinum-color"].includes(attr.attribute.slug)) ||
          (metalType === "Silver" && ["gold-carat", "platinum-carat", "gold-color","platinum-carat"].includes(attr.attribute.slug)) ||
          (metalType === "Platinum" && ["gold-carat", "silver-carat", "gold-color", "silver-color"].includes(attr.attribute.slug)) ||
          (productType !== "Non Studded" && attr.attribute.slug === "gemstone")
        ) {
          return null;
        }

        const dropdownOptions = getDropdownOptions(attributeSlug);
        return (
          attr && attr.values && (
            <SelectComponent
              key={attr.attribute.slug}
              options={dropdownOptions}
              placeholder={`Select ${attr.attribute.slug}...`}
              title={`${attr.attribute.name}*`}
              value={attr.values[0]?.name || ''}
              handleChange={handleChange(attr.attribute.slug, 'dropdown')}
            />
          )
        );
      case "input":
        return (
          <InputComponent
            key={attr.attribute.slug}
            required={true}
            placeholder={`Enter ${attr.attribute.slug}...`}
            title={`${attr.attribute.name}`}
            allowClear={true}
            value={attr.values[0]?.name || ''}
            handleChange={handleChange(attr.attribute.slug, 'input')}
          />
        );
      default:
        return null;
    }
  };

  const [updateProduct] = useMutation(UPDATE_PRODUCT, {
    onCompleted: (data) => {
    setTimeout(() => {
      navigate(window.location?.pathname?.split("/edit")[0]);
    }, 1000);
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleUpdateProduct = () => {
    const { id } = params;
  
    updateProduct({
      variables: {
        id,
        input: {
          slug: updateVar.slug,
          category: updateVar.category,
          attributes: updateVar.attributes.map(attr => {
            if (attr.attribute.slug === "gemstone-details-product") {
              return {
                id: attr.attribute.id,
                values: attr?.values[0]?.name || ["none"],
              };
            } else {
              return {
                id: attr.attribute.id,
                values: attr.values.length > 0 ? attr.values.map(value => value.name) : ["none"],
              };
            }
          }),
          chargeTaxes: updateVar.chargeTaxes,
          isPublished: updateVar.isPublished,
          seo: updateVar.seoTitle,
          visibleInListings: updateVar.visibleInListings,
          sku: updateVar.variants?.sku,
        }
      },
    });
  };

  return (
    <>
      {contextHolder}
      <section className='w-11/12 py-4'>
        <SectionTitle title='Edit Product' />
        <Divider className='dark:bg-white/10' />
        <div className="w-full flex justify-evenly md-4">
          <Card className="dark:bg-slate-900 w-[40%] dark:text-white flex flex-col gap-4">
            <div>
              {original.images && 
                (<img className="rounded-md" src={original?.images[0]?.url || process.env.PUBLIC_URL + "/no-image.jpg"} alt="Product" />)
              }
            </div>
            <div className="py-4">
              <p className="dark:text-white text-xl text-center font-bold">{original.name}</p>
              <p className="dark:text-gray-400 py-4 text-md text-left">Category: <span className="font-semibold dark:text-white text-xl">{original?.category?.name}</span></p>
              <p className="dark:text-gray-400 text-md py-2 text-left">Metal: <span className="font-semibold dark:text-white text-3xl">{metalType} {updateVar.attributes.find(attr => attr.attribute.slug === `${metalType.toLowerCase()}-carat`)?.values[0]?.name}k</span></p>
              <p className="dark:text-gray-400 text-md py-2 text-left">Type: <span className="font-semibold dark:text-white text-xl">{updateVar.attributes.find(attr => attr.attribute.slug === 'type')?.values[0]?.name}</span></p>
              <p className="dark:text-gray-400 text-md py-2 text-left">Making Charge: <span className="font-semibold dark:text-white text-xl">{updateVar.attributes.find(attr => attr.attribute.slug === 'making-charge-product')?.values[0]?.name}{updateVar.attributes.find(attr => attr.attribute.slug === 'making-charge-mode')?.values[0]?.name === 'Percent' && '%'}
              {updateVar.attributes.find(attr => attr.attribute.slug === 'making-charge-mode')?.values[0]?.name === 'Flat' && 'FLAT'}
              {updateVar.attributes.find(attr => attr.attribute.slug === 'making-charge-mode')?.values[0]?.name === 'Rspergram' && 'Rs. per gm'}</span></p>
              <p className="dark:text-gray-400 text-md py-2 text-left">Wastage Charge: <span className="font-semibold dark:text-white text-xl">{updateVar.attributes.find(attr => attr.attribute.slug === 'wastage-charge-prouct')?.values[0]?.name || 0} {updateVar.attributes.find(attr => attr.attribute.slug === 'wastage-charge-mode')?.values[0]?.name === 'Percent' && '%'}
              {updateVar.attributes.find(attr => attr.attribute.slug === 'wastage-charge-mode')?.values[0]?.name === 'Flat' && 'FLAT'}
              {updateVar.attributes.find(attr => attr.attribute.slug === 'wastage-charge-mode')?.values[0]?.name === 'Rspergram' && 'Rs. per gm'}</span></p>
              <p className="dark:text-gray-400 text-md text-left py-2">Published On: <span className="font-semibold dark:text-white">{original.publicationDate}</span></p>
            </div>
          </Card>
          <Card className="dark:bg-slate-900 w-[40%] px-2">
            {updateVar.attributes
              .filter((attr) => renderAttributeList[attr.attribute.slug]?.type)
              .map(renderAttribute)}
            <div className="mt-4 flex justify-center">
              <Button type="primary" className="bg-white text-black" onClick={handleUpdateProduct}>
                Submit
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  )
};

export default EditProduct;