import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../Inputs/Input";
import { useLazyQuery, useMutation } from "@apollo/client";
import { 
  // UPDATE_MANUFACTURER,
  // UPDATE_SUBCATEGORY_PRICING,
  CREATE_SUBCATEGORY_PRICING
} from "../../GraphQl/Mutations";
import Spinner from "../Spinner/Spinner";
import SelectComponent from "../Inputs/Select";
import {
  GET_ALL_ASSIGNMENT_CATEGORIES,
  GET_ASSIGMENT_COLOR,
  GET_ASSIGNMENT_CARAT,
  GET_ASSIGNMENT_SUBCATEGORY,
} from "../../GraphQl/Query";
import { Input } from "antd";

const Modal = (props, ref) => {
  const [modalState, setModalState] = useState(false);
  const [manufacturerVar, setManufacturerVar] = useState(null);
  const [error, setError] = useState("");
  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
  }));
  
  const [getCategories, categories] = useLazyQuery(
    GET_ALL_ASSIGNMENT_CATEGORIES,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const [getSubCategory, subcategory] = useLazyQuery(
    GET_ASSIGNMENT_SUBCATEGORY,
    {
      onError: (err) => {
        setError(err.message);
      },
    }
  );

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
  useEffect(() => {
    setManufacturerVar(null)
  }, [setModalState]);

  const [updateManufacturer, updatedManufacturer] = useMutation(
    CREATE_SUBCATEGORY_PRICING,
    {
      variables: manufacturerVar,
      onCompleted: (data) => {
        console.log(data);
        if (data?.updateManufecturer?.manufecturer) setModalState(false);
        // else if (!data?.updateManufecturer?.manufecturer) {
        //   setError("Phone number already exists for another manufacturer");
        // }
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const handleUpdate = () => {
    setError("");

    updateManufacturer();
    console.log(manufacturerVar);
  };
  useEffect(() => {
    getCategories();
    props?.manufacturer?.subcategory?.id &&
      getSubCategory({
        variables: {
          categoryId: props?.manufacturer?.subcategory?.id,
        },
      });
    // setManufacturerVar(props?.manufacturer);
    // console.log(props?.manufacturer);
  }, [props?.manufacturer]);

  if (!modalState) {
    return null;
  }

  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 flex items-center justify-center'>
      <div className='flex flex-col items-center h-auto overflow-y-scroll  bg-white w-3/4 px-5  py-8 rounded-md'>
        <div className='h-10/12 overflow-y-scroll w-11/12 mx-auto'>
          {updatedManufacturer?.loading && <Spinner />}
          {/* <div className='w-full md:w-10/12'>
            <InputComponent
              required={true}
              placeholder='Enter Manufacturer Name'
              maxLength={30}
              title='Manufacturer Name *'
              value={props?.manufacturer?.manufacturer?.name}
              showCount={true}
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  name: e.target.value,
                });
              }}
              className='bg-transparent'
              allowClear={true}
            />
            <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              />
          </div> */}
          <div className='w-full md:w-3/5  '>
            <SelectComponent
              name='metal-type'
              title='Select Metal Type *'
              placeholder='Select Metal Type '
              value={props?.manufacturer?.metalType || null}
              required={true}
              options={["gold", "silver", "platinum"].map((e) => ({
                value: e,
                label: e?.toUpperCase(),
              }))}
              handleChange={(e) => {
                setManufacturerVar({ ...manufacturerVar, metalType: e });
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
          <div
            className='w-full md:w-3/5  '
            onClick={(e) => {
              if (!categories?.data) {
                getCategories();
              }
            }}
          >
            <SelectComponent
              name='Category'
              title='Select Category *'
              placeholder='Select Category '
              required={true}
              value={props?.manufacturer?.category?.id}
              options={
                categories?.loading
                  ? [{ value: null, label: "loading..." }]
                  : categories?.data?.categories?.edges?.map((cat) => ({
                      value: cat?.node?.id,
                      label: cat?.node?.name,
                    }))
              }
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  category: e,
                });
                getSubCategory({
                  variables: {
                    categoryId: e,
                  },
                });
              }}
            />
          </div>
          <div className='w-full md:w-3/5  '>
            <SelectComponent
              name='Sub Category'
              title='Select Sub Category *'
              placeholder='Select Sub Category '
              value={props?.manufacturer?.subcategory?.id || null}
              required={true}
              options={
                subcategory?.loading
                  ? [{ value: null, label: "loading..." }]
                  : subcategory?.data?.category.children.edges?.map((cat) => ({
                      value: cat?.node?.id,
                      label: cat?.node?.name,
                    }))
              }
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  subcategory: e,
                });
              }}
            />
          </div>
          <div className='w-full md:w-3/5  '>
              <SelectComponent
                name='Has Diamond?'
                title='Has Diamond? *'
                placeholder='Select yes or no * '
                required={true}
                value={props?.manufacturer?.hasDiamond}
                options={[
                  { val: "true", name: "YES" },
                  { val: "false", name: "NO" },
                  // { val: "flat", name: "Flat" },
                ].map((cat) => ({
                  value: cat?.val,
                  label: cat?.name,
                }))}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    hasDiamond: e,
                  });
                }}
              />
            </div>
            <div className='w-full md:w-3/5  '>
              <SelectComponent
                name='Select Carat'
                title='Select Carat *'
                placeholder='Select carat * '
                required={true}
                value={props?.manufacturer?.cara}
                options={[
                  { val: "9", name: "9K" },
                  { val: "14", name: "14k" },
                  { val: "16", name: "16K" },
                  { val: "18", name: "18k" },
                  { val: "20", name: "20K" },
                  { val: "22", name: "22k" },
                  { val: "24", name: "24k" },
                ].map((cat) => ({
                  value: cat?.val,
                  label: cat?.name,
                }))}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    carat: e,
                  });
                }}
              />
            </div>
            <div className='w-full md:w-3/5  '>
              <SelectComponent
                name='Has Other Gemstones?'
                title='Has Other Gemstone? *'
                placeholder='Select yes or no * '
                required={true}
                value={props?.manufacturer?.hasOtherGemstone}
                options={[
                  { val: "true", name: "YES" },
                  { val: "false", name: "NO" },
                  // { val: "flat", name: "Flat" },
                ].map((cat) => ({
                  value: cat?.val,
                  label: cat?.name,
                }))}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    hasOtherGemstone: e,
                  });
                }}
              />
            </div>
          <div className='w-full md:w-full'>
            <div className='w-full md:w-3/5  '>
              <SelectComponent
                name='Making charge mode'
                title='Select Making charge mode *'
                placeholder='Select Making charge mode '
                required={true}
                value={props?.manufacturer?.makingChargeMode || null}
                options={[
                  { val: "percent", name: "Percentage" },
                  { val: "rspergram", name: "Rs. per gram" },
                  { val: "flat", name: "Flat" },
                ].map((cat) => ({
                  value: cat?.val,
                  label: cat?.name,
                }))}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    makingChargeMode: e,
                  });
                }}
              />
            </div>
            <div className='w-full md:w-3/5'>
            <Input
              type="text"
              required={true}
              placeholder='Enter Making Charge'
              // maxLength={30}
              title='Making Charge *'
              value={manufacturerVar?.makingCharge}
              onChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  makingCharge: e.target.value,
                });
              }}
              className='bg-transparent'
            />
              {/* <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              /> */}
            {/* </div> */}
            {/* <div className='w-full md:w-4/5'>
              <InputComponent
                required={true}
                placeholder='Enter Making Days'
                maxLength={30}
                value={props?.manufacturer?.makingDays || null}
                title='Making Days *'
                showCount={true}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    makingDays: e.target.value,
                  });
                }}
                className='bg-transparent'
                allowClear={true}
              /> */}
              {/* <TextAreaComponent
                required={true}
                placeholder="Enter Product Description"
                // maxLength={30}
                title="Product Description"
                showCount={true}
              /> */}
            </div>
            {/* WASTAGE */}
            
            <div className='w-full md:w-3/5  '>
              <SelectComponent
                name='Wastage charge mode'
                title='Select Wastage charge mode *'
                placeholder='Select Wastage charge mode '
                required={true}
                value={props?.manufacturer?.wastageChargeMode}
                options={[
                  { val: "percent", name: "Percentage" },
                  { val: "rspergram", name: "Rs. per gram" },
                  { val: "flat", name: "Flat" },
                ].map((cat) => ({
                  value: cat?.val,
                  label: cat?.name,
                }))}
                handleChange={(e) => {
                  setManufacturerVar({
                    ...manufacturerVar,
                    wastageChargeMode: e,
                  });
                }}
              />
            </div>
            <div className='w-full md:w-3/5'>
            <Input
              type="text"
              required={true}
              placeholder='Enter Wastage Charge'
              // maxLength={30}
              title='Wastage Charge *'
              value={manufacturerVar?.wastageCharge}
              onChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  wastageCharge: e.target.value,
                });
              }}
              className='bg-transparent'
            />
            </div>
          </div>
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

export default forwardRef(Modal);
