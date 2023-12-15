import React, { useState } from "react";
import SectionTitle from "../../../components/Title/SectionTitle";
import { Divider, List, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_PRODUCT_BY_ID } from "../../../GraphQl/Query";
import { useEffect } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import MultiImageUpload from "../../../components/Inputs/MutliImageUpload";
import DashboardTitle from "../../../components/Title/DashboardTitle";
import {
  PRODUCT_IMAGE_DELETE,
  UPLOAD_PRODUCT_IMAGE,
} from "../../../GraphQl/Mutations";

const ProductImages = () => {
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
  const [images, setImages] = useState([]);
  const [toUpload, setToUpload] = useState([]);
  const [fetchProduct, product] = useLazyQuery(GET_PRODUCT_BY_ID, {
    variables: {
      id: params?.id,
    },
    onCompleted: (data) => {
      setImages(data?.product?.images);
    },
    onError: (err) => {
      setError("Unable to retrieve product");
    },
  });
  const [deleteImage, deletedImage] = useMutation(PRODUCT_IMAGE_DELETE, {
    onCompleted: (data) => {
      setSuccess("Image deleted successfully");
      fetchProduct();
    },
    onError: (err) => {
      setError("Unable to delete Image");
    },
  });

  const [uploadImage, uploadedImage] = useMutation(UPLOAD_PRODUCT_IMAGE, {
    variables: {
      product: params?.id,
      image: toUpload[0],
      alt: toUpload[0]?.name,
    },
    onCompleted: (data) => {
      if (data?.productImageCreate?.errors?.length > 0)
        setError("Unable to upload image");
      else if (data?.productImageCreate?.product)
        setSuccess("Uploaded image successfully");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  useEffect(() => {
    fetchProduct();
    return () => {
      console.log(" component unmounted");
    };
  }, []);

  const handleImages = (e) => {
    setToUpload(e);
  };
  const handleUpload = (e) => {
    setTrial("Uploading Image..");
    uploadImage();
  };
  const handleDelete = (id) => {
    setTrial("Deleting Image");
    deleteImage({
      variables: {
        id,
      },
    });
  };

  // useEffect(() => {
  //   console.log(toUpload[0]);
  // }, [toUpload]);

  // function onChange({
  //   target: {
  //     validity,
  //     files: [file],
  //   },
  // }) {
  //   if (validity.valid) {
  //     console.log({ product: params?.id, image: file, alt: file?.name });
  //     setTimeout(() => {
  //       uploadImage({
  //         variables: { product: params?.id, image: file, alt: file?.name },
  //       });
  //     }, 100);
  //   }
  // }
  const handleImageChange = (e) => {
    let file = e.target?.files[0];
    localStorage.setItem("file", JSON.stringify(e.target?.files[0]));
    let var_up = {
      alt: file.name,
      image: localStorage.getItem("file"),
      product: params?.id,
    };
    console.log(JSON.stringify(var_up?.image));
    uploadImage({
      variables: var_up,
    });
  };
  return (
    <section className="py-4">
      {contextHolder}
      <SectionTitle title="Edit Images" />
      <Divider className="dark:bg-white/10" />
      <DashboardTitle title="Available Images" />
      {/* {product?.loading && <Spinner />} */}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 3,
        }}
        loading={product?.loading}
        dataSource={images}
        renderItem={(item) => (
          <List.Item>
            <div
              key={item?.id}
              style={{ margin: "10px" }}
              className="relative border-[1px] shadow-md group"
            >
              <img
                src={item?.url}
                alt={`Preview ${item?.id}`}
                className="rounded"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center border-2 border-red-600 bg-red-500/50 opacity-0  duration-100 group-hover:opacity-100 ">
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this image?"
                  onConfirm={() => handleDelete(item?.id)}
                  //   onCancel={cancel}
                  okText={<span className="text-black">Yes</span>}
                  cancelText="No"
                >
                  <DeleteOutlined className="text-white cursor-pointer text-2xl shadow-white drop-shadow-xl" />
                </Popconfirm>
              </div>
            </div>
          </List.Item>
        )}
      />
      <DashboardTitle title="Upload New Images" />

      <MultiImageUpload
        setImages={handleImages}
        handleUpload={handleUpload}
        multiple={false}
        id={params?.id}
      />
      {/* <input type="file" name="fileUp" id="" onChange={handleImageChange} /> */}
    </section>
  );
};

export default ProductImages;
