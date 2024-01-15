import React from "react";

const SectionTitle = (props) => {
  return (
    <h2 className="font-semibold text-2xl my-4 text-blue-500 dark:text-white">
      {props?.title}
    </h2>
  );
};

SectionTitle.defaultProps = {
  title: "Section Title",
};
export default SectionTitle;
