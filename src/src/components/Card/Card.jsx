import React from "react";
import { Card, Skeleton } from "antd";
import { useSelector } from "react-redux";

const CardComp = (props) => {
  return (
    <Card
      title={props?.title}
      bordered={false}
      className={
        "w-auto dark:bg-slate-200  transition duration-150 " + props?.className
      }
      hoverable={true}
    >
      <Skeleton loading={props?.loading} active></Skeleton>
      {!props?.loading && <p>{props?.children}</p>}
    </Card>
  );
};

CardComp.defaultProps = {
  title: "Card Title",
  children: <p>Hey there</p>,
  loading: false,
};
export default CardComp;
