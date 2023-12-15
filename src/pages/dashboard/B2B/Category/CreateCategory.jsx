import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../../../../components/Inputs/Input";
import { useLazyQuery, useMutation } from "@apollo/client";
import SelectComponent from "../../../../components/Inputs/Select";
import Spinner from "../../../../components/Spinner/Spinner";
import {
  CREATE_CATEGORY,
  UPDATE_SUBCATEGORY,
} from "../../../../GraphQl/Mutations";
import {
  GET_ASSIGMENT_COLOR,
  GET_ASSIGNMENT_CARAT,
  GET_CATEGORY_ATTRIBUTE,
  SEARCH_PRODUCT_TYPES,
} from "../../../../GraphQl/Query";
import { AutoComplete } from "antd";

const CreateCategory = (props, ref) => {
  const [modalState, setModalState] = useState(false);
  const [categoryVar, setCategoryVar] = useState({
    descriptionJson: "",
    name: "",
    seo: { description: "", title: "" },
    slug: "",
    parent: props?.parent || null,
    metalType: null,
    carat: null,
    colour: null,
    sizes: null,
    gender: null,
    community: null,
    style: null,
  });
  const [otherMetaQuery,setOtherMetaQuery]= useState([])
  const [otherMetaData,setOtherMetaData]= useState([])
  const [attributesList, setAttributeList] = useState({
    community: null,
    occasion: null,
  });
  const [error, setError] = useState("");
  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
  }));
  const [createCategory, createdCategory] = useMutation(CREATE_CATEGORY, {
    variables: {
      input: {
        descriptionJson: `{"blocks":[{"key":"3fqll","text":"${categoryVar?.descriptionJson}","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}`,
        name: categoryVar?.name,
        seo: categoryVar?.seo,
        slug: categoryVar?.slug,
      },
      parent: categoryVar?.parent,
    },
    onCompleted: (data) => {
      console.log(data);
       let temp = otherMetaQuery?.map((meta, idx) => ({ key:meta, value: otherMetaData[idx] }))
      if (data?.categoryCreate.category) {
        updateCategory({
          variables: {
            id: data?.categoryCreate?.category?.id,
            input: [
              { key: "metalType", value: categoryVar?.metalType },
              { key: "sizes", value: categoryVar?.sizes },
              { key: "carats", value: categoryVar.carat },
              { key: "colour", value: categoryVar.colour },
              { key: "community", value: categoryVar.community },
              { key: "style", value: categoryVar.style },
              { key: "gender", value: categoryVar.gender },
              ...temp
            ], // add all the fields which is mention in slide no 33 -> GodlClub - changes - Google Slides
            keysToDelete: [],
          },
        });
      } else if (!data?.categoryCreate.category) {
        setError(JSON.stringify(data?.categoryCreate.errors));
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [updateCategory, updatedCategory] = useMutation(UPDATE_SUBCATEGORY, {
    onCompleted: (data) => {
      console.log(data);
      if (data?.updateMetadata?.errors.length == 0) setModalState(false);
      // if (data?.categoryCreate.category)
      else {
        setError(JSON.stringify(data?.categoryCreate.errors));
      }
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [fetchTypes, types] = useLazyQuery(SEARCH_PRODUCT_TYPES, {
    onCompleted: (data) => {
      setAttributeList({
        community: data?.search?.edges[0]?.node?.productAttributes?.filter(
          (attr) => attr.name === "Community/Region"
        ),
        occasion: data?.search?.edges[0]?.node?.productAttributes?.filter(
          (attr) => attr.name === "occasion"
        ),
      });
      // types?.data?.search.edges[0].node.productAttributes[2],
      // types?.data?.search.edges[0].node.productAttributes[4]
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const [getSizes, sizes] = useLazyQuery(GET_CATEGORY_ATTRIBUTE, {
    onError: (err) => {
      setError(err.message);
    },
  });
  const [getCarats, carats] = useLazyQuery(GET_ASSIGNMENT_CARAT, {
    onError: (err) => {
      setError(err.message);
    },
  });
  const [getColors, colors] = useLazyQuery(GET_ASSIGMENT_COLOR, {
    onError: (err) => {
      setError(err.message);
    },
  });
  const handleUpdate = () => {
    setError("");
    if (categoryVar.name == "" || !categoryVar.name) {
      setError("Enter a subcategory name");
      return;
    }
   
    createCategory();
  };
  useEffect(() => {
    setOtherMetaData([])
    setOtherMetaQuery([])
    fetchTypes({
      variables: {
        after: null,
        first: 100,
        query: props?.parentName || "",
      },
    });
    getSizes({
      variables: {
        first: 100,
        search: props?.parentName === "Ring" ? props?.parentName + `-size` : props?.parentName?.split(" ")[0],
      },
    });
  }, [props?.parentName]);

  if (!modalState) {
    return null;
  }

  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 flex items-center justify-center'>
      <div className='flex flex-col items-center bg-white w-3/4 px-5  py-8 rounded-md '>
        {createdCategory?.loading && <Spinner />}
        <div className=' max-h-[60vh] w-full md:w-11/12 flex flex-col items-center overflow-y-scroll'>
          <div className='w-full md:w-10/12'>
            <InputComponent
              required={true}
              placeholder='Enter Subcategory Name'
              maxLength={30}
              title='Subcategory Name *'
              showCount={true}
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  name: e.target.value,
                  seo: {
                    ...categoryVar.seo,
                    title: e.target.value,
                  },
                });
              }}
              className='bg-transparent'
              allowClear={true}
            />
            {/* <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              /> */}
          </div>
          <div className='w-full md:w-10/12'>
            <InputComponent
              required={true}
              placeholder='Enter Subcateogry Alias'
              maxLength={30}
              title='Subcateogry Alias *'
              showCount={true}
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  descriptionJson: e.target.value,
                  seo: {
                    ...categoryVar.seo,
                    description: e.target.value,
                  },
                });
              }}
              className='bg-transparent'
              allowClear={true}
            />
            {/* <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              /> */}
          </div>
          <div className='w-full md:w-10/12 '>
            <SelectComponent
              name='metal-type'
              title='Select Metal Type *'
              placeholder='Select Metal Type '
              required={true}
              options={["gold", "silver", "platinum"].map((e) => ({
                value: e,
                label: e.toUpperCase(),
              }))}
              handleChange={(e) => {
                setCategoryVar({ ...categoryVar, metalType: e });
                getCarats({
                  variables: {
                    search: `${e}-carat`,
                  },
                });
                getColors({
                  variables: {
                    search: `${e}-color`,
                  },
                });
              }}
            />
          </div>

          <div className='w-full md:w-10/12'>
            <SelectComponent
              name='Carats'
              title='Select Carats *'
              placeholder='Select Carats '
              mode='multiple'
              required={true}
              options={
                carats?.loading
                  ? [{ value: null, label: "loading..." }]
                  : carats?.data?.attributes?.edges[0]?.node?.values?.map(
                      (cat) => ({
                        value: cat?.name,
                        label: cat?.name,
                      })
                    )
              }
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  carat: e != undefined ? e : "",
                });
              }}
            />
          </div>

          <div className='w-full md:w-10/12'>
            <SelectComponent
              name='Colors'
              title='Select colors *'
              placeholder='Select colors '
              mode='multiple'
              required={true}
              options={
                colors?.loading
                  ? [{ value: null, label: "loading..." }]
                  : colors?.data?.attributes?.edges[0]?.node?.values?.map(
                      (cat) => ({
                        value: cat?.name,
                        label: cat?.name,
                      })
                    )
              }
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  colour: e != undefined ? e : "",
                });
              }}
            />
          </div>

          <div className='w-full md:w-10/12'>
            <SelectComponent
              name='sizes'
              title='Select sizes *'
              placeholder='Select sizes '
              mode='multiple'
              required={true}
              options={
                sizes?.loading
                  ? [{ value: null, label: "loading..." }]
                  : (sizes?.data?.attributes?.totalCount === 0 ? (["Freeform"].map((cat) => ({
                    value: "free-form-size",
                    label: "Free Form",
                  }))) :(sizes?.data?.attributes?.edges[0]?.node?.values?.map((cat) => ({
                      value: cat?.name,
                      label: cat?.name,
                    }))))
              }
  
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  sizes: e != undefined ? e : "",
                });
              }}
            />
          </div>
          

          <div className='w-full md:w-10/12'>
            <SelectComponent
              name='Gender'
              title='Select gender *'
              placeholder='Select gender '
              mode='multiple'
              required={true}
              options={["Male", "Female", "Unisex", "Kids"].map((cat) => ({
                value: cat,
                label: cat,
              }))}
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  gender: e != undefined ? e : "",
                });
              }}
            />
          </div>

          <div className='w-full md:w-10/12'>
            <SelectComponent
              name='community'
              title='Select community *'
              placeholder='Select community '
              mode='multiple'
              required={true}
              options={
                types?.loading
                  ? [{ value: null, label: "loading..." }]
                  : attributesList?.community[0]
                  ? attributesList?.community[0]?.values?.map((cat) => ({
                      value: cat?.name,
                      label: cat?.name,
                    }))
                  : [{ value: null, label: "no data" }]
              }
              handleChange={(e) => {
                setCategoryVar({
                  ...categoryVar,
                  community: e != undefined ? e : "",
                });
              }}
            />

            <div className='w-full'>
              <SelectComponent
                name='Occasion'
                title='Select occasion *'
                placeholder='Select occasion '
                mode='multiple'
                required={true}
                options={
                  types?.loading
                    ? [{ value: null, label: "loading..." }]
                    : attributesList?.occasion[0]
                    ? attributesList?.occasion[0]?.values?.map((cat) => ({
                        value: cat?.name,
                        label: cat?.name,
                      }))
                    : [{ value: null, label: "no data" }]
                }
                handleChange={(e) => {
                  setCategoryVar({
                    ...categoryVar,
                    style: e != undefined ? e : "",
                  });
                }}
              />
            </div>
          </div>
         <div className="items-start md:w-10/12"> Custom fields</div>
          {Array(otherMetaData?.length + 1)?.fill(0)?.map((meta,idx) =>
            <div className="flex items-center justify-between w-full md:w-10/12">
              <div className='flex flex-col items-start w-[46%]'>
                        <label
                          htmlFor={"Query"}
                          className='font-semibold dark:text-slate-300 text-sm'
                        >
                          {"Query"}
                        </label>
                        <AutoComplete
                          placeholder={"Enter Query"}
                          title={"Query"}
                          loading={types?.loading}
                          onChange={(e) => {
                            let temp = structuredClone(otherMetaQuery)
                            temp[idx] = e;
                            setOtherMetaQuery(temp)
                          }}
                          className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                        />
              </div>
              <div className='flex flex-col items-start w-[46%]'>
                        <label
                          htmlFor={"Value"}
                          className='font-semibold dark:text-slate-300 text-sm'
                        >
                          {"Value"}
                        </label>
                        <AutoComplete
                          placeholder={"Enter Value"}
                          title={"Value"}
                          loading={types?.loading}
                          onChange={(e) => {
                            let temp = structuredClone(otherMetaData)
                            temp[idx] = e;
                            setOtherMetaData(temp)
                          }}
                          className='antdSelect w-full rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
                        />
              </div>
          </div>) }
        </div>
        <div className='buttonDiv flex items-center justify-center w-full gap-3'>
          <button
            className='bg-red-500 text-white rounded-sm p-2 w-1/5 my-2'
            onClick={() => setModalState(false)}
          >
            Close
          </button>
          <button
            className='bg-indigo-500 text-white rounded-sm p-2 w-1/5 my-2'
            onClick={() => handleUpdate()}
          >
            Save
          </button>
        </div>
        <div className='errMsg font-bold text-lg text-red-600'>{error}</div>
      </div>
    </div>
  );
};

export default forwardRef(CreateCategory);
