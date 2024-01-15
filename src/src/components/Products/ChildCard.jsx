import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, ConfigProvider, theme, } from "antd";
const { Meta } = Card;

const ChildCard = ({ product }) => {
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
        to={"/dashboard/b2b/products/" + product?.id}
        className={"productImage flex items-center justify-center dark"}
      >
        <Card
          className={"flex flex-col items-center justify-center min-h-10 shadow-md rounded-md border-2 scale-95 mb-2 products md:min-h-30 hover:-translate-y-2 duration-200 dark:bg-slate-900 bg-white p-2"}
          cover={
            <img
              alt={product?.name}
              src={product?.thumbnail?.url || process.env.PUBLIC_URL + "/no-image.jpg"}
            />
          }
        >
          <Meta
            title={product?.name}
            description={product?.variants[0]?.name?.split("/")[0]}
            // description={product?.attributes[0]?.values[0]?.name + " " + product?.attributes[5]?.values[0]?.name + "k"}
            style={{ width: 250, textAlign: 'center', padding: "10px" }}
          />
          {/* <Meta
            title={"Size : " + product?.variants[0]?.name?.split("/")[0]}
            style={{textAlign: 'center'}}
          /> */}
        </Card>
      </Link>
    </ConfigProvider>
  );
};

export default ChildCard;

