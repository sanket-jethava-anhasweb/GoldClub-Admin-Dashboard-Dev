import React, { useState } from "react";
import { DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Button } from "antd";
const MultiImageUpload = (props) => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imagesArray = Array.from(files);
    setSelectedImages(imagesArray);
    props?.setImages(imagesArray);
  };

  useEffect(() => {
    if (selectedImages?.length == 0)
      document.getElementById("fileUpload").value = null;
  }, [selectedImages]);
  return (
    <div className='relative'>
      <label htmlFor='fileUpload '>
        <input
          type='file'
          multiple
          id='fileUpload'
          name='fileUpload'
          accept='image/*'
          onChange={handleImageChange}
          className='appearance-none absolute opacity-0 z-10 cursor-pointer'
        />

        <Button
          icon={<UploadOutlined />}
          className='dark:text-white pointer-events-none'
        >
          Upload New Image
        </Button>
      </label>
      <div className='flex flex-wrap my-4'>
        {selectedImages?.map((image, index) => (
          <div key={index} style={{ margin: "10px" }} className='relative'>
            <img
              src={URL.createObjectURL(image)}
              alt={`Preview ${index + 1}`}
              style={{
                width: props?.width || "150px",
                height: props?.height || "150px",
                objectFit: "cover",
              }}
            />
            <div className='absolute top-0 left-0 w-full h-full flex items-center justify-center border-2 border-red-600 bg-black/25 opacity-0 hover:opacity-100 duration-150'>
              <DeleteOutlined
                className='text-red-600'
                onClick={() => {
                  setSelectedImages(
                    selectedImages?.filter((img) => img != image)
                  );
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImages?.length > 0 && (
        <Button
          className='dark:bg-white text-black '
          onClick={props?.handleUpload}
        >
          Upload Images
        </Button>
      )}
    </div>
  );
};

export default MultiImageUpload;
