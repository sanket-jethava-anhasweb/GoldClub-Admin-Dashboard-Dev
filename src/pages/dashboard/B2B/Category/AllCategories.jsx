import React, { useEffect, useRef, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  Card,
  Divider,
  Empty,
  Input,
  List,
  Skeleton,
  Spin,
  Table,
  message,
} from "antd";
import { AiOutlineHeart, AiFillHeart, AiOutlineReload } from "react-icons/ai";
import { LoadingOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import SearchComponent from "../../../../components/Inputs/Search";

import { GET_ALL_CATEGORIES } from "../../../../GraphQl/Query";

import Spinner from "../../../../components/Spinner/Spinner";
import SectionTitle from "../../../../components/Title/SectionTitle";
import Loader from "../../../../components/Spinner/Loader";
import CategoriesEdit from "./CreateCategory";
import LoadMore from "../../../../components/Buttons/LoadMore";
import { setCategories } from "../../../../redux/actions/client";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
    className='dark:text-white'
  />
);
const CategoryCard = ({ category, loading }) => {
  const [edit, setEdit] = useState(true);

  //   const handleChange = (e) => {
  //     let val = e.target.value;
  //     if (edit && (val === "" || val === undefined || val === null || val < 0))
  //       setValue(0);
  //     else setValue(val);
  //   };
  return (
    <Card
      title={<span className='dark:text-white'>{category?.node?.name}</span>}
      extra={
        <Link
          to={category?.node?.id}
          className='text-blue-600 cursor-pointer font-semibold dark:text-white '
        >
          Edit
          {loading && <Spin indicator={antIcon} />}
        </Link>
      }
      className='w-full md:w-[40%] lg:w-[30%] dark:bg-slate-600'
    >
      <section className='flex flex-wrap items-start justify-around w-full '>
        {/* <div className='priceDiv w-1/2'>
          <h4 className='font-semibold text-md dark:text-slate-200'>
            Products
          </h4>
          <h2 className='text-lg font-semibold'>
            {category?.node?.products?.totalCount}
          </h2>
        </div> */}
        <div className='priceDiv w-full flex gap-x-5 items-center '>
          <h4 className='font-semibold text-md dark:text-slate-200'>
            SubCategories
          </h4>
          <h2 className='text-lg font-semibold'>
            {category?.node?.children?.totalCount}
          </h2>
        </div>
      </section>
    </Card>
  );
};

const AllCategories = () => {
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
  const dispatch = useDispatch();
  const search = useSelector((state) => state.client.homeSearchOpen);
  const localCategories = useSelector((state) => state.client.categories);
  const [searchParams, setSearchParams] = useSearchParams();
  const [after, setAfter] = useState(null);
  const [localList, setLocalList] = useState([]);
  const [localproduct, setLocalproduct] = useState([]);
  const [currentCategories, setCurrentCategories] = useState(null);
  const [getAllCategories, categories] = useLazyQuery(GET_ALL_CATEGORIES, {
    onCompleted: (data) => {
      setSuccess("Categories retrieved successfully!");
      setLocalList(data?.categories?.edges);
      dispatch(setCategories(data?.categories?.edges));
    },
    onError: (err) => {
      setError("Unable to retrieve categories");
    },
  });

  useEffect(() => {
    if (localCategories) {
      setLocalList(localCategories);
    }
    getAllCategories({
      variables: {
        first: 20,
        filter: {},
        sort: { direction: "ASC", field: "NAME" },
      },
    });
    console.log(searchParams?.get("search"));
  }, []);

  const modalRef = useRef();

  const handleOpenModal = (e) => {
    setCurrentCategories(e);
    modalRef.current.openModal();
  };
  const handleSearch = (e) => {
    const val = e?.target?.value?.toLowerCase();
    console.log(val);
    if (val !== "" || val !== undefined)
      setLocalList(
        categories?.data?.categories?.edges?.filter((edge) =>
          edge?.node.name?.toLowerCase()?.includes(val)
        )
      );
    else setLocalList(categories?.data?.categories?.edges);
  };

  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}
      <CategoriesEdit ref={modalRef} categories={currentCategories} />

      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Categories' />
        {/* <button
          onClick={() => {
            handleOpenModal();
          }}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md'
        >
          + Create New
        </button> */}
      </div>
      <Divider className='dark:bg-white/10' />
      <section className='w-full px-[10px] my-4 flex  justify-around'>
        <div className='w-full'>
          <SearchComponent handleSearch={handleSearch} />
        </div>

        <button
          class='inline-flex h-3/4 items-center text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-sm'
          onClick={() =>
            getAllCategories({
              variables: {
                first: 20,
                filter: {},
                sort: { direction: "ASC", field: "NAME" },
              },
            })
          }
        >
          {categories?.loading ? <Loader /> : <AiOutlineReload />}
        </button>
      </section>
      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex flex-col items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4  py-3 '>
        {categories?.loading &&
          Array(2)
            ?.fill(0)
            ?.map((item) => (
              // <ProductCard product={product} key={product?.node?.id} />
              <Card className='w-full md:w-[45%] lg:w-[30%] scale-95 flex flex-col gap-y-2'>
                <div className='mt-2'>
                  <Skeleton active />
                </div>
              </Card>
            ))}
        {!categories?.loading && localList?.length == 0 && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}{" "}
        <div className='w-full flex flex-wrap items-center justify-start gap-4 mx-auto'>
          {!categories?.loading &&
            localList?.length > 0 &&
            localList?.map((category) => (
              <>
                <CategoryCard
                  category={category}
                  loading={categories.loading}
                />
              </>
            ))}
        </div>
        {categories?.data?.categories?.pageInfo?.hasNextPage && (
          <div className='w-1/2'>
            <LoadMore
              loading={categories?.loading}
              handleRefetch={() => {
                categories?.fetchMore({
                  variables: {
                    after: categories?.data?.categories?.pageInfo?.endCursor,
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    console.log("New", fetchMoreResult.categories.edges);
                    fetchMoreResult.categories.edges = [
                      ...localList,
                      ...fetchMoreResult.categories.edges,
                    ];
                    return fetchMoreResult;
                  },
                });
              }}
            />
          </div>
        )}
      </section>
    </section>
  );
};

export default AllCategories;
