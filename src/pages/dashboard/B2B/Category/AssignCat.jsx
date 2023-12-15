import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  GET_ALL_ASSIGNMENT_CATEGORIES,
  GET_ALL_MANUFACTURER_LIST,
  GET_ASSIGMENT_COLOR,
  GET_ASSIGNMENT_CARAT,
  GET_ASSIGNMENT_SUBCATEGORY,
  GET_MANUFACTURER_BY_ID,
} from "../../../../GraphQl/Query";
import { Button, Card, Divider, Empty, message } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import SectionTitle from "../../../../components/Title/SectionTitle";
import InputComponent from "../../../../components/Inputs/Input";
import SelectComponent from "../../../../components/Inputs/Select";
import { ASSIGN_MANUFACTURER_SUBCATEGORY } from "../../../../GraphQl/Mutations";

const AssignCategory = () => {
  const params = useParams();
  const navigate = useNavigate();
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
  const [manufacturerVar, setManufacturerVar] = useState({
    manufecturer: params?.id,
    metalType: null,
    category: null,
    subcategory: null,
    carat: null,
    colour: null,
    hasDiamond: null,
    hasOtherGemstone: null,
    makingDays: null,
    makingChargeMode: null,
    makingCharge: null,
    wastageChargeMode: null,
    wastageCharge: null,
  });
  const [getManufacturerList, manufacturerList] = useLazyQuery(
    GET_ALL_MANUFACTURER_LIST,
    {
      onCompleted: (data) => {
        // if (data?.manufecturerAssignments?.length == 0)
        //   setError("No assignments found for this manufacturer...");
        if (data?.errors) {
          navigate("../");
        }
        // else setSuccess("Manufacturer data fetched successfully!");
      },
      onError: (err) => {
        console.log(err);
        navigate("../manufacturers");
      },
    }
  );

  const [getCategories, categories] = useLazyQuery(
    GET_ALL_ASSIGNMENT_CATEGORIES,
    {
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

  const [manufacturerAssign, assignedManufacturer] = useMutation(
    ASSIGN_MANUFACTURER_SUBCATEGORY,
    {
      onCompleted: (data) => {
        console.log(data);
        if (data?.createManufecturerAssignment?.error)
          setError(data?.createManufecturerAssignment?.error);
        else {
          setSuccess("Manufacturer Assigned successfully");
          setTimeout(() => {
            navigate(`../manufacturers/${params.id}`);
          }, 200);
        }
      },
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const handleAssignment = () => {
    Object.entries(manufacturerVar).forEach((entry) => {
      if (entry[1] == null || entry[1] == undefined || entry[1] == "") {
        setError(entry[0] + " must not be empty");
        return;
      }
    });
    setTrial("Assigning Subcategory...");
    for (let i = 0; i < manufacturerVar.carat.length; i++) {
      manufacturerAssign({
        variables: {
          ...manufacturerVar,
          carat: manufacturerVar.carat[i],
          hasDiamond: JSON.parse(manufacturerVar?.hasDiamond),
          hasOtherGemstone: JSON.parse(manufacturerVar?.hasOtherGemstone),
        },
      });
    }
  };

  useEffect(() => {
    getManufacturerList();
  }, [params?.id]);
  return (
    <section className='w-full flex flex-col  justify-center'>
      {contextHolder}
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title={"Assign Subcategory Manufacturer"} />
        {/* <button
          onClick={() => {
            // handleOpenModal();
          }}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          +Assign New Subcategory
        </button> */}
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='productCardWrapper w-full px-0  justify-evenly gap-y-1 flex flex-col items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4  py-3 '>
        <h2>
          Current Manufacturer:{" "}
          <strong>
            {manufacturerList?.data?.manufecturers?.filter(
              (m) => m.id == params?.id
            )[0]?.name ?? params?.id}
          </strong>{" "}
        </h2>

        <section className=' row flex flex-wrap gap-2 w-full items-center '>
          <div className='w-full md:w-4/5  '>
            <SelectComponent
              name='metal-type'
              title='Select Metal Type *'
              placeholder='Select Metal Type '
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

          {/* MULTI SELECTS */}
          <div className='w-full md:w-2/5  '>
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
                setManufacturerVar({
                  ...manufacturerVar,
                  carat: e != undefined ? e : "",
                });
              }}
            />
          </div>
          <div className='w-full md:w-2/5  '>
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
                setManufacturerVar({
                  ...manufacturerVar,
                  colour: e != undefined ? e : "",
                });
              }}
            />
          </div>
          {/* YES/NO */}
          <div className='w-full md:w-2/5  '>
            <SelectComponent
              name='Diamonds'
              title='Has Diamonds?*'
              placeholder='Does it have Diamonds? '
              required={true}
              options={[
                { val: true, name: "Yes" },
                { val: false, name: "No" },
              ].map((cat) => ({
                value: cat?.val,
                label: cat?.name,
              }))}
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  hasDiamond: JSON.stringify(e),
                });
              }}
            />
          </div>
          <div className='w-full md:w-2/5  '>
            <SelectComponent
              name='Gemstones'
              title='Has other Gemstones? *'
              placeholder='Does it have other Gemstones? '
              required={true}
              options={[
                { val: true, name: "Yes" },
                { val: false, name: "No" },
              ].map((cat) => ({
                value: cat?.val,
                label: cat?.name,
              }))}
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  hasOtherGemstone: JSON.stringify(e),
                });
              }}
            />
          </div>
          {/* CHARGES */}
          {/* making  */}
          <div className='w-full md:w-2/5  '>
            <SelectComponent
              name='Making charge mode'
              title='Select Making charge mode *'
              placeholder='Select Making charge mode '
              required={true}
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
          <div className='w-full md:w-2/5'>
            <InputComponent
              required={true}
              placeholder='Enter Making Charge'
              maxLength={30}
              title='Making Charge *'
              showCount={true}
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  makingCharge: e.target.value,
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

          {/* WASTAGE */}
          <div className='w-full md:w-2/5  '>
            <SelectComponent
              name='Wastage charge mode'
              title='Select Wastage charge mode *'
              placeholder='Select Wastage charge mode '
              required={true}
              options={[
                { val: "percentage", name: "Percentage" },
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
          <div className='w-full md:w-2/5'>
            <InputComponent
              required={true}
              placeholder='Enter Wastage Charge'
              maxLength={30}
              title='Wastage Charge *'
              showCount={true}
              handleChange={(e) => {
                setManufacturerVar({
                  ...manufacturerVar,
                  wastageCharge: e.target.value,
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
        </section>
        <Button
          type='primary'
          className='text-white bg-indigo-500 border-0 w-[96%] md:w-max md:px-8 focus:outline-none hover:bg-indigo-600 hover:text-white rounded text-md m-2 duration-150 disabled:bg-indigo-300 disabled:text-white disabled:hover:bg-indigo-300'
          onClick={handleAssignment}
        >
          Assign Subcategory
        </Button>
      </section>
    </section>
  );
};

export default AssignCategory;
