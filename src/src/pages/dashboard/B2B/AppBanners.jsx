import React, { useEffect, useState } from "react";
import SectionTitle from "../../../components/Title/SectionTitle";
import {
  Divider,
  Button,
  message,
  Upload,
  Empty,
  Tooltip,
  Popconfirm,
} from "antd";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import DashboardTitle from "../../../components/Title/DashboardTitle";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_ALL_BANNERS } from "../../../GraphQl/Query";
import Spinner from "../../../components/Spinner/Spinner";
import MultiImageUpload from "../../../components/Inputs/MutliImageUpload";
import { CREATE_BANNER, DELETE_BANNER } from "../../../GraphQl/Mutations";
const AppBanners = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [getBanners, availableBanners] = useLazyQuery(GET_ALL_BANNERS, {
    onCompleted: (data) => {
      setSuccess("Banners retrieved successfully");
    },
    onError: (err) => {
      setError("Couldn't retrieve banners.");
    },
  });

  const [createBanner, createdBanner] = useMutation(CREATE_BANNER, {
    variables: {
      file: selectedImages[0],
      published: true,
    },
    onCompleted: (data) => {
      setSuccess("Banner created successfully!");
      getBanners();
    },
    onError: (err) => {
      setError("Couldn't create banner...");
    },
  });
  const [deleteAppBanner, deletedAppBanner] = useMutation(DELETE_BANNER, {
    onCompleted: (data) => {
      setSuccess(data?.deleteBanner?.message);
      getBanners();
    },
    onError: (err) => {
      setError("Couldn't delete banner...");
    },
  });

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

  const getAllBanners = () => {
    setTrial("Fetching Banners...");
    getBanners();
  };
  useEffect(() => {
    getBanners();
  }, []);

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imagesArray = Array.from(files);
    setSelectedImages(imagesArray);
  };
  const handleUpload = () => {
    if (selectedImages?.length > 0) {
      setTrial("Uploading...");
      createBanner();
    } else if (selectedImages?.length == 0) {
      setError("Please select some images...");
    }
  };
  const deleteBanner = (id) => {
    deleteAppBanner({
      variables: {
        id,
      },
    });
  };

  return (
    <section className='py-4 w-full'>
      {contextHolder}
      <SectionTitle title='Add Store Banners' />
      <Divider className='dark:bg-white/10' />
      <section>
        <DashboardTitle title='Create New Banners' />
        <MultiImageUpload
          setImages={(e) => setSelectedImages(e)}
          handleUpload={handleUpload}
          width='80vw'
          height='100%'
        />
        Images must be of size x x y
      </section>
      <DashboardTitle title='Available Banners' />
      {availableBanners?.loading && <Spinner />}
      <section className='flex flex-wrap'>
        {availableBanners?.data?.bannerDetails?.map((data, index) => (
          <div
            key={data?.id}
            style={{ margin: "10px" }}
            className='relative w-full h-auto '
          >
            <img
              src={data?.image}
              alt={`Preview ${index + 1}`}
              className='w-full h-full'
            />
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center border-2 border-red-600 bg-black/25 opacity-0 hover:opacity-100 duration-150'>
              <Tooltip title='Delete Banner' className='flex-1'>
                <Popconfirm
                  title='Delete the banner'
                  description='Are you sure to delete this banner?'
                  onConfirm={() => deleteBanner(data?.id)}
                  //   onCancel={cancel}
                  okButtonProps={{
                    style: { background: "rgb(220 38 38)" },
                  }}
                  okText={<span className='text-white'>Delete</span>}
                  cancelText='No'
                >
                  <DeleteOutlined className='text-red-600' />
                </Popconfirm>
              </Tooltip>
            </div>
          </div>
        ))}
      </section>
      {!availableBanners?.loading &&
        availableBanners?.data?.bannerDetails?.length == 0 && <Empty />}
    </section>
  );
};

export default AppBanners;
