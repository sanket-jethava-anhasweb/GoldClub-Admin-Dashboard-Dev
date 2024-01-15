import React from "react";
import { SearchOutlined } from "@ant-design/icons";
const SearchComponent = (props) => {
  return (
    <div>
      <div class="relative mb-4 flex">
        <input
          type="search"
          id="searchWrapper"
          name="search"
          placeholder="Search for keywords..."
          onKeyUp={props?.handleSearch}
          class="w-full md:w-4/6 rounded-s border border-r-transparent border-gray-300 
          dark:border-gray-700
          focus:border-indigo-500  text-md outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out dark:bg-slate-900 dark:text-white dark:placeholder:text-white "
        />
        <button
          class="inline-flex items-center justify-center text-white bg-blue-700 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded-r text-lg transition-colors duration-200"
          onClick={props?.handleSearch}
        >
          <SearchOutlined />
        </button>
      </div>
    </div>
  );
};

export default SearchComponent;
