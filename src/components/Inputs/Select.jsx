import React, { memo, useEffect, useState } from "react";
import { Select } from "antd";

const SelectComponent = (props) => {
  const [value, setValue] = useState(props?.value);
  const handleChange = (e) => {
    setValue(e);
    props?.handleChange(e);
  };
  useEffect(() => {
    setValue(props?.value);
  }, []);
  return (
    <section className={"flex flex-col items-start " + props?.className}>
      <label
        htmlFor={props?.title}
        className='font-semibold dark:text-slate-300 text-sm'
      >
        {props?.title}
      </label>
      <Select
        showSearch
        allowClear
        placeholder={props?.placeholder}
        optionFilterProp='children'
        mode={props?.mode}
        required={props?.required}
        onChange={handleChange}
        defaultValue={value}
        loading={props?.loading}
        className='antdSelect rounded-md w-full  dark:bg-slate-700 border-white/50 dark:placeholder:text-white dark:text-white m-2'
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
        options={props?.options}
      />
    </section>
  );
};

export default SelectComponent;
