import { useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { GET_CATEGORY_DETAIL } from "../../../../GraphQl/Query";
import CategoriesEdit from "../Category/CreateCategory";
import Spinner from "../../../../components/Spinner/Spinner";
import InputComponent from "../../../../components/Inputs/Input";
import SectionTitle from "../../../../components/Title/SectionTitle";
import SearchComponent from "../../../../components/Inputs/Search";
import { Card, Divider, Empty, Skeleton, Spin, message } from "antd";
import Loader from "../../../../components/Spinner/Loader";
import { AiOutlineReload } from "react-icons/ai";
import LoadMore from "../../../../components/Buttons/LoadMore";
import MultiImageUpload from "../../../../components/Inputs/MutliImageUpload";
import { UPDATE_CATEGORY_IMAGE } from "../../../../GraphQl/Mutations";
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
          to={"../sub-categories/" + category?.node?.id}
          className='text-blue-600 cursor-pointer font-semibold dark:text-white '
        >
          Edit
          {loading && <Spin indicator={antIcon} />}
        </Link>
      }
      className='w-full md:w-[40%] lg:w-[30%] dark:bg-slate-600'
    >
      <section className='flex flex-wrap items-start justify-around w-full '>
        <div className='priceDiv w-1/2'>
          <h4 className='font-semibold text-md dark:text-slate-200'>
            Products
          </h4>
          <h2 className='text-lg font-semibold'>
            {category?.node?.products?.totalCount}
          </h2>
        </div>
        <div className='priceDiv w-1/2'>
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
const SingleCategory = () => {
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
  const params = useParams();
  const modalRef = useRef();
  const newBtn = useRef();
  const [err, setErr] = useState(null);
  const [categoryImage, setCategoyImage] = useState(null);
  const [localSubCategories, setLocalSubCategories] = useState(null);
  const handleOpenModal = (e) => {
    modalRef.current.openModal();
  };

 

  const [getCategory, category] = useLazyQuery(GET_CATEGORY_DETAIL, {
    variables: { first: 100, id: params?.id },
    onCompleted: (data) => {
      console.log(data);
      setLocalSubCategories(data?.category?.children?.edges);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  

  const [updateCategory, updatedCategory] = useMutation(UPDATE_CATEGORY_IMAGE, {
    onCompleted: (data) => {
      if (!data?.errors) {
        getCategory();
        setSuccess("Image updated successfully");
        setCategoyImage(null);
        setTrial("Fetching category details...");
      } else setErr("Image couldnot be updated");
    },
    onError: (err) => {
      setErr(err.message);
    },
  });

  useEffect(() => {
    getCategory();
    if (newBtn) {
      newBtn.current.disabled = true;

      setTimeout(() => {
        newBtn.current.disabled = false;
      }, 2000);
    }
  }, []);

  if (category?.loading) return <Spinner />;
  return (
    <section className='w-full flex flex-col  justify-center '>
      {contextHolder}
      <CategoriesEdit
        ref={modalRef}
        parent={params?.id}
        parentName={category?.data?.category?.name}
      />

      <div className='flex flex-wrap items-center justify-between'>
        <SectionTitle title='Category' />
        <button
          onClick={() => {
            handleOpenModal();
          }}
          ref={newBtn}
          className='inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-md disabled:opacity-60 disabled:cursor-not-allowed'
        >
          + Create New Subcategory
        </button>
      </div>
      <Divider className='dark:bg-white/10' />

      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex flex-col items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4  py-3 '>
        {category?.loading &&
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
        {!category?.loading && !category?.data && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}

        <div className='w-full flex flex-wrap items-center justify-start gap-4 mx-auto'>
          <div className='flex flex-wrap items-start justify-around'>
            <div className='w-full lg:w-1/4'>
              <SectionTitle title={category?.data?.category?.name} />
              {category?.data?.category?.descriptionJson &&
                JSON.parse(
                  category?.data?.category?.descriptionJson
                )?.blocks?.map((block) => (
                  <span>{block?.text || "No data available"}</span>
                ))}
              <div className='flex flex-col items-start justify-start my-3 pl-2'>
                <MultiImageUpload
                  setImages={(e) => setCategoyImage(e[0])}
                  handleUpload={(e) => {
                    if (!categoryImage) setErr("Please select a image");
                    else {
                      setTrial("Uploading image...");
                      updateCategory({
                        variables: {
                          id: params?.id,
                          input: { backgroundImage: categoryImage },
                        },
                      });
                    }
                  }}
                  multiple={false}
                  // id={params?.id}
                />
              </div>
            </div>
            {category?.data?.category?.backgroundImage && (
              <img
                src={category?.data?.category?.backgroundImage?.url}
                alt={category?.data?.category?.backgroundImage?.alt}
                className='w-full lg:w-2/4'
              />
            )}
          </div>
          <Divider className='dark:bg-white/10' />
        </div>
        <SectionTitle title='Sub categories' />
        <div className='w-full flex flex-wrap items-center justify-start gap-4 mx-auto'>
          {!category?.data?.category?.children?.edges?.length && (
            <Empty description='No data available' />
          )}
          {category?.data?.category?.children?.edges?.map((subCat) => (
            <CategoryCard category={subCat} loading={category?.loading} />
          ))}
        </div>
        {category?.data?.category?.children?.pageInfo?.hasNextPage && (
          <div className='w-1/2'>
            <LoadMore
              loading={category?.loading}
              handleRefetch={() => {
                category?.fetchMore({
                  variables: {
                    after:
                      category?.data?.categories?.children?.pageInfo?.endCursor,
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    fetchMoreResult.categories.edges = [
                      ...localSubCategories,
                      ...fetchMoreResult.category.children.edges,
                    ];
                    return fetchMoreResult;
                  },
                });
              }}
            />
          </div>
        )}

        {/* <Divider className='dark:bg-white/10' /> */}

        {/* <SectionTitle title='Products' />
        <div className='w-full flex flex-wrap items-center justify-start gap-4 mx-auto'>
          {!category?.data?.category?.products?.edges?.length && (
            <Empty description='No data available' />
          )}
          {category?.data?.category?.products?.edges?.map((subCat) => (
            <CategoryCard category={subCat} loading={category?.loading} />
          ))}
        </div>
        {category?.data?.category?.products?.pageInfo?.hasNextPage && (
          <div className='w-1/2'>
            <LoadMore
              loading={category?.loading}
              handleRefetch={() => {
                category?.fetchMore({
                  variables: {
                    after:
                      category?.data?.categories?.products?.pageInfo?.endCursor,
                  },
                  updateQuery: (prevResult, { fetchMoreResult }) => {
                    fetchMoreResult.categories.edges = [
                      ...localSubCategories,
                      ...fetchMoreResult.category.children.edges,
                    ];
                    return fetchMoreResult;
                  },
                });
              }}
            />
          </div>
        )} */}
      </section>
    </section>
  );
};

export default SingleCategory;
