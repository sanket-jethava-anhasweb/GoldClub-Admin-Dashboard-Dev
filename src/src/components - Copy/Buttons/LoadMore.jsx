import React from "react";

const LoadMore = (props) => {
  return (
    <button
      className="flex items-center justify-center border-2 border-blue-500 px-3 py-2 font-semibold rounded text-sm text-blue-500 hover:bg-blue-500 hover:text-white duration-200 dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-slate-900"
      onClick={props?.handleRefetch}
      loading={props?.loading}
    >
      Load More
    </button>
  );
};

export default LoadMore;
