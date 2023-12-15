import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../Inputs/Input";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  AutoComplete,
} from "antd";
import { 
  // UPDATE_MANUFACTURER,
  UPDATE_SUBCATEGORY_PRICING,
  // CREATE_SUBCATEGORY_PRICING
} from "../../GraphQl/Mutations";
import Spinner from "../Spinner/Spinner";
import SelectComponent from "../Inputs/Select";
import {
  GET_ALL_ASSIGNMENT_CATEGORIES,
  GET_ASSIGMENT_COLOR,
  GET_ASSIGNMENT_CARAT,
  GET_ASSIGNMENT_SUBCATEGORY,
} from "../../GraphQl/Query";

const UpdateModal = (props, ref) => {
  const [updateData,setUpdateData] = useState(props);
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

  const [updateManufacturer, updatedManufacturer] = useMutation(
    UPDATE_SUBCATEGORY_PRICING,
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

    // updateManufacturer();
  console.log("props line 777",updateData);
  };
  console.log("props line 78",props);
  useEffect(() => {
    setUpdateData(props.id);
  }, [props]);

  if (!modalState) {
    return null;
  }
 let OnChange = (e)=>{
    console.log(e.target.value);
    let temp = e.target.value;
    let tempData = updateData;
    console.log("tempData",tempData)
    tempData.makingCharge = temp;
    setUpdateData(tempData);
 };
  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 flex items-center justify-center'>
      <div className='flex flex-col items-center h-auto overflow-y-scroll  bg-white w-3/4 px-5  py-8 rounded-md'>
        <div className='h-10/12 overflow-y-scroll w-11/12 mx-auto flex items-center'>
          <div className='w-full md:w-full flex-col items-center'>
            <div className='w-full md:w-3/5  '>
            <div className='flex flex-col items-start w-full md:w-[100%] m-5'>
                <label
                  htmlFor={"Making Charge *"}
                  className='font-semibold dark:text-slate-300 text-sm'
                >
                  {"Making Charge *"}
                </label>
              <AutoComplete
                name='Making charge mode'
                title='Select Making charge mode *'
                placeholder='Select Making charge mode '
                disabled
                value={updateData?.makingChargeMode || null}
                className='w-full md:w-[100%]'
              />
              </div>
            </div>
            <div className='w-full md:w-3/5 m-5'>
            <InputComponent
              required={true}
              placeholder='Enter Making Charge'
              // maxLength={30}
              // editable
              value={updateData?.makingCharge}  // Set default value to an empty string
              title='Making Charge *'
              showCount={true}
              handleChange={(e) => OnChange(e)}
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
            
            <div className='w-full md:w-3/5 m-5 '>
            <div className='flex flex-col items-start w-full md:w-[100%]'>
                <label
                  htmlFor={"Wastage Charge *"}
                  className='font-semibold dark:text-slate-300 text-sm'
                >
                  {"Wastage Charge *"}
                </label>
              <AutoComplete
                name='Wastage charge mode'
                title='Select Wastage charge mode *'
                placeholder='Select Wastage charge mode '
                disabled
                value={updateData?.wastageChargeMode || null}
                className='w-full md:w-[100%]'
              />
              </div>
            </div>
            <div className='w-full md:w-3/5 m-5'>
              <InputComponent
                required={true}
                placeholder='Enter Wastage Charge'
                // maxLength={30}
                title='Wastage Charge *'
                showCount={true}
                value={updateData?.wastageCharge}
                handleChange={(e) => {
                  let temp = e.target.value;
                  let tempData = updateData;
                  tempData.wastageCharge = temp;
                  setUpdateData(tempData);
                }}
                className='bg-transparent'
                allowClear={true}
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

export default forwardRef(UpdateModal);
