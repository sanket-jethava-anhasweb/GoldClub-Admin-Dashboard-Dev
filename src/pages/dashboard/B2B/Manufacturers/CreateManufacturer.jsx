import React, { useState } from "react";
import { Divider, message } from "antd";
import motion from "framer-motion";
import { useLazyQuery, useMutation } from "@apollo/client";
import SectionTitle from "../../../../components/Title/SectionTitle";
import SearchComponent from "../../../../components/Inputs/Search";
import { CREATE_MANUFACTURER } from "../../../../GraphQl/Mutations";
import InputComponent from "../../../../components/Inputs/Input";
import Spinner from "../../../../components/Spinner/Spinner";
import { useNavigate } from "react-router-dom";
const CreateManufacturer = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [manufacturerVar, setManufacturerVar] = useState({
    name: null,
    gstNumber: null,
    phoneNumber: null,
    address: null,
    contactPersonName: null,
  });
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
  const [createManufacturer, createdManufacturer] = useMutation(
    CREATE_MANUFACTURER,
    {
      variables: manufacturerVar,
      onCompleted: (data) => {
        console.log(data);
        if (data?.createManufecturer?.error?.includes("phone_number"))
          setError("Phone number already exists");
        else if (
          !data?.createManufecturer?.error &&
          data?.createManufecturer?.manufecturer
        ) {
          setSuccess("Created manufacturer successfully");
          setTimeout(() => {
            navigate("/dashboard/b2b/manufacturers");
          }, 300);
        }
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );

  const handleCreateManufacturer = () => {
    if (
      !manufacturerVar?.name ||
      !manufacturerVar?.phoneNumber ||
      !manufacturerVar?.contactPersonName ||
      manufacturerVar?.name == "" ||
      manufacturerVar?.phoneNumber == "" ||
      manufacturerVar?.contactPersonName == ""
    ) {
      setError("Please enter all required fields");
      return;
    }
    setTrial("Creating new manufacturer");
    createManufacturer();
  };
  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Create Manufacturer' />
      </div>
      <Divider className='dark:bg-white/10' />
      {/* <span className='dark:text-white md:px-[2.5%] text-lg mb-4'>
        Create new manufacturer
      </span> */}
      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4 '>
        <section className=' row flex flex-wrap gap-4 w-full items-start'>
          <div className='w-full md:w-10/12'>
            <InputComponent
              required={true}
              placeholder='Enter Manufacturer Name'
              maxLength={30}
              title='Manufacturer Name *'
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
              placeholder='Enter Manufacturer City'
              maxLength={30}
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
              placeholder='Enter GST Number'
              maxLength={15}
              title='GST Number '
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

          <button
            className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
            onClick={handleCreateManufacturer}
          >
            Create manufacturer
          </button>
        </section>
      </section>
    </section>
  );
};

export default CreateManufacturer;
