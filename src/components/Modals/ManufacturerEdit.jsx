import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import InputComponent from "../Inputs/Input";
import { useMutation } from "@apollo/client";
import { UPDATE_MANUFACTURER } from "../../GraphQl/Mutations";
import Spinner from "../Spinner/Spinner";

const Modal = (props, ref) => {
  const [modalState, setModalState] = useState(false);
  const [manufacturerVar, setManufacturerVar] = useState(props?.manufacturer);
  const [error, setError] = useState("");
  useImperativeHandle(ref, () => ({
    openModal: () => setModalState(true),
  }));
  const [updateManufacturer, updatedManufacturer] = useMutation(
    UPDATE_MANUFACTURER,
    {
      variables: manufacturerVar,
      onCompleted: (data) => {
        console.log(data);
        if (data?.updateManufecturer?.manufecturer) setModalState(false);
        else if (!data?.updateManufecturer?.manufecturer) {
          setError("Phone number already exists for another manufacturer");
        }
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const handleUpdate = () => {
    setError("");
    if (!manufacturerVar?.id) {
      setError("No Id available. Please retry");
      return;
    }
    if (manufacturerVar?.phoneNumber?.length != 10) {
      setError("Phone Number must be 10 digits");
      return;
    }
    updateManufacturer();
    console.log(manufacturerVar);
  };
  useEffect(() => {
    setManufacturerVar(props?.manufacturer);
    console.log(props?.manufacturer);
  }, [props?.manufacturer]);

  if (!modalState) {
    return null;
  }

  return (
    <div className='modal absolute z-50 left-0 top-0 w-full  h-full bg-black/10 flex items-center justify-center'>
      <div className='flex flex-col items-center bg-white w-3/4 px-5  py-8 rounded-md'>
        {updatedManufacturer?.loading && <Spinner />}
        <div className='w-full md:w-10/12'>
          <InputComponent
            required={true}
            placeholder='Enter Manufacturer Name'
            maxLength={30}
            title='Manufacturer Name *'
            value={manufacturerVar?.name}
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
            placeholder='Enter Manufacturer Address'
            maxLength={30}
            value={manufacturerVar?.address}
            title='Manufacturer Address *'
            showCount={true}
            handleChange={(e) => {
              setManufacturerVar({
                ...manufacturerVar,
                address: e.target.value,
              });
            }}
            className='bg-transparent'
            allowClear={true}
          />
          <InputComponent
            required={true}
            placeholder='Enter Manufacturer City'
            maxLength={30}
            value={manufacturerVar?.city}
            title='Manufacturer City *'
            showCount={true}
            handleChange={(e) => {
              setManufacturerVar({
                ...manufacturerVar,
                city: e.target.value,
              });
            }}
            className='bg-transparent'
            allowClear={true}
          />
        </div>
        <div className='w-full md:w-10/12'>
          <InputComponent
            required={true}
            placeholder='Enter GST Number'
            maxLength={15}
            value={manufacturerVar?.gstNumber}
            title='GST Number *'
            showCount={true}
            handleChange={(e) => {
              setManufacturerVar({
                ...manufacturerVar,
                gstNumber: e.target.value,
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
            placeholder='Enter Phone Number'
            maxLength={10}
            value={manufacturerVar?.phoneNumber}
            title='Phone Number *'
            showCount={true}
            handleChange={(e) => {
              setManufacturerVar({
                ...manufacturerVar,
                phoneNumber: e.target.value,
              });
            }}
            className='bg-transparent'
            allowClear={true}
          />
        </div>
        <div className='w-full md:w-10/12'>
          <InputComponent
            required={true}
            placeholder='Enter Contact Person Name'
            maxLength={30}
            value={manufacturerVar?.contactPersonName}
            title='Contact Person Name *'
            showCount={true}
            handleChange={(e) => {
              setManufacturerVar({
                ...manufacturerVar,
                contactPersonName: e.target.value,
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
