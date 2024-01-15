import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, ConfigProvider, theme, } from "antd";
const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
      <Link
        to={"/dashboard/b2b/products/" + product?.node?.id}
        className={"productImage flex items-center justify-center dark"}
      >
        <Card
          className={"flex flex-col items-center justify-center min-h-10 shadow-md rounded-md border-2 scale-95 mb-2 products md:min-h-30 hover:-translate-y-2 duration-200 dark:bg-slate-900 bg-white p-2"}
          cover={
            <img
              alt={product?.node?.name}
              src={product?.node?.thumbnail?.url || process.env.PUBLIC_URL + "/no-image.jpg"}
            />
          }
        >
          <p className="w-full flex flex-col text-center p-2">
            <span className="font-bold text-xl">{product?.node?.name}</span>
            <span className="font-semibold text-xl dark:text-slate-400 pt-1">⁌{product?.node?.category?.name}⁍</span>
          </p>
        </Card>
      </Link>
    </ConfigProvider>
  );
};

export default ProductCard;
