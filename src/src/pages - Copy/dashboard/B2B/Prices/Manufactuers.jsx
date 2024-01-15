import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Card, Divider, Empty, List, Skeleton, Table, message } from "antd";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineReload,
  AiFillEye,
  AiOutlineEdit,
} from "react-icons/ai";
import { CgArrowLongRight } from "react-icons/cg";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchComponent from "../../../../components/Inputs/Search";

import {
  GET_ALL_MANUFACTURERS,
  GET_CATEGORY_DETAIL,
  GET_MANUFACTURERS_ASSIGNMENT_LIST,
  SEARCH_CATEGORIES,
} from "../../../../GraphQl/Query";

import Spinner from "../../../../components/Spinner/Spinner";
import SectionTitle from "../../../../components/Title/SectionTitle";
import Loader from "../../../../components/Spinner/Loader";
import ManufacturerEdit from "../../../../components/Modals/CreateSubcategoryPricing";
import { setManufacturers } from "../../../../redux/actions/client";
import SelectComponent from "../../../../components/Inputs/Select";

const Manufacturers = (manufacturer) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const search = useSelector((state) => state.client.homeSearchOpen);
  const local_manufacturers = useSelector(
    (state) => state.client.manufacturers
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [after, setAfter] = useState(null);
  const [localList, setLocalList] = useState([]);
  const [localproduct, setLocalproduct] = useState([]);
  const [currentManufacturer, setCurrentManufacturer] = useState(null);
  const [getAllManufacturers, manufacturers] = useLazyQuery(
    GET_ALL_MANUFACTURERS,
    {
      onCompleted: (data) => {
        console.log(data);
        setLocalList(data?.manufecturers);
        dispatch(setManufacturers(data?.manufecturers));
      },
      onError: (err) => {
        setError("Unable to retrieve manufacturers");
      },
    }
  );

  useEffect(() => {
    if (local_manufacturers) setLocalList(local_manufacturers);
    getAllManufacturers();
  }, []);
  useEffect(() => {
    getAllManufacturers();
  }, [searchParams]);
  const modalRef = useRef();

  const [makingCharge, setMakingCharge] = useState(manufacturer?.makingCharge || "");
  const [wastageCharge, setWastageCharge] = useState(manufacturer?.wastageCharge || "");

  const handleOpenModal = (e) => {
    setCurrentManufacturer(e);
    modalRef.current.openModal();
  };
  const handleSearch = (e) => {
    const val = e?.target?.value?.toLowerCase();
    console.log(val);
    if (val !== "" || val !== undefined)
      setLocalList(
        manufacturers?.data?.manufecturers?.filter(
          (edge) =>
            edge?.name?.toLowerCase()?.includes(val) ||
            edge?.contactPersonName?.toLowerCase()?.includes(val) ||
            edge?.gstNumber?.toLowerCase()?.includes(val)
        )
      );
    else setLocalList(manufacturers?.data?.manufecturers);
  };

  const columns = [
    {
      title: "Name",
      width: 250,
      dataIndex: ["manufacturer", "name"],
      key: "Name",

      render: (text, record) => (
        // <>{record?.node?.created}</>;
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },
    {
      title: "Category",
      width: 250,
      dataIndex: ["category", "name"],
      
      key: "phone Number",

      render: (text, record) => (
        <h3 className='font-semibold text-md'>{text}</h3>
      ),
    },
    {
      title: "Sub Category",
      width: 250,

      dataIndex: ["subcategory", "name"],
      key: "subcategory",

      render: (text, record) => (
        <h3 className='font-semibold text-md'>{text}</h3>
      ),
    },
    {
      title: "Metal Type",
      width: 250,
      
      dataIndex: ["metalType"],
      key: "Address",

      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>{text?.toUpperCase()}</h3>
      ),
    },
    {
      title: "Making charge mode",
      width: 250,
      
      dataIndex: "makingChargeMode",
      key: "makingChargeMode",

      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },
    {
      title: "Making charge ",
      width: 250,
      dataIndex: "makingCharge",
      key: "makingCharge",
      
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },
    {
      title: "Wastage charge mode",
      width: 250,
      dataIndex: "wastageChargeMode",
      key: "wastageChargeMode",
      
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },
    {
      title: "Wastage charge ",
      width: 250,
      dataIndex: "wastageCharge",
      key: "wastageCharge",
      
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },
    {
      title: "Making Days",
      width: 250,
      dataIndex: "makingDays",
      key: "makingDays",
      
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },

    {
      title: "Actions",
      width: 250,
      
      render: (text, record) => (
        <div className='flex items-center gap-2'>
          <button class=' text-sm' onClick={() => handleOpenModal(record)}>
            Edit
          </button>
          <button class='text-sm' onClick={() => handleOpenModal(record)}>
            Delete
          </button>
        </div>
      ),
    },
  ];
  const [fetchCategories, categories] = useLazyQuery(SEARCH_CATEGORIES, {
    variables: {
      after: after?.categoriesAfter,
      first: 100,
      query: "",
    },

    onError: (err) => {
      console.log(err);
    },
  });

  const [fetchSingleCategory, singleCategory] = useLazyQuery(
    GET_CATEGORY_DETAIL,
    {
      onError: (err) => {
        setError(err.message);
      },
    }
  );
  const [getSubcategory, subCategory] = useLazyQuery(
    GET_MANUFACTURERS_ASSIGNMENT_LIST,
    {
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  useEffect(() => {
    fetchCategories();
    getSubcategory({
      variables: {
        subCategoryId: "Q2F0ZWdvcnk6Mjg=",
      },
    });
  }, []);
  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}

      <ManufacturerEdit ref={modalRef} manufacturer={currentManufacturer} />
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Manufacturers Prices' />

        {/* <Link
          to={"/dashboard/b2b/create-manufacturers"}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          + Create New
        </Link> */}
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='row flex flex-wrap items-center gap-2 md:gap-5 '>
        <SelectComponent
          placeholder='Select product category'
          title='Product Category'
          required={true}
          loading={categories?.loading}
          options={categories?.data?.search?.edges?.map((edge) => {
            return {
              value: edge?.node?.id,
              label: edge?.node?.name,
            };
          })}
          handleChange={(e) => {
            fetchSingleCategory({
              variables: { first: 100, id: e },
            });
          }}
          className='w-full md:w-2/5'
        />
        <SelectComponent
          placeholder='Select Sub category'
          title='Sub Category'
          required={true}
          loading={singleCategory?.loading}
          options={singleCategory?.data?.category?.children?.edges?.map(
            (edge) => {
              return {
                value: edge?.node?.id,
                label: edge?.node?.name,
              };
            }
          )}
          handleChange={(e) => {
            getSubcategory({
              variables: {
                subCategoryId: e,
              },
            });
          }}
          className='w-full md:w-2/5'
        />
      </section>
      <section className='w-full px-[10px] my-4 flex  justify-around'>
        <div className='w-full'>
          <SearchComponent handleSearch={handleSearch} />
        </div>

        {/* <button
          class='inline-flex h-3/4 items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={getAllManufacturers}
        >
          {manufacturers?.loading ? <Loader /> : <AiOutlineReload />}
        </button> */}
      </section>

      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4 '>
        {manufacturers?.loading &&
          Array(2)
            ?.fill(0)
            ?.map((item) => (
              // <ProductCard product={product} key={product?.node?.id} />
              <Skeleton active={true} className='w-full' />
            ))}
        {!manufacturers?.loading && localList?.length == 0 && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}{" "}
        {/* {!manufacturers?.loading &&
          subCategory?.data?.manufecturerAssignmentsBySubCategory?.length >
            0 && ( */}
        <Table
          dataSource={subCategory?.data?.manufecturerAssignmentsBySubCategory}
          columns={columns}
          rowKey={(record) => record?.node?.id}
          exportable
          searchable
          scroll={{
            x: "auto",
          }}
          bordered
          sticky
          loading={manufacturers?.loading}
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <p>
          //       <span className='font-bold'>Full Address: </span>
          //       {record?.node?.billingAddress &&
          //         Array.from([
          //           record?.node?.billingAddress?.streetAddress1,
          //           record?.node?.billingAddress?.streetAddress2,
          //           record?.node?.billingAddress?.city,
          //           record?.node?.billingAddress?.cityArea,
          //           record?.node?.billingAddress?.countryArea,
          //           record?.node?.billingAddress?.postalCode,
          //           record?.node?.billingAddress?.country?.country,
          //         ]).join(" ")}
          //     </p>
          //   ),
          //   rowExpandable: (record) => record?.node?.billingAddress !== null,
          // }}
        />
        {/* )} */}
      </section>
    </section>
  );
};

export default Manufacturers;
