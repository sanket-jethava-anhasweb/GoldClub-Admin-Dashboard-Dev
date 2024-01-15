import React from "react";
import { Input, Tooltip } from "antd";
const InputComponent = (props) => {
  // console.log(props);
  return (
    <section className={"flex flex-col" + " " + props?.className}>
      <label
        htmlFor={props?.title}
        className='font-semibold dark:text-slate-300 text-sm'
      >
        {props?.title}
      </label>
      <Input
        // showCount={props?.showCount || false}
        maxLength={props?.maxLength}
        name={props?.name}
        onChange={props?.handleChange}
        id={props?.title}
        placeholder={props?.placeholder}
        className={
          "m-2 w-full bg-transparent dark:bg-slate-700 dark:border-white/50 dark:text-white dark:placeholder:text-white rounded-md "
        }
        allowClear={props?.allowClear}
        required={props?.required}
        value={props?.value}
        {...props}
      />
    </section>
  );
};

export default InputComponent;
