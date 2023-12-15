import { useLazyQuery, useMutation } from "@apollo/client";
// import MultiImageUpload from "../../../../components/Inputs/MultiImageUpload";
import React, { useEffect, useState } from "react";
import {
  GET_ALL_PRODUCTS_FILTERED,
  GET_CATEGORY_DETAIL,
  GET_MANUFACTURERS_ASSIGNMENT_LIST,
  GET_SUBCATEGORY_LIST,
  
} from "../../../../GraphQl/Query";
import { useParams } from "react-router-dom";
import { UPDATE_CATEGORY_IMAGE } from "../../../../GraphQl/Mutations";

import SectionTitle from "../../../../components/Title/SectionTitle";
import {
  Card,
  Divider,
  Empty,
  List,
  Skeleton,
  Table,
  Tag,
  message,
} from "antd";
import Loader from "../../../../components/Spinner/Loader";
import LoadMore from "../../../../components/Buttons/LoadMore";
import MultiImageUpload from "../../../../components/Inputs/MutliImageUpload";
import ProductCard from "../../../../components/Products/ProductCard";
const SubCategoryCard = ({ subCategory, loading = false }) => {
  return (
    <Card title={subCategory?.name}>
      <div className='flex flex-wrap items-start justify-start gap-3 w-full'>
        {subCategory?.metadata?.map((metaData) => (
          <div className='m-2'>
            <strong>{metaData?.key?.toLocaleUpperCase()}</strong>

            <div className='text-lg'>
              {metaData?.value?.replace("[", "")?.replace("]", "")}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
const ManufacturerAssignmentCard = ({ manufacturer, loading = false }) => {
  return (
    <Card
      className='w-full lg:w-[45%]'
      title={
        <span className='text-lg'>{manufacturer?.manufacturer?.name}</span>
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

const SingleSubCategory = () => {
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
  const [getSubcategoryData, subcategoryData] = useLazyQuery(
    GET_CATEGORY_DETAIL,
    {
      variables: {
        first: 100,
        id: params?.id,
      },
      onCompleted: (data) => {
        console.log(data);
        setSuccess("Data fetched successfully");
      },
      onError: (err) => {
        setError("Error fetching data");
      },
    }
  );
  const [getSubcategoryMetaData, subcategoryMetaData] = useLazyQuery(
    GET_SUBCATEGORY_LIST,
    {
      variables: {
        subcategoryId: params?.id,
      },
      onCompleted: (data) => {
        console.log(data);
        setSuccess("Data fetched successfully");
      },
      onError: (err) => {
        setError("Error fetching data");
      },
    }
  );
  const [updateSubCategory, updatedSubCategory] = useMutation(UPDATE_CATEGORY_IMAGE, {
    onCompleted: (data) => {
      if (!data?.errors) {
        getSubcategoryData();
        setSuccess("Image updated successfully");
        setSubCategoryImage(null);
        setTrial("Fetching category details...");
      } else setError("Image couldnot be updated");
    },
    onError: (err) => {
      setError(err.message);
    },
  });
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [getSubcategory, subCategory] = useLazyQuery(
    GET_MANUFACTURERS_ASSIGNMENT_LIST,
    {
      variables: {
        subCategoryId: params?.id,
      },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  const [getAllProducts, allProducts] = useLazyQuery(
    GET_ALL_PRODUCTS_FILTERED,
    {
      variables: {
        filter: {
          search: null,
          categories: params?.id,
          collections: null,
          productType: null,
          attributes: null,
        },
        sort: { direction: "DESC", field: "PUBLICATION_DATE" },
      },
      onCompleted: (data) => {
        console.log(data);
      },
      onError: (err) => {
        console.log(err);
      },
    }
  );
  useEffect(() => {
    getSubcategoryData();
    getSubcategory();
    getSubcategoryMetaData();
    getAllProducts();
  }, [params?.id]);
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
      //  width: 250,
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
      //  width: 250,
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
          <h3 className='font-semibold text-md'>Flat</h3>
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
      title: "Making Days",
      width: 250,
      dataIndex: "makingDays",
      key: "makingDays",
      //  width: 250,
      render: (text, record) => (
        <div className='flex flex-col items-start'>
          <h3 className='font-semibold text-md'>{text}</h3>
        </div>
      ),
    },

    // {
    //   title: "Actions",
    //   width: 250,
    //   //  width: 250,
    //   render: (text, record) => (
    //     <div className='flex items-center gap-2'>
    //       <button class=' text-sm' onClick={() => handleOpenModal(record)}>
    //         Edit
    //       </button>
    //       <button class='text-sm' onClick={() => handleOpenModal(record)}>
    //         Delete
    //       </button>
    //     </div>
    //   ),
    // },
  ];
  return (
    <section className='w-full flex flex-col  justify-center'>
      {contextHolder}
      <div className='flex flex-wrap items-center justify-between'>
        
        <SectionTitle title={subcategoryData?.data?.category?.name || "Sub Category"}>
</SectionTitle>

      </div>
      <Divider className='dark:bg-white/10' />
      <div className='flex flex-wrap items-start justify-around'>
      <div className='flex flex-col items-start justify-start my-3 pl-2'>
                <MultiImageUpload
                  setImages={(e) => setSubCategoryImage(e[0])}
                  handleUpload={(e) => {
                    if (!subCategoryImage) setError("Please select a image");
                    else {
                      setTrial("Uploading image...");
                      updateSubCategory({
                        variables: {
                          id: params?.id,
                          input: { backgroundImage: subCategoryImage },
                        },
                      });
                    }
                  }}
                  multiple={false}
                  // id={params?.id}
                />
              </div>
              <div className="h-1/8">
      {subcategoryData?.data?.category?.backgroundImage?.url && (
              <img
                src={subcategoryData?.data?.category?.backgroundImage?.url}
                alt={subcategoryData?.data?.category?.backgroundImage?.alt}
                className='w-full lg:w-2/4'
              />
      )}</div>
      </div>
      <section className='productCardWrapper w-full px-0 justify-evenly gap-y-1 flex flex-col items-stretch  flex-wrap md:w-[95%] md:px-[2.5%] md:justify-around md:gap-4  py-3 '>
        {subcategoryData?.loading &&
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
        {!subcategoryData?.loading && !subcategoryData?.data && (
          <Empty
            description={
              <span className='dark:text-white'>No data available</span>
            }
          />
        )}
        <SubCategoryCard subCategory={subcategoryMetaData?.data?.category} />
        <SectionTitle title={"Manufacturers"} />
        {/* <div className='w-full flex flex-wrap  justify-start gap-4 mx-auto'>
          {subCategory?.loading ? (
            <Loader />
          ) : (
            subCategory?.data?.manufecturerAssignmentsBySubCategory?.map(
              (manufacturer) => (
                <ManufacturerAssignmentCard manufacturer={manufacturer} />
              )
            )
          )}
        </div> */}
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
          loading={subCategory?.loading}
        />
        <Divider className='dark:bg-white/10' />
        <SectionTitle title='Products' />
        {!allProducts?.loading &&
          allProducts?.data?.products?.edges?.length > 0 && (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
              }}
              className='w-full'
              dataSource={allProducts?.data?.products?.edges}
              renderItem={(product) => (
                <ProductCard product={product} key={product?.node?.id} />
              )}
            />
          )}
      </section>
    </section>
  );
};

export default SingleSubCategory;
