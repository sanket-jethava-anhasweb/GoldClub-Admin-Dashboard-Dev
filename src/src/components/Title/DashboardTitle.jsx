import React from "react";

const DashboardTitle = (props) => {
  return (
    <h4 className="text-slate-900 dark:text-white text-lg font-semibold my-3">
      {props?.title}
    </h4>
  );
};

export default DashboardTitle;
