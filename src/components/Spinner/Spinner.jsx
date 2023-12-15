import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    className='dark:text-white'
    spin
  />
);
const Spinner = () => {
  return (
    <>
      <div
        style={{ borderTopColor: "transparent" }}
        className='w-8 h-8 border-2 border-blue-700 dark:border-white border-solid rounded-full animate-spin  m-auto'
      ></div>
    </>
  );
};

export default Spinner;
