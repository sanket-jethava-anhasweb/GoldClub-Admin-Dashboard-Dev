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

import { GET_ALL_MANUFACTURERS } from "../../../../GraphQl/Query";

import Spinner from "../../../../components/Spinner/Spinner";
import SectionTitle from "../../../../components/Title/SectionTitle";
import Loader from "../../../../components/Spinner/Loader";
import ManufacturerEdit from "../../../../components/Modals/ManufacturerEdit";
import { setManufacturers } from "../../../../redux/actions/client";

const AllManufacturers = () => {
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
      dataIndex: "name",
      key: "Name",
      width: "15%",
      render: (text, record) => (
        // <>{record?.node?.created}</>;
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{record?.name || "N/A"}</h3>
        </div>
      ),
    },
    {
      title: "Phone",
      dataIndex: ["phoneNumber"],
      key: "phone Number",
      width: "15%",
      render: (text, record) => (
        <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
      ),
    },
 {
      title: "City",
      dataIndex: "city",
      key: "City",
      width: "15%",
      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>
          {text?? "N/A"}
        </h3>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "Address",
      width: "15%",
      render: (text, record) => (
        // <>{record?.node?.created}</>;

        <h3 className='font-semibold text-md'>
              {text|| "N/A"}
        </h3>
      ),
    },
    {
      title: "GST No.",
      dataIndex: "gstNumber",
      key: "gstNumber",
      width: "15%",
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contactPersonName",
      key: "contactPersonName",
      width: "15%",
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text || "N/A"}</h3>
        </div>
      ),
    },
    {
      title: "Actions",
      width: "10%",
      render: (text, record) => (
        <div className='flex items-center gap-2'>
          <button
            class='inline-flex text-white bg-yellow-500 border-0 py-2 px-6 focus:outline-none hover:bg-yellow-600 rounded text-sm'
            onClick={() => navigate(record?.id)}
          >
            <AiFillEye size={22} />
          </button>
          <button
            class='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
            onClick={() => handleOpenModal(record)}
          >
            <AiOutlineEdit size={22} />
          </button>
          <button
            class='inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-sm'
            onClick={() => navigate("assign/" + record?.id)}
          >
            Assign
          </button>
        </div>
      ),
    },
  ];
return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}
      <ManufacturerEdit ref={modalRef} manufacturer={currentManufacturer} />
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Manufacturers' />
        <Link
          to={"/dashboard/b2b/create-manufacturers"}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          + Create New
        </Link>
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='w-full px-[10px] my-4 flex  justify-around'>
        <div className='w-full'>
          <SearchComponent handleSearch={handleSearch} />
        </div>

        <button
          class='inline-flex h-3/4 items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={getAllManufacturers}
        >
          {manufacturers?.loading ? <Loader /> : <AiOutlineReload />}
        </button>
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
        {!manufacturers?.loading && localList?.length > 0 && (
          <Table
            dataSource={localList}
            columns={columns}
            rowKey={(record) => record?.node?.id}
            exportable
            searchable
            scroll={{
              x: "auto",
            }}
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
        )}
      </section>
    </section>
  );
};

export default AllManufacturers;
