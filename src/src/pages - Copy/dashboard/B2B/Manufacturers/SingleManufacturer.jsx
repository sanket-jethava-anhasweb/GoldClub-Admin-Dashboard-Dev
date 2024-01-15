import { useLazyQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { GET_MANUFACTURER_BY_ID } from "../../../../GraphQl/Query";
import { Card, Divider, Empty, message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SectionTitle from "../../../../components/Title/SectionTitle";

const ManufacturerCard = ({ manufacturer, loading = false }) => {
  return (
    <Card title={manufacturer?.manufacturer?.name}>
      <div className='flex flex-wrap items-start justify-start gap-3 w-full'>
        <div className='m-2'>
          <strong>Contact Person Name</strong>
          <div className='text-lg'>
            {manufacturer?.manufacturer?.contactPersonName}
          </div>
        </div>
        <div className='m-2'>
          <strong>Phone Number</strong>
          <div className='text-lg'>
            {manufacturer?.manufacturer?.phoneNumber}
          </div>
        </div>
        <div className='m-2'>
          <strong>GST Number</strong>
          <div className='text-lg'>{manufacturer?.manufacturer?.gstNumber}</div>
        </div>
      </div>
    </Card>
  );
};
const ManufacturerAssignmentCard = ({ manufacturer, loading = false }) => {
  return (
    <Card
      className='w-full lg:w-[45%]'
      title={
        <span className='text-lg'>
          {manufacturer?.category?.name} (
          <span className='text-sm'>
            {manufacturer?.subcategory?.name || "Subcategory unavailable"}
          </span>
          )
        </span>
      }
    >
      <div className='flex flex-col items-start justify-start gap-3 w-full'>
        <div className=' flex items-start justify-between m-2 w-full '>
          <div className='w-1/2'>
            <strong>Metal Type</strong>
            <div className='text-lg'>
              {manufacturer?.carat && manufacturer?.carat + "k "}
              {manufacturer?.metalType}
            </div>
          </div>

          <div className='w-1/2'>
            <strong>Colour</strong>
            <div className='text-lg'>
              {manufacturer?.colour
                .toString()
                ?.replace("-", " ")
                ?.replace("", " ")
                ?.replace("[", "")
                ?.replace("]", "")}
            </div>
          </div>
        </div>
        <div className=' flex items-start justify-between m-2 w-full '>
          <div className='w-1/2'>
            <strong>Diamond</strong>
            <div className='text-lg'>
              {manufacturer?.hasDiamond ? "Yes" : "No"}
            </div>
          </div>

          <div className='w-1/2'>
            <strong>Other Gemstons</strong>
            <div className='text-lg'>
              {manufacturer?.hasOtherGemstone ? "Yes" : "No"}
            </div>
          </div>
        </div>
        <div className=' flex items-start justify-between m-2 w-full '>
          <div className='w-1/2'>
            <strong>Making Charge Mode</strong>
            <div className='text-lg'>{manufacturer?.makingChargeMode}</div>
          </div>

          <div className='w-1/2'>
            <strong>Making Charge</strong>
            <div className='text-lg'>{manufacturer?.makingCharge}</div>
          </div>
        </div>
        <div className=' flex items-start justify-between m-2 w-full '>
          <div className='w-1/2'>
            <strong>Wastage Charge Mode</strong>
            <div className='text-lg'>{manufacturer?.wastageChargeMode}</div>
          </div>

          <div className='w-1/2'>
            <strong>Wastage Charge</strong>
            <div className='text-lg'>{manufacturer?.wastageCharge}</div>
          </div>
        </div>
        <div className=' flex items-start justify-between m-2 w-full '>
          <div className='w-1/2'>
            <strong>Making Days</strong>
            <div className='text-lg'>{manufacturer?.makingDays}</div>
          </div>

          <div className='w-1/2'>
            <strong>Created On</strong>
            <div className='text-lg'>
              {manufacturer?.createdAt?.split("T")[0]}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
const SingleManufacturer = () => {
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

  const local_manufacturers = useSelector(
    (state) => state.client.manufacturers
  );
  const [manufacturerData, setManufacturerData] = useState(null);
  const [getManufacturer, manufacturer] = useLazyQuery(GET_MANUFACTURER_BY_ID, {
    variables: {
      manufecturer: params?.id,
    },
    onCompleted: (data) => {
      console.log(data.manufecturerAssignments);
      setManufacturerData(data?.manufecturerAssignments);
      if (data?.manufecturerAssignments?.length == 0)
        setError("No assignments found for this manufacturer...");
      else setSuccess("Manufacturer data fetched successfully!");
    },
    onError: (err) => {
      console.log(err);
    },
  });
  useEffect(() => {
    setTrial("Fetching Manufacturer...");
    getManufacturer();
    console.log(manufacturerData);
  }, [params?.id]);
  return (
    <section className='w-full flex flex-col  justify-center'>
      {contextHolder}
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle
          title={
            local_manufacturers?.filter((m) => m.id == params?.id)[0]?.name ||
            "Manufacturer"
          }
        />
        <Link
          to={"../manufacturers/assign/" + params?.id}
          onClick={() => {
            // handleOpenModal();
          }}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          +Assign New Subcategory
        </Link>
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex flex-col items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4  py-3 '>
        {!manufacturerData || manufacturerData?.length == 0 ? (
          <Empty description='No data available' />
        ) : (
          <>
            <section className='w-full lg:w-1/2'>
              <ManufacturerCard
                manufacturer={manufacturerData && manufacturerData[0]}
              />
            </section>
            <Divider className='dark:bg-white/10' />
            <section className='w-full flex flex-wrap gap-3'>
              {manufacturerData?.map((manufacturer) => (
                <ManufacturerAssignmentCard manufacturer={manufacturer} />
              ))}
            </section>
          </>
        )}
      </section>
    </section>
  );
};

export default SingleManufacturer;
