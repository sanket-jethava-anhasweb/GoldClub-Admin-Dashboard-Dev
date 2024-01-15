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
  GET_ACTIVE_CATEGORIES,
  GET_ACTIVE_KARAT,
  GET_ALL_MANUFACTURERS,
  GET_CATEGORY_DETAIL,
  GET_MANUFACTURERS_ASSIGNMENT_LIST,
  GET_SUBCATEGORY_PRICING_DETAILS,
  SEARCH_CATEGORIES,
  GET_ALLSUBCATEGORY_PRICES
} from "../../../../GraphQl/Query";

import Spinner from "../../../../components/Spinner/Spinner";
import SectionTitle from "../../../../components/Title/SectionTitle";
import Loader from "../../../../components/Spinner/Loader";
import ManufacturerEdit from "../../../../components/Modals/CreateSubcategoryPricing";
import UpdatePricing from "../../../../components/Modals/UpdateSubcategoryPricing";
import { setManufacturers } from "../../../../redux/actions/client";
import SelectComponent from "../../../../components/Inputs/Select";

const SubcategoryPricing = () => {
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
  const [currentID, setCurrentID] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [after, setAfter] = useState(null);
  const [localList, setLocalList] = useState([]);
  const [localvariables, setLocalvariables] = useState([]);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
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

  const updateRef = useRef();

  const [list, setList] = useState([]);

  const handleOpenModal = (e) => {
    setCurrentSubcategory(e);
    modalRef.current.openModal();
  };

  // const handleCloseModal = () => {
  //   modalRef.current.closeModal()
  // }

  const handleOpenEditModal = (record) => {
    console.log("record.id",record.id);
    setCurrentID(record)
    updateRef.current.openModal();
  }
  // const handleSearch = (e) => {
  //   const val = e?.target?.value?.toLowerCase();
  //   console.log(val);
  //   if (val !== "" || val !== undefined)
  //     setLocalList(
  //       manufacturers?.data?.manufecturers?.filter(
  //         (edge) =>
  //           edge?.name?.toLowerCase()?.includes(val) ||
  //           edge?.contactPersonName?.toLowerCase()?.includes(val) ||
  //           edge?.gstNumber?.toLowerCase()?.includes(val)
  //       )
  //     );
  //   else setLocalList(manufacturers?.data?.manufecturers);
  // };

  const columns = [
    {
      title: "Name",
      width: 250,
      dataIndex: "name",
      //  width: 250,
      key: "name",

      render: (text, record) => (
        
        <h3 className='font-semibold text-md'>{record?.name}</h3>
      ),
    },
    {
      title: "Carats",
      width: 250,
      key: "carats",

      render: (text, record) => (
        <h3 className='font-semibold text-md'>{record?.carat}</h3>
      ),
    },
    // {
    //   title: "Colours",
    //   width: 250,
    //   key: "colours",

    //   render: (text, record) => (
    //     <h3 className='font-semibold text-md'>{record?.metadata[1]?.value.replace("[","").replace("]","")}</h3>
    //   ),
    // },
    // {
    //   title: "Metal",
    //   width: 250,
    //   //  width: 250,
   
    //   key: "metal",

    //   render: (text, record) => (
    //     // <>{record?.node?.created}</>;

    //     <h3 className='font-semibold text-md'>{record?.metadata[2]?.value.replace("[","").replace("]","")}</h3>
    //   ),
    // },
    {
      title: "Making charge mode",
      width: 250,
      //  width: 250,
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
      //  width: 250,
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
      //  width: 250,
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
      //  width: 250,
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },

    {
      title: "Actions",
      width: 250,
      //  width: 250,
      render: (text, record) => (
        <div className='flex items-center gap-2'>
          <button class=' text-sm' onClick={() => handleOpenEditModal(record)}>
            Edit
          </button>
          {/* <button class='text-sm' onClick={() => handleOpenModal(record)}>
            Delete
          </button> */}
        </div>
      ),
    },
  ];
  const [fetchCategories, categories] = useLazyQuery(GET_ACTIVE_CATEGORIES, {
    variables:{
  "first": 100,
  "level": 0
}
,
onCompleted:(data)=>{console.log(data)},
    onError: (err) => {
      console.log(err);
    },
  });
  const [fetchCaratage, caratage] = useLazyQuery(GET_ACTIVE_KARAT, {
    onError:(err)=>setError(err.message)
  })

  const [getCategoryDetails,categoryDetails] = useLazyQuery(GET_ALLSUBCATEGORY_PRICES, {
  onError:(err)=>{setError(err.message)}
})
  useEffect(() => {
    fetchCategories();
    
  }, []);
  useEffect(() => {
    if (localvariables.metal && localvariables.categoryId && localvariables.carat) {
      getCategoryDetails({
        variables: {
          category: localvariables.categoryId,
          metalType: localvariables.metal,
          carat: localvariables.carat,
          // color: localvariables.colour
        },
        onCompleted: (data) => {
          if (data.categoryPrices && data.categoryPrices.length > 0) {
            const formattedData = data.categoryPrices.map(item => ({
              id: item.id,
              name: item.subcategory.name,
              carat: item.carat,
              makingChargeMode: item.makingChargeMode,
              makingCharge: item.makingCharge,
              wastageChargeMode: item.wastageChargeMode,
              wastageCharge: item.wastageCharge,
            }));
            console.log("Formatted Data:", formattedData);
            setList(formattedData);
          } else {
            setList([]);
            // Handle the case where there's no data
          }
        },
        onError: (error) => {
          // Handle error
          console.error("Error fetching category details:", error);
        }
      });
    }
  }, [localvariables]);
  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}

      <ManufacturerEdit ref={modalRef} manufacturer={currentSubcategory} />
      <UpdatePricing ref={updateRef} id={currentID} />
      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Subcategory Prices' />

        {/* <Link
          to={"/dashboard/b2b/create-manufacturers"}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          + Create New
        </Link> */}
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='row flex flex-wrap items-center gap-2 md:gap-5 pl-10 justify-start'>
        {/* <div className="row flex flex-wrap items-center gap-2 md:gap-5 pl-10 justify-start"> */}
        <SelectComponent
          placeholder='Select metal'
          title='Metal'
          required={true}
          loading={categories?.loading}
          options={["gold","silver","platinum"].map((edge) => {
            return {
              value: edge,
              label: edge?.toUpperCase(),
            };
          })}
          handleChange={(e)=>setLocalvariables({...localvariables,metal:e})}
          className='w-full md:w-1/5'
        />
        <SelectComponent
          placeholder='Select product category'
          title='Product Category'
          required={true}
          loading={categories?.loading}
          options={categories?.data?.categories?.edges?.map((edge) => {
            return {
              value: edge?.node?.id,
              label: edge?.node?.name,
            };
          })}
          handleChange={(e) => {
            setLocalvariables({ ...localvariables, categoryId: e })
            fetchCaratage({variables:{
              categoryId: e,
                metalType: localvariables?.metal 
              },onCompleted:(data)=>console.log(data?.subcategoryActiveCarats?.colours)
              })
          }}
          className='w-2/5 md:w-1/5'
        />
        <SelectComponent
          placeholder='Select Carat'
          title='Carat'
          required={true}
          loading={caratage?.loading}
          options={(caratage?.data?.subcategoryActiveCarats?.carats?.replace("[","").replace("]","").split(","))?.map(
            (edge) => {
              return {
                value: (edge.replace(/\'/g, "").split(" ").join("")),
                label: (edge.replace(/\'/g, "").split(" ").join("")),
              };
            }
          )}
          handleChange={(e) => {
           setLocalvariables({...localvariables,carat:e})
          }}
          className='w-2/5 md:w-1/5'
        />
        {/* <SelectComponent
          placeholder='Select Colors'
          title='Colors'
          required={true}
          loading={caratage?.loading}
          options={(caratage?.data?.subcategoryActiveCarats?.colour?.replace("[","").replace("]","").split(","))?.map(
            (edge) => {
              return {
                value: (edge.replace(/\'/g, "").split(" ").join("")),
                label: (edge.replace(/\'/g, "").split(" ").join("")),
              };
            }
          )}
          handleChange={(e) => {
           setLocalvariables({...localvariables,colour:e})
          }}
          className='w-full md:w-2/5'
        /> */}
        {/* </div> */}
        {/* <div> */}
        <button
          class='pos-absolute inline-flex h-3/4 w-fit mt-3 items-center float-right  text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={handleOpenModal}
        >
          + Create Assignment
        </button>
        {/* </div> */}
      </section>
      {/* <section className='w-full px-[10px] my-4 flex  justify-around'> */}
        {/* <div className='w-full'>
          <SearchComponent handleSearch={handleSearch} />
        </div> */}

        
        
        {/* <button
          class='inline-flex h-3/4 items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={getAllManufacturers}
        >
          {manufacturers?.loading ? <Loader /> : <AiOutlineReload />}
        </button> */}

        
      {/* </section> */}

      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4 '>
        {/* {list &&
          Array(2)
            ?.fill(0)
            ?.map((item) => (
              // <ProductCard product={product} key={product?.node?.id} />
              <Skeleton active={true} className='w-full' />
            ))} */}
        {!list && list?.length == 0 && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}{" "}
        {/* {!manufacturers?.loading &&
          subCategory?.data?.manufecturerAssignmentsBySubCategory?.length >
            0 && ( */}
          {console.log("list",list)}
        <Table
          dataSource={list}
          columns={columns}
          rowKey={(record) => record?.node?.id}
          exportable
          searchable
          scroll={{
            x: "auto",
          }}
          bordered
          sticky
          // loading={list}
        />       
      </section>
    </section>
  );
};

export default SubcategoryPricing;
